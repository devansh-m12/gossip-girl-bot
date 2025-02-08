import { NextRequest, NextResponse } from 'next/server';
import privy from '@/utils';

// GET /api/privy/wallet - Get all wallets
export async function GET() {
  try {
    const wallets = [];
    let nextCursor;
    
    do {
      const result = await privy.walletApi.getWallets({
        chainType: 'ethereum',
        cursor: nextCursor
      });
      wallets.push(...result.data);
      nextCursor = result.nextCursor;
    } while (nextCursor);
    
    return NextResponse.json(wallets);
  } catch (error) {
    console.error('Wallet fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch wallets' }, { status: 500 });
  }
}

// POST /api/privy/wallet - Create a new wallet
export async function POST(request: NextRequest) {
  try {
    const { policyIds } = await request.json();
    const wallet = await privy.walletApi.create({
      chainType: 'ethereum',
      policyIds: policyIds || []
    });
    return NextResponse.json(wallet);
  } catch (error) {
    console.error('Wallet creation error:', error);
    return NextResponse.json({ error: 'Wallet creation failed' }, { status: 500 });
  }
} 