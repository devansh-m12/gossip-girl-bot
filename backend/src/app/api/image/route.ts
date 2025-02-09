import { NextResponse } from 'next/server';
import { generateTweetImage } from './utils';

// Change to Node.js runtime
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text") || "hey!!!";
    const retweets = searchParams.get("retweets") || "200";
    const quotes = searchParams.get("quotes") || "4K";
    const likes = searchParams.get("likes") || "20K";
    const timestamp = searchParams.get("timestamp") || "6:17 PM · Feb 5, 2023";
    const client = searchParams.get("client") || "Twitter for LG Smart Fridge";

    const result = await generateTweetImage({
      text,
      retweets,
      quotes,
      likes,
      timestamp,
      client
    });

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: `Failed to generate or upload the image: ${e.message}` },
      { status: 500 }
    );
  }
}

