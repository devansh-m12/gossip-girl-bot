import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface TweetCardProps {
  text: string;
  image?: {
    ipfsHash: string;
    ipfsUrl: string;
  };
  nft?: {
    success: boolean;
    transaction: {
      hash: string;
      caip2: string;
    };
    metadata: {
      name: string;
      description: string;
      image: string;
      attributes: Array<{
        trait_type: string;
        value: string;
      }>;
    };
  };
}

export function TweetCard({ text, image, nft }: TweetCardProps) {
  const getBlockExplorerUrl = (hash: string, caip2: string) => {
    const chainId = caip2.split(":")[1];
    switch (chainId) {
      case "84532":
        return `https://base-sepolia.blockscout.com/tx/${hash}`;
      default:
        return `https://etherscan.io/tx/${hash}`;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden backdrop-blur-md bg-white/50 dark:bg-black/50 border-2 border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-all duration-300">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl font-semibold">Latest Tweet</CardTitle>
        <CardDescription className="text-base leading-relaxed">{text}</CardDescription>
      </CardHeader>
      {(image || nft) && (
        <CardContent className="space-y-4">
          {image?.ipfsUrl && (
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={image.ipfsUrl}
                alt="Tweet image"
                className="w-full h-auto object-cover"
              />
              <Badge
                className="absolute top-2 right-2 cursor-pointer bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                onClick={() => window.open(`https://gateway.pinata.cloud/ipfs/${image.ipfsHash}`, "_blank")}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View on IPFS
              </Badge>
            </div>
          )}
          {nft && nft.success && (
            <div className="space-y-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300">
                  {nft.metadata.name}
                </h4>
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800"
                  onClick={() => window.open(getBlockExplorerUrl(nft.transaction.hash, nft.transaction.caip2), "_blank")}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Transaction
                </Badge>
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                {nft.metadata.description}
              </p>
              {nft.metadata.attributes && nft.metadata.attributes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {nft.metadata.attributes.map((attr, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-purple-100 dark:bg-purple-900/50 border-purple-200 dark:border-purple-700"
                    >
                      {attr.trait_type}: {attr.value}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
} 