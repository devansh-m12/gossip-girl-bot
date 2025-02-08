import { NextRequest, NextResponse } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';

const privy = new PrivyClient(
  process.env.PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

// GET /api/privy/policy?walletId={walletId} - Get policies for a wallet
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get('walletId');
    
    if (!walletId) {
      return NextResponse.json({ error: 'Wallet ID is required' }, { status: 400 });
    }

    const response = await privy.walletApi.getWallet({ id: walletId });
    
    if (!response.policyIds?.length) {
      return NextResponse.json([]);
    }

    const policies = await Promise.all(
      response.policyIds.map(async (policyId: string) => {
        const policyRes = await fetch(`https://api.privy.io/v1/policies/${policyId}`, {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${process.env.PRIVY_APP_ID}:${process.env.PRIVY_APP_SECRET}`).toString('base64')}`,
            'privy-app-id': process.env.PRIVY_APP_ID!
          }
        });
        return policyRes.json();
      })
    );

    return NextResponse.json(policies);
  } catch (error) {
    console.error('Policy fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch policies' }, { status: 500 });
  }
}

// POST /api/privy/policy - Create a new policy
export async function POST(request: NextRequest) {
  try {
    const { walletId, policyName, policyType, config } = await request.json();

    if (policyType === 'erc20Limit' && !config.contractAddress?.startsWith('0x')) {
      return NextResponse.json({ error: 'Invalid ERC20 contract address' }, { status: 400 });
    }
    
    if (policyType === 'nativeLimit' && isNaN(Number(config.nativeMax))) {
      return NextResponse.json({ error: 'Invalid native token amount' }, { status: 400 });
    }
    
    let policyPayload: any = {
      version: '1.0',
      name: policyName,
      chain_type: 'ethereum',
      method_rules: [],
      default_action: 'DENY'
    };

    switch (policyType) {
      case 'allowlist':
        policyPayload.method_rules.push({
          method: 'eth_sendTransaction',
          rules: [{
            name: 'Allowlist Contract',
            conditions: [
              { field_source: 'ethereum_transaction', field: 'to', operator: 'eq', value: config.allowlistAddress },
            ],
            action: 'ALLOW'
          }]
        });
        break;

      case 'denylist':
        policyPayload.method_rules.push({
          method: 'eth_sendTransaction',
          rules: [{
            name: 'Denylist Address',
            conditions: [
              { field_source: 'ethereum_transaction', field: 'to', operator: 'eq', value: config.denylistAddress }
            ],
            action: 'DENY'
          }]
        });
        policyPayload.default_action = 'ALLOW';
        break;

      case 'nativeLimit':
        policyPayload.method_rules.push({
          method: 'eth_sendTransaction',
          rules: [{
            name: 'Native Transfer Limit',
            conditions: [
              { 
                field_source: 'ethereum_transaction', 
                field: 'value', 
                operator: 'lte', 
                value: `0x${(Number(config.nativeMax) * 1e18).toString(16)}`
              }
            ],
            action: 'ALLOW'
          }]
        });
        break;

      case 'erc20Limit':
        policyPayload.method_rules.push({
          method: 'eth_sendTransaction',
          rules: [{
            name: 'ERC20 Transfer Limit',
            conditions: [
              { field_source: 'ethereum_transaction', field: 'to', operator: 'eq', value: config.contractAddress },
              { field_source: 'ethereum_transaction', field: 'chain_id', operator: 'eq', value: config.chainId },
              {
                field_source: 'ethereum_calldata',
                field: 'transfer.amount',
                abi: [{
                  inputs: [
                    { internalType: 'address', name: 'recipient', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' }
                  ],
                  name: 'transfer',
                  outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                  stateMutability: 'nonpayable',
                  type: 'function'
                }],
                operator: 'lte',
                value: `0x${(Number(config.maxAmount) * 1e18).toString(16)}`
              }
            ],
            action: 'ALLOW'
          }]
        });
        break;
    }

    // Create policy
    const policyResponse = await fetch('https://api.privy.io/v1/policies', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.PRIVY_APP_ID}:${process.env.PRIVY_APP_SECRET}`).toString('base64')}`,
        'privy-app-id': process.env.PRIVY_APP_ID!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(policyPayload)
    });

    if (!policyResponse.ok) {
      throw new Error(await policyResponse.text());
    }
    
    const policy = await policyResponse.json();

    // Apply to wallet
    const walletResponse = await fetch(`https://api.privy.io/v1/wallets/${walletId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.PRIVY_APP_ID}:${process.env.PRIVY_APP_SECRET}`).toString('base64')}`,
        'privy-app-id': process.env.PRIVY_APP_ID!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ policy_ids: [policy.id] })
    });

    if (!walletResponse.ok) {
      throw new Error(await walletResponse.text());
    }

    return NextResponse.json(policy);
  } catch (error) {
    console.error('Policy creation error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Policy creation failed' 
    }, { status: 500 });
  }
}

// PATCH /api/privy/policy - Update policy for a wallet
export async function PATCH(request: NextRequest) {
  try {
    const { walletId, policyId } = await request.json();
    
    // First get current policies
    const currentWallet = await privy.walletApi.getWallet({ id: walletId });
    const currentPolicyIds = currentWallet.policyIds || [];
    
    const walletUpdateResponse = await fetch(`https://api.privy.io/v1/wallets/${walletId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.PRIVY_APP_ID}:${process.env.PRIVY_APP_SECRET}`).toString('base64')}`,
        'privy-app-id': process.env.PRIVY_APP_ID!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        policy_ids: [...currentPolicyIds, policyId]
      })
    });

    if (!walletUpdateResponse.ok) {
      throw new Error(await walletUpdateResponse.text());
    }
    
    const updatedPolicy = await walletUpdateResponse.json();
    return NextResponse.json(updatedPolicy);
  } catch (error) {
    console.error('Policy update error:', error);
    return NextResponse.json({ error: 'Policy update failed' }, { status: 500 });
  }
} 