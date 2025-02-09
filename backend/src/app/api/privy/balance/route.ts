import { NextRequest, NextResponse } from 'next/server';

interface EtherscanResponse {
  status: string;
  result: string;
  message?: string;
}

// GET /api/privy/balance/{address}?network={network}
export async function GET(
  request: NextRequest,
) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    
    const response = await fetch(
      `https://api-sepolia.basescan.org/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.BASESCAN_API_KEY}`
    );
    
    const data = await response.json() as EtherscanResponse;
    
    if (data.status === '1') {
      // Convert Wei to ETH
      const balanceInEth = parseInt(data.result) / 1e18;
      return NextResponse.json({ balance: balanceInEth });
    } else {
      throw new Error(data.message || 'Failed to fetch balance');
    }
  } catch (error) {
    console.error('Balance fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch wallet balance' }, { status: 500 });
  }
} 