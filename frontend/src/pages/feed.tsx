import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

const Feed = () => {
    let currentValue = "";
    
    const placeholders = [
        "What's Blair's favorite macaron flavor?",
        "Who is Gossip Girl?",
        "Where did Serena vanish to?",
        "Define 'Basshole'.",
        "How to dress like an Upper East Sider?",
    ];
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        currentValue = e.target.value;
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/feed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: currentValue,
                    type: 'feed'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit message');
            }

            const data = await response.json();
            console.log('Response:', data);
        } catch (error) {
            console.error('Error submitting message:', error);
        }
    };

    return (
        <div className="h-[40rem] flex flex-col justify-center items-center px-4 text-center">
            <h2 className="mb-10 sm:mb-15 text-xl sm:text-5xl dark:text-white text-black text-center max-w-xl mx-auto">
                Welcome, Upper East Sider
            </h2>
            <h3 className="mb-10 sm:mb-5 text-xl sm:text-2xl dark:text-gray-400 text-black text-center max-w-lg mx-auto">
                You've stumbled upon a world of secrets and scandals. Do you have what it takes to uncover the truth?
            </h3>
            <div className="w-full max-w-xl mx-auto">
                <PlaceholdersAndVanishInput
                    placeholders={placeholders}
                    onChange={handleChange}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    );
};

export default Feed;
