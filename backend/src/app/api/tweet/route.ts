import { NextRequest, NextResponse } from "next/server";
import { generateTweetImage } from "../image/utils";

export const maxDuration = 60;

let agentId: string | null = null;
const username = process.env.AUTONOMY_USERNAME;
const password = process.env.AUTONOMY_PASSWORD;
const url = process.env.AUTONOMY_URL;

export async function POST(req: NextRequest) {
    try {
        const { message, type } = await req.json();
        const auth = Buffer.from(`${username}:${password}`).toString('base64');
        
        if(agentId === null) {
            const response = await fetch(`${url}/agents`, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${auth}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch agents: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data?.agents || !Array.isArray(data.agents) || data.agents.length === 0) {
                throw new Error('No agents found in the response');
            }
            
            agentId = data.agents[0].id;
        }
        console.log(agentId);

        const callUrl = `${url}/${agentId}/message`;
        console.log(callUrl);
        const body = {
            "text": `make it as a tweet post. ${message}`,
        }
        
        const chatResponse = await fetch(callUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        console.log(chatResponse);
        if (!chatResponse.ok) {
            throw new Error(`Chat request failed: ${chatResponse.status} ${chatResponse.statusText}`);
        }
        
        const chatResult = await chatResponse.json();
        console.log(chatResult?.[0]?.text);

        // Generate tweet image directly using the utility function
        const imageData = await generateTweetImage({
            text: chatResult?.[0]?.text || 'Hello Puppys',
            timestamp: new Date().toLocaleString(),
            client: 'Gossip Girl Web'
        });

        // Generate NFT using the IPFS image
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const host = process.env.VERCEL_URL || 'localhost:3000';
        const nftUrl = `${protocol}://${host}/api/nft`;

        const nftResponse = await fetch(nftUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: `Tweet NFT - ${new Date().toLocaleDateString()}`,
                description: message,
                image: imageData.ipfsUrl
            })
        });

        if (!nftResponse.ok) {
            throw new Error(`NFT generation failed: ${nftResponse.status} ${nftResponse.statusText}`);
        }

        const nftData = await nftResponse.json();
        
        return NextResponse.json({
            ...chatResult,
            image: imageData,
            nft: nftData
        });
    } catch (error) {
        console.error('Error in chat API:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}