import { NextResponse } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';
import { headers } from 'next/headers';

// Initialize Privy client
const privy = new PrivyClient(
  process.env.PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

// Health check endpoint
export async function GET() {
  return NextResponse.json({ status: 'ok' });
} 