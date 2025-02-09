import { AIInputWithSuggestions } from "@/components/ui/ai-input-with-suggestions";
import { MessageCircle, Globe, Lock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TweetCard } from "@/components/TweetCard";

const CUSTOM_ACTIONS = [
    {
        text: "Tweet",
        icon: MessageCircle,
        colors: {
            icon: "text-blue-600",
            border: "border-blue-500",
            bg: "bg-blue-100",
        },
    },
    {
        text: "General",
        icon: Globe,
        colors: {
            icon: "text-green-600",
            border: "border-green-500",
            bg: "bg-green-100",
        },
    },
    {
        text: "Spill Secret",
        icon: Lock,
        colors: {
            icon: "text-purple-600",
            border: "border-purple-500",
            bg: "bg-purple-100",
        },
    },
];

const Chat = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [replay, setReplay] = useState("Hello, I'm your AI friend. How can I help you today?");
    const [error, setError] = useState<string | null>(null);
    const [tweetData, setTweetData] = useState<{
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
    } | null>(null);

    const handleSubmit = async (text: string, action?: string) => {
        if (!text.trim() || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);
        setTweetData(null);
        
        try {
            let endpoint = '';
            let payload = {};

            switch (action?.toLowerCase() || 'general') {
                case 'tweet':
                    endpoint = '/api/tweet';
                    payload = {
                        tweet: text,
                        timestamp: new Date().toISOString()
                    };
                    break;
                case 'general':
                    endpoint = '/api/chat';
                    payload = {
                        message: text,
                        type: 'general',
                        timestamp: new Date().toISOString()
                    };
                    break;
                case 'spill secret':
                    endpoint = '/api/feed';
                    payload = {
                        secret: text,
                        isAnonymous: true,
                        timestamp: new Date().toISOString()
                    };
                    break;
                default:
                    throw new Error('Invalid action selected');
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Failed to submit ${action}. Please try again.`);
            }

            const data = await response.json();

            // Handle different response formats based on action
            switch (action?.toLowerCase() || 'general') {
                case 'tweet':
                    // Handle tweet response with image and NFT data
                    if (data[0]?.text) {
                        setTweetData({
                            text: data[0].text,
                            image: data.image,
                            nft: data.nft
                        });
                        setReplay(''); // Clear the replay when showing tweet card
                    }
                    break;

                case 'general':
                    // Handle chat response with array of messages
                    if (Array.isArray(data) && data[0]?.text) {
                        setReplay(data[0].text);
                    }
                    break;

                case 'spill secret':
                    // Handle feed response with status
                    if (data.status === 'completed') {
                        setReplay('Your secret has been successfully shared!');
                    } else {
                        throw new Error('Failed to share your secret');
                    }
                    break;

                default:
                    setReplay('Received response but action type is unknown');
            }
        } catch (error) {
            console.error(`Error submitting ${action}:`, error);
            setError(error instanceof Error ? error.message : 'An unexpected error occurred');
            setReplay(''); // Clear the replay when there's an error
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-8 backdrop-blur-sm bg-white/30 dark:bg-black/30 p-8 rounded-3xl shadow-xl border border-white/20 dark:border-white/10">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl sm:text-5xl font-bold dark:text-white text-black animate-fade-in">
                        Welcome, Upper East Sider
                    </h2>
                    <h3 className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
                        Ready to spill some tea? Choose your message type and let the drama unfold...
                    </h3>
                </div>

                <div className="w-full max-w-2xl">
                    <AIInputWithSuggestions 
                        actions={CUSTOM_ACTIONS}
                        defaultSelected="General"
                        placeholder="XOXO, Gossip Girl..."
                        onSubmit={handleSubmit}
                    />
                </div>

                <div className="w-full max-w-2xl">
                    {error ? (
                        <div className={cn(
                            "p-8 rounded-2xl border-2 shadow-lg transition-all duration-300 min-h-[200px] flex items-center justify-center backdrop-blur-md",
                            "bg-red-50/50 dark:bg-red-950/50 border-red-300 dark:border-red-700"
                        )}>
                            <div className="flex flex-col gap-2">
                                <p className="text-lg sm:text-xl font-medium text-red-600 dark:text-red-400">Error</p>
                                <p className="text-base text-red-500 dark:text-red-400">{error}</p>
                            </div>
                        </div>
                    ) : tweetData ? (
                        <TweetCard {...tweetData} />
                    ) : replay && (
                        <div className={cn(
                            "p-8 rounded-2xl border-2 shadow-lg transition-all duration-300 min-h-[200px] flex items-center justify-center backdrop-blur-md",
                            "bg-white/50 dark:bg-black/50 border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
                        )}>
                            <p className="text-lg sm:text-xl text-gray-800 dark:text-gray-200 leading-relaxed max-w-lg mx-auto">{replay}</p>
                        </div>
                    )}
                    {isSubmitting && (
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Processing your request...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
