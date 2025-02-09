import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const PrivyPolicy = () => {
  // State for fetching wallet policies
  const [walletId, setWalletId] = useState('');
  const [policies, setPolicies] = useState([]);
  const [fetchMessage, setFetchMessage] = useState('');

  // State for creating a new policy
  const [newPolicy, setNewPolicy] = useState({
    walletId: '',
    policyName: '',
    policyType: 'allowlist', // Default type
    config: {}
  });
  const [createMessage, setCreateMessage] = useState('');

  // State for updating a wallet with a policy
  const [updateData, setUpdateData] = useState({
    walletId: '',
    policyId: ''
  });
  const [updateMessage, setUpdateMessage] = useState('');

  const [configText, setConfigText] = useState('{}');

  // Function to fetch wallet policies (GET /api/privy/policy?walletId=xxx)
  const fetchPolicies = async () => {
    if (!walletId) {
      setFetchMessage('Please enter a wallet ID.');
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/privy/policy?walletId=${walletId}`);
      const data = await res.json();
      setPolicies(data);
      setFetchMessage('Policies fetched successfully.');
    } catch (err) {
      console.error('Error fetching policies:', err);
      setFetchMessage('Error fetching policies.');
    }
  };

  // Function to create a new policy (POST /api/privy/policy)
  const createPolicy = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let configJson = {};
      
      // Handle different policy types
      if (newPolicy.policyType === 'denylist') {
        try {
          const addressValue = JSON.parse(configText).denylistAddress;
          configJson = { denylistAddress: addressValue };
        } catch (err) {
          setCreateMessage('Invalid denylist address format');
          return;
        }
      } else {
        // For other policy types, parse the full JSON config
        try {
          configJson = JSON.parse(configText);
        } catch (err) {
          setCreateMessage('Invalid JSON in config');
          return;
        }
      }

      const policyData = {
        ...newPolicy,
        config: configJson
      };

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/privy/policy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(policyData)
      });
      if (!res.ok) {
        const errorData = await res.json();
        setCreateMessage(`Error creating policy: ${errorData.error}`);
        return;
      }
      const data = await res.json();
      setCreateMessage(`Policy created successfully with ID: ${data.id}`);
      // Optionally refresh the wallet policies after creation
      if (newPolicy.walletId) {
        setWalletId(newPolicy.walletId);
        fetchPolicies();
      }
    } catch (err) {
      console.error('Policy creation error:', err);
      setCreateMessage('Error creating policy.');
    }
  };

  // Function to update a wallet with a new policy (PATCH /api/privy/policy)
  const updatePolicy = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/privy/policy`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      if (!res.ok) {
        const errorData = await res.json();
        setUpdateMessage(`Error updating wallet: ${errorData.error}`);
        return;
      }
      const data = await res.json();
      setUpdateMessage('Wallet updated successfully with new policy.');
      // Optionally refresh policies if the wallet IDs match
      if (updateData.walletId === walletId) {
        fetchPolicies();
      }
    } catch (err) {
      console.error('Policy update error:', err);
      setUpdateMessage('Error updating wallet.');
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Privy Policy Manager</h1>
      
      {/* Section for fetching wallet policies */}
      <Card>
        <CardHeader>
          <CardTitle>Fetch Wallet Policies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Enter Wallet ID"
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
            />
            <Button onClick={fetchPolicies}>Fetch Policies</Button>
          </div>
          {fetchMessage && <p className="text-sm text-muted-foreground">{fetchMessage}</p>}
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            {JSON.stringify(policies, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Section for creating a new policy */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createPolicy} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wallet-id">Wallet ID</Label>
                <Input
                  id="wallet-id"
                  type="text"
                  placeholder="Wallet ID"
                  value={newPolicy.walletId}
                  onChange={(e) =>
                    setNewPolicy({ ...newPolicy, walletId: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="policy-name">Policy Name</Label>
                <Input
                  id="policy-name"
                  type="text"
                  placeholder="Policy Name"
                  value={newPolicy.policyName}
                  onChange={(e) =>
                    setNewPolicy({ ...newPolicy, policyName: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="policy-type">Policy Type</Label>
              <select
                id="policy-type"
                value={newPolicy.policyType}
                onChange={(e) =>
                  setNewPolicy({ ...newPolicy, policyType: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="allowlist">Allowlist</option>
                <option value="denylist">Denylist</option>
                <option value="nativeLimit">Native Limit</option>
                <option value="erc20Limit">ERC20 Limit</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="config">Configuration</Label>
              <Textarea
                id="config"
                rows={8}
                placeholder='For denylist policy, use format:
{
  "denylistAddress": "0x1234..."
}

For allowlist policy, use format:
{
  "method_rules": [{
    "method": "*",
    "rules": [{
      "conditions": [{
        "field": "to",
        "operator": "in",
        "value": ["0x1234..."]
      }]
    }]
  }]
}'
                value={configText}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  setConfigText(e.target.value);
                }}
                className="font-mono"
              />
            </div>
            <Button type="submit">Create Policy</Button>
            {createMessage && <p className="text-sm text-muted-foreground mt-2">{createMessage}</p>}
          </form>
        </CardContent>
      </Card>

      {/* Section for updating a wallet with a new policy */}
      <Card>
        <CardHeader>
          <CardTitle>Update Wallet with Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={updatePolicy} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="update-wallet-id">Wallet ID</Label>
                <Input
                  id="update-wallet-id"
                  type="text"
                  placeholder="Wallet ID"
                  value={updateData.walletId}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, walletId: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="policy-id">Policy ID</Label>
                <Input
                  id="policy-id"
                  type="text"
                  placeholder="Policy ID"
                  value={updateData.policyId}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, policyId: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <Button type="submit">Update Wallet</Button>
            {updateMessage && <p className="text-sm text-muted-foreground mt-2">{updateMessage}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivyPolicy;