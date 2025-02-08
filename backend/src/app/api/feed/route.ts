import { NextRequest, NextResponse } from "next/server";
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

        const callUrl = `${url}/data/${agentId}`;
        console.log(callUrl);
        const body = [{
            "id": "413747040",
            "text": message,
            "timestamp": Date.now()
        }]
        
        const chatResponse = await fetch(callUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if (!chatResponse.ok) {
            throw new Error(`Chat request failed: ${chatResponse.status} ${chatResponse.statusText}`);
        }
        
        const chatResult = await chatResponse.json();
        return NextResponse.json(chatResult);
    } catch (error) {
        console.error('Error in chat API:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}