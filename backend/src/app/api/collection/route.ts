import { NextRequest, NextResponse } from "next/server";
import { 
    createNft, 
    fetchDigitalAsset, 
    mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
    airdropIfRequired,
} from "@solana-developers/helpers";
import {
    createUmi,
} from "@metaplex-foundation/umi-bundle-defaults";
import { 
    generateSigner, 
    percentAmount,
    keypairIdentity,
    publicKey,
    Signer,
} from "@metaplex-foundation/umi";
import {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    Keypair,
} from "@solana/web3.js";
import bs58 from "bs58";

// Helper function to get keypair from environment variables
function getKeypairFromEnv(): Keypair {
    const privateKeyString = process.env.PRIVATE_KEY;
    if (!privateKeyString) {
        throw new Error('PRIVATE_KEY environment variable is not set');
    }
    
    try {
        const decodedKey = bs58.decode(privateKeyString);
        return Keypair.fromSecretKey(decodedKey);
    } catch (error) {
        throw new Error('Invalid private key format');
    }
}

// Improved confirmation helper with exponential backoff
async function waitForConfirmation(
    umi: any, 
    mintAddress: string, 
    maxAttempts = 10,
    initialDelay = 1000
): Promise<any> {
    let delay = initialDelay;
    
    for (let i = 0; i < maxAttempts; i++) {
        try {
            await new Promise(resolve => setTimeout(resolve, delay));
            const nft = await fetchDigitalAsset(umi, publicKey(mintAddress));
            
            // Verify the NFT data exists
            if (nft && nft.metadata) {
                return nft;
            }
            
            // Double the delay for next attempt (exponential backoff)
            delay *= 2;
        } catch (error) {
            if (i === maxAttempts - 1) {
                throw new Error(`Failed to confirm NFT creation after ${maxAttempts} attempts`);
            }
            // Double the delay for next attempt
            delay *= 2;
            continue;
        }
    }
    
    throw new Error('Failed to confirm NFT creation');
}

// Helper to validate URI format
function isValidUri(uri: string): boolean {
    try {
        new URL(uri);
        return true;
    } catch {
        return false;
    }
}

// Add this helper function near the top with other helpers
function serializeNftResponse(data: any): any {
    return JSON.parse(JSON.stringify(data, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
}

// GET endpoint to fetch collection NFT
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const mintAddress = searchParams.get('mintAddress');

        if (!mintAddress) {
            return NextResponse.json(
                { error: 'Missing mintAddress parameter' },
                { status: 400 }
            );
        }

        // Validate mint address format
        try {
            new PublicKey(mintAddress);
        } catch {
            return NextResponse.json(
                { error: 'Invalid mint address format' },
                { status: 400 }
            );
        }

        const connection = new Connection(
            "https://api.devnet.solana.com", 
            { commitment: 'confirmed', confirmTransactionInitialTimeout: 60000 }
        );
        const umi = createUmi(connection.rpcEndpoint);
        umi.use(mplTokenMetadata());

        const collectionNft = await fetchDigitalAsset(umi, publicKey(mintAddress));

        return NextResponse.json(serializeNftResponse({
            success: true,
            collection: collectionNft
        }));

    } catch (error) {
        console.error('Error fetching collection:', error);
        const message = error instanceof Error ? error.message : 'Failed to fetch collection';
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}

// POST endpoint to create a new collection
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, symbol, uri } = body;

        // Validate required parameters
        if (!name || !symbol || !uri) {
            return NextResponse.json(
                { error: 'Missing required parameters: name, symbol, and uri are required' },
                { status: 400 }
            );
        }

        // Validate URI format
        if (!isValidUri(uri)) {
            return NextResponse.json(
                { error: 'Invalid URI format' },
                { status: 400 }
            );
        }

        // Validate name and symbol length
        if (name.length > 32 || symbol.length > 10) {
            return NextResponse.json(
                { error: 'Name must be <= 32 chars and symbol <= 10 chars' },
                { status: 400 }
            );
        }

        // Set up connection with higher timeout
        const connection = new Connection(
            "https://api.devnet.solana.com",
            { commitment: 'confirmed', confirmTransactionInitialTimeout: 60000 }
        );
        
        // Get and validate user keypair
        const user = getKeypairFromEnv();

        // Ensure sufficient SOL balance
        try {
            await airdropIfRequired(
                connection,
                user.publicKey,
                1 * LAMPORTS_PER_SOL,
                0.5 * LAMPORTS_PER_SOL
            );
        } catch (error) {
            console.error('Airdrop failed:', error);
            throw new Error('Failed to ensure sufficient SOL balance');
        }

        // Set up Umi with proper configuration
        const umi = createUmi(connection.rpcEndpoint);
        umi.use(mplTokenMetadata());
        const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
        umi.use(keypairIdentity(umiUser));

        // Generate collection mint signer
        const collectionMint = generateSigner(umi);

        // Create the NFT collection with retry logic
        const transaction = await createNft(umi, {
            mint: collectionMint,
            name,
            symbol,
            uri,
            sellerFeeBasisPoints: percentAmount(0),
            isCollection: true,
        });

        // Send transaction with confirmation
        await transaction.sendAndConfirm(umi);

        // Wait for the NFT to be available with increased timeout
        const createdCollectionNft = await waitForConfirmation(
            umi,
            collectionMint.publicKey,
            10,  // 10 attempts
            2000  // Start with 2 second delay
        );

        return NextResponse.json(serializeNftResponse({
            success: true,
            collection: createdCollectionNft,
            mintAddress: collectionMint.publicKey
        }));

    } catch (error) {
        console.error('Error creating collection:', error);
        const message = error instanceof Error ? error.message : 'Failed to create collection';
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}