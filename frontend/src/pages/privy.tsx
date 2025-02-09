import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Copy, Wallet, Plus } from 'lucide-react';
import PrivyPolicy from '@/components/PrivyPolicy';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Wallet {
    id: string;
    address: string;
    chainType: string;
    policyIds: string[];
    createdAt: string;
    balance?: string;
}

interface Policy {
    id: string;
    name: string;
    description: string;
}

const Privy = () => {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isWalletsOpen, setIsWalletsOpen] = useState(true);

    // Mock policies data
    const mockPolicies = [
        { id: '1', name: 'Basic Access', description: 'Basic wallet access and transfers' },
        { id: '2', name: 'Advanced Trading', description: 'Access to advanced trading features' },
        { id: '3', name: 'Admin Access', description: 'Full administrative access' },
    ];

    useEffect(() => {
        fetchWallets();
        setPolicies(mockPolicies);
    }, []);

    const fetchWallets = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/privy/wallet`);
            const data = await response.json();
            // Fetch balances for each wallet
            const walletsWithBalances = await Promise.all(
                data.map(async (wallet: Wallet) => {
                    const balanceResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/privy/balance?address=${wallet.address}`);
                    const balanceData = await balanceResponse.json();
                    return { ...wallet, balance: balanceData.balance };
                })
            );
            setWallets(walletsWithBalances);
        } catch (error) {
            console.error('Error fetching wallets:', error);
        } finally {
            setLoading(false);
        }
    };

    const createWallet = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/privy/wallet`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ policyIds: selectedPolicies }),
            });
            if (response.ok) {
                await fetchWallets();
            }
        } catch (error) {
            console.error('Error creating wallet:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Privy Wallet Management</h1>
                <Button onClick={createWallet} disabled={loading}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Wallet
                </Button>
            </div>
            
            <Tabs defaultValue="wallets" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="wallets">Wallets</TabsTrigger>
                    <TabsTrigger value="policies">Policies</TabsTrigger>
                </TabsList>
                
                <TabsContent value="wallets">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div>
                                <CardTitle className="text-2xl">Wallets</CardTitle>
                                <CardDescription>
                                    {wallets.length} wallet{wallets.length !== 1 ? 's' : ''} found
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[600px] pr-4">
                                {loading ? (
                                    <p className="text-muted-foreground">Loading wallets...</p>
                                ) : wallets.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Wallet className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                        <p className="mt-2 text-muted-foreground">No wallets found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {wallets.map((wallet) => (
                                            <div key={wallet.id} 
                                                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="font-medium">{formatAddress(wallet.address)}</p>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm"
                                                                className="h-6 w-6 p-0"
                                                                onClick={() => navigator.clipboard.writeText(wallet.address)}
                                                            >
                                                                <Copy className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Created: {formatDate(wallet.createdAt)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium">{wallet.balance || '0'} ETH</p>
                                                        <Badge variant="secondary" className="mt-1">
                                                            Base Sepolia
                                                        </Badge>
                                                    </div>
                                                </div>
                                                {wallet.policyIds.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {wallet.policyIds.map((policyId) => (
                                                            <Badge key={policyId} variant="outline">
                                                                {policyId}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="policies">
                    <PrivyPolicy />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Privy;