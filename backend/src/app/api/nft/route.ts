import { NextResponse } from "next/server";
import privy from "@/utils";
import { BASE_SEPOLIA } from "@/constants";
import { ethers } from "ethers";
import abi from "@/lib/abi.json";
import { createThirdwebClient, defineChain, getContract, prepareContractCall } from "thirdweb";

// Environment variable validation
const requiredEnvVars = {
    WALLET_ID: process.env.WALLET_ID,
    NFT_CONTRACT_ADDRESS: process.env.NFT_CONTRACT_ADDRESS
};

// Validate environment variables on startup
function validateEnvironment() {
    const missingVars = Object.entries(requiredEnvVars)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
}

// Process and validate image URL or base64
async function processImage(imageInput: string): Promise<string> {
    try {
        if (imageInput.startsWith('data:image')) {
            // Convert base64 to URL by uploading to your preferred storage
            // For this example, we'll return the base64 directly
            return imageInput;
        } 
        
        if (imageInput.startsWith('http')) {
            // Validate URL
            const response = await fetch(imageInput);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }
            return imageInput;
        }

        throw new Error('Invalid image format. Must be base64 or URL');
    } catch (error: any) {
        throw new Error(`Image processing failed: ${error.message}`);
    }
}

// Generate metadata object
function generateMetadata(name: string, description: string, image: string) {
    return {
        name,
        description,
        image,
        attributes: [
            {
                trait_type: "Created",
                value: new Date().toISOString()
            }
        ]
    };
}

// Input validation
interface MintRequest {

    image: string;
}

function validateInput(input: any): MintRequest {
    const { image } = input;
    
    
    if (!image || typeof image !== 'string') {
        throw new Error('Invalid or missing image');
    }

    return { image };
}

export async function POST(request: Request) {
    try {
        // Validate environment first
        validateEnvironment();

        // Parse and validate request body
        const rawBody = await request.json();
        const { image } = validateInput(rawBody);
        const name = rawBody.name || 'Gossip Girl';
        const description = rawBody.description || 'Gossip Girl is a bot that can tweet and mint NFTs';

        // Get wallet from Privy
        const wallet = await privy.walletApi.getWallet({ 
            id: requiredEnvVars.WALLET_ID as string 
        });
        
        if (!wallet?.address) {
            throw new Error('Failed to retrieve valid wallet');
        }

        // Process image
        const processedImage = await processImage(image);

        // Generate metadata
        const metadata = generateMetadata(name, description, processedImage);

        // Convert metadata to base64 encoded URI
        const jsonString = JSON.stringify(metadata);
        const base64Metadata = Buffer.from(jsonString).toString('base64');
        const uri = `data:application/json;base64,${base64Metadata}`;

        const client = createThirdwebClient({
            clientId: wallet.id,
          });

        // Create contract interface
        const contract = getContract({
            client,
            chain: defineChain(84532),
            address: requiredEnvVars.NFT_CONTRACT_ADDRESS as string,
          });
        
        // Encode the mintTo function call
        const preparedCall:any = await prepareContractCall({
            contract,
            method:
              "function mintTo(address _to, string _uri) returns (uint256)",
            params: [wallet.address, uri],
          });

        console.log(preparedCall);
        const encodedCallData = await preparedCall?.data();

        // Send transaction
        const transactionResult = await privy.walletApi.ethereum.sendTransaction({
            walletId: process.env.WALLET_ID as string,
            caip2: `eip155:${BASE_SEPOLIA.chainId}`,
            method: "signAndSendTransaction", // Indicates to sign and broadcast the transaction
            transaction: {
              to: process.env.NFT_CONTRACT_ADDRESS as string,
              data: encodedCallData, // Must be a string, not an object
              value: "0x0",
              chainId: BASE_SEPOLIA.chainId,
            },
          });

        return NextResponse.json({
            success: true,
            transaction: transactionResult,
            uri,
            metadata
        }, { status: 200 });

    } catch (error: any) {
        console.error("NFT Minting Error:", error);
        
        // Determine appropriate status code
        let statusCode = 500;
        if (error.message.includes('Invalid or missing')) {
            statusCode = 400;
        }

        return NextResponse.json({
            success: false,
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: statusCode });
    }
}