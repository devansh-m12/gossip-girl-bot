import { Button } from '@/components/ui/button';
import { MessageCircle, FolderHeart, Wallet, Bot, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from "@/components/blocks/hero-section-dark";
import { Footer } from "@/components/Footer";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center bg-black text-white min-h-screen">
      <HeroSection
        title="XOXO, Gossip Girl Here"
        subtitle={{
          regular: "Your one and only source into the ",
          gradient: "scandalous lives of Manhattan's elite",
        }}
        description="Welcome to the digital age of Upper East Side drama. Mint exclusive gossip as NFTs, trade secrets, and manage your digital empire with our next-gen platform."
        ctaText="Spill Your Secrets"
        ctaHref="/chat"
        bottomImage={{
          light: "/face.png",
          dark: "/face.png",
        }}
        gridOptions={{
          angle: 65,
          opacity: 0.3,
          cellSize: 40,
          lightLineColor: "#ff69b4",
          darkLineColor: "#4a0028",
        }}
      />

      <div className="w-full bg-gradient-to-b from-zinc-900 to-black py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] opacity-20" />
        <div className="absolute inset-0 bg-purple-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-sm text-gray-400 group font-geist mx-auto px-5 py-2 bg-gradient-to-tr from-zinc-300/5 via-gray-400/5 to-transparent border-[2px] border-white/5 rounded-3xl w-fit mb-6">
              EXCLUSIVE ACCESS
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] mb-4">
              Unleash Your Inner <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-500">Gossip Girl</span>
            </h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Step into the digital Upper East Side, where secrets become NFTs and every whisper is worth a fortune.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-300/5 to-pink-500/5 rounded-xl blur-xl transition-all duration-300 group-hover:opacity-100 opacity-0" />
              <div className="relative flex flex-col items-center text-center p-8 rounded-xl border border-pink-500/20 backdrop-blur-sm hover:border-pink-500/40 transition-all duration-300 bg-gradient-to-tr from-zinc-300/5 via-purple-400/10 to-transparent">
                <div className="bg-gradient-to-br from-purple-300/10 to-pink-500/10 p-3 rounded-full mb-6 border border-pink-500/20">
                  <MessageCircle className="h-8 w-8 text-pink-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.75)_100%)]">
                  Gossip Chat
                </h3>
                <p className="text-gray-400">
                  Chat with our ELIZA-powered Gossip Girl bot. Share secrets, get the latest gossip, and interact with your favorite character.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-300/5 to-pink-500/5 rounded-xl blur-xl transition-all duration-300 group-hover:opacity-100 opacity-0" />
              <div className="relative flex flex-col items-center text-center p-8 rounded-xl border border-pink-500/20 backdrop-blur-sm hover:border-pink-500/40 transition-all duration-300 bg-gradient-to-tr from-zinc-300/5 via-purple-400/10 to-transparent">
                <div className="bg-gradient-to-br from-purple-300/10 to-pink-500/10 p-3 rounded-full mb-6 border border-pink-500/20">
                  <FolderHeart className="h-8 w-8 text-pink-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.75)_100%)]">
                  NFT Collection
                </h3>
                <p className="text-gray-400">
                  Collect and trade exclusive Gossip Girl moments as NFTs on Base Sepolia. Your digital piece of the Upper East Side.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-300/5 to-pink-500/5 rounded-xl blur-xl transition-all duration-300 group-hover:opacity-100 opacity-0" />
              <div className="relative flex flex-col items-center text-center p-8 rounded-xl border border-pink-500/20 backdrop-blur-sm hover:border-pink-500/40 transition-all duration-300 bg-gradient-to-tr from-zinc-300/5 via-purple-400/10 to-transparent">
                <div className="bg-gradient-to-br from-purple-300/10 to-pink-500/10 p-3 rounded-full mb-6 border border-pink-500/20">
                  <Wallet className="h-8 w-8 text-pink-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.75)_100%)]">
                  Privy Wallet
                </h3>
                <p className="text-gray-400">
                  Manage your digital assets, create policies, and control your server wallets with our integrated Privy system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-black py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ff69b4,transparent_50%)] opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-5 w-5 text-pink-500" />
              <span className="text-xl font-semibold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                XOXO, Gossip Girl
              </span>
              <Sparkles className="h-5 w-5 text-pink-500" />
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gray-400">
              <span className="hover:text-pink-500 transition-colors cursor-pointer">Built with Metaplex ERC721</span>
              <span className="text-pink-500/30">•</span>
              <span className="hover:text-pink-500 transition-colors cursor-pointer">Coinbase OnchainKit</span>
              <span className="text-pink-500/30">•</span>
              <span className="hover:text-pink-500 transition-colors cursor-pointer">Base Sepolia</span>
              <span className="text-pink-500/30">•</span>
              <span className="hover:text-pink-500 transition-colors cursor-pointer">OpenSec</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}