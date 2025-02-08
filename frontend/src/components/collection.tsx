import React, { useState, useEffect } from 'react';
import { NFTCard } from '@coinbase/onchainkit/nft';
import { NFTMedia, NFTTitle, NFTOwner, NFTNetwork, NFTLastSoldPrice, NFTMintDate } from '@coinbase/onchainkit/nft/view';

// Replace with your actual contract address
const CONTRACT_ADDRESS = '0x9B45D1C8b359f06D04F4Fa8b23774E1C854918D7';

// Define the structure for our NFT data
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

const Collection: React.FC = () => {
  const [nfts, setNFTs] = useState<NFTData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch NFT metadata using the Alchemy API
  const fetchNFTs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Retrieve your Alchemy API key from env variables
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

      // Map the API response to our NFTData interface
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

  // Basic loading and error UI states
  if (isLoading) {
    return <div className="p-8 text-center">Loading NFT Collection…</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error loading collection: {error}
      </div>
    );
  }

  if (!nfts.length) {
    return (
      <div className="p-8 text-center text-gray-600">
        No NFTs found in this collection.
      </div>
    );
  }

  return (
    <div className="h-[40rem] flex flex-col justify-center items-center px-4 text-center">
      <header className="mb-10">
        <h2 className="mb-10 sm:mb-15 text-xl sm:text-5xl dark:text-white text-black text-center max-w-xl mx-auto">
          NFT Collection
        </h2>
        <h3 className="mb-10 sm:mb-5 text-xl sm:text-2xl dark:text-gray-400 text-black text-center max-w-lg mx-auto">
          Explore our unique digital assets on the blockchain.
        </h3>
      </header>

      {/* Render NFT cards in a responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {nfts.map((nft) => (
          <NFTCard
            key={nft.tokenId}
            contractAddress={CONTRACT_ADDRESS}
            tokenId={nft.tokenId}
            useNFTData={() => ({
              title: nft.title || `NFT #${nft.tokenId}`,
              description: nft.description,
              imageUrl: nft.imageUrl,
              mimeType: nft.mimeType
            })}
          >
            <NFTMedia square />
            <div className="p-3">
              <NFTTitle className="text-xl font-semibold" />
              <NFTOwner className="mt-1 text-sm " />
              <NFTNetwork />
              <NFTLastSoldPrice />
              <NFTMintDate />
            </div>
          </NFTCard>
        ))}
      </div>
    </div>
  );
};

export default Collection;