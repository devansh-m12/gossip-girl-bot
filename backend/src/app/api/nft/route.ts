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
            
            if (nft && nft.metadata) {
                return nft;
            }
            
            delay *= 2;
        } catch (error) {
            if (i === maxAttempts - 1) {
                throw new Error(`Failed to confirm NFT creation after ${maxAttempts} attempts`);
            }
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

// Helper function to serialize NFT response
function serializeNftResponse(data: any): any {
    return JSON.parse(JSON.stringify(data, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
}

// GET endpoint to fetch NFT details
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

        const nft = await fetchDigitalAsset(umi, publicKey(mintAddress));

        return NextResponse.json(serializeNftResponse({
            success: true,
            nft: nft
        }));

    } catch (error) {
        console.error('Error fetching NFT:', error);
        const message = error instanceof Error ? error.message : 'Failed to fetch NFT';
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}

// POST endpoint to create a new NFT
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, uri, collectionAddress } = body;

        // Validate required parameters
        if (!name || !uri) {
            return NextResponse.json(
                { error: 'Missing required parameters: name and uri are required' },
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

        // Validate collection address if provided
        if (collectionAddress) {
            try {
                new PublicKey(collectionAddress);
            } catch {
                return NextResponse.json(
                    { error: 'Invalid collection address format' },
                    { status: 400 }
                );
            }
        }

        // Set up connection
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

        // Set up Umi
        const umi = createUmi(connection.rpcEndpoint);
        umi.use(mplTokenMetadata());
        const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
        umi.use(keypairIdentity(umiUser));

        // Generate NFT mint signer
        const mint = generateSigner(umi);

        // Prepare NFT creation parameters
        const nftParams: any = {
            mint,
            name,
            uri,
            sellerFeeBasisPoints: percentAmount(0),
        };

        // Add collection if provided
        if (collectionAddress) {
            nftParams.collection = {
                key: publicKey(collectionAddress),
                verified: false,
            };
        }

        // Create the NFT
        const transaction = await createNft(umi, nftParams);
        await transaction.sendAndConfirm(umi);

        // Wait for the NFT to be available
        const createdNft = await waitForConfirmation(
            umi,
            mint.publicKey,
            10,
            2000
        );

        return NextResponse.json(serializeNftResponse({
            success: true,
            nft: createdNft,
            mintAddress: mint.publicKey
        }));

    } catch (error) {
        console.error('Error creating NFT:', error);
        const message = error instanceof Error ? error.message : 'Failed to create NFT';
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
