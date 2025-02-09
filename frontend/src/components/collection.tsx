"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Layers, Wallet, Clock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TransferNFTModal } from "@/components/TransferNFTModal";

// Replace with your actual contract address
const CONTRACT_ADDRESS = '0x9B45D1C8b359f06D04F4Fa8b23774E1C854918D7';

interface NFTData {
  tokenId: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  mimeType?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

export default function Collection() {
  const [nfts, setNFTs] = useState<NFTData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNFT, setSelectedNFT] = useState<NFTData | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const fetchNFTs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;
      if (!alchemyKey) {
        throw new Error('Alchemy API key not found');
      }

      const response = await fetch(
        `https://base-sepolia.g.alchemy.com/v2/${alchemyKey}/getNFTsForCollection?contractAddress=${CONTRACT_ADDRESS}&withMetadata=true`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch NFTs');
      }
      const data = await response.json();

      const formattedNFTs: NFTData[] = data.nfts.map((nft: any) => ({
        tokenId: nft.id.tokenId,
        title: nft.title,
        description: nft.description,
        imageUrl: nft.media?.[0]?.gateway || '',
        mimeType: nft.media?.[0]?.format || 'image/jpeg',
        attributes: nft.metadata?.attributes || []
      }));

      setNFTs(formattedNFTs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching NFTs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  const handleNFTClick = (nft: NFTData) => {
    setSelectedNFT(nft);
    setIsTransferModalOpen(true);
  };

  const handleTransferNFT = async (to: string) => {
    // Implement the actual transfer logic here
    console.log(`Transferring NFT ${selectedNFT?.tokenId} to ${to}`);
    // You would typically call a smart contract method here
    // For now, we'll just log and close the modal
    setIsTransferModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-[300px]" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="p-6 border-destructive">
          <div className="text-center text-destructive">
            <p className="text-lg font-semibold">Error loading collection</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!nfts.length) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="p-6">
          <div className="text-center text-muted-foreground">
            <Layers className="mx-auto h-12 w-12 mb-4" />
            <p className="text-lg font-semibold">No NFTs Found</p>
            <p className="text-sm mt-2">This collection appears to be empty.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-center">NFT Collection</h1>
        <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto">
          Explore our curated collection of unique digital assets on the blockchain.
        </p>
      </div>

      <div className="flex justify-end mb-4">
        <Button variant="outline" className="gap-2">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-8">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              All
            </TabsTrigger>
            <TabsTrigger value="owned" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Owned
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-8">
          <ScrollArea className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nfts.map((nft) => (
                <Card
                  key={nft.tokenId}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleNFTClick(nft)}
                >
                  <div className="relative">
                    <img
                      src={nft.imageUrl || "/placeholder.svg"}
                      alt={nft.title || `NFT #${nft.tokenId}`}
                      className="w-full h-64 object-cover"
                    />
                    <Badge
                      className="absolute top-2 right-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        const tokenIdNumber = parseInt(nft.tokenId, 16);
                        window.open(`https://base-sepolia.blockscout.com/token/${CONTRACT_ADDRESS}/instance/${tokenIdNumber}`, "_blank");
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View on Blockscout
                    </Badge>
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="text-lg font-semibold line-clamp-1">
                      {nft.title || `NFT #${nft.tokenId}`}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {nft.description || 'No description available'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="owned">
          <div className="text-center text-muted-foreground py-12">
            Connect your wallet to view owned NFTs
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="text-center text-muted-foreground py-12">
            Recent activity will appear here
          </div>
        </TabsContent>
      </Tabs>

      <TransferNFTModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        tokenId={selectedNFT?.tokenId || ''}
        onTransfer={handleTransferNFT}
      />
    </div>
  );
}