import { NextRequest, NextResponse } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';

const privy = new PrivyClient(
  process.env.PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

// POST /api/privy/transaction/sign - Sign a message
export async function POST(request: NextRequest) {
  try {
    const { walletId, message } = await request.json();
    const response = await privy.walletApi.ethereum.signMessage({
      walletId,
      message
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error('Sign message error:', error);
    return NextResponse.json({ error: 'Failed to sign message' }, { status: 500 });
  }
}

// POST /api/privy/transaction/send - Send a transaction
export async function PUT(request: NextRequest) {
  try {
    const { walletId, to, value, chainId } = await request.json();
    
    // Convert Ether to Wei and then to hex format with '0x' prefix
    const valueInWei = BigInt(Math.floor(parseFloat(value) * 1e18));
    const valueInHex = '0x' + valueInWei.toString(16);
    
    const response = await privy.walletApi.ethereum.sendTransaction({
      walletId,
      caip2: `eip155:${chainId}`,
      transaction: {
        to,
        value: valueInHex,
        chainId: parseInt(chainId)
      }
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Transaction error:', error);
    return NextResponse.json({ 
      error: 'Transaction failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 