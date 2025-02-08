import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Sparkles, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="flex justify-center mb-8">
          <Bot className="h-24 w-24" />
        </div>
        <h1 className="text-6xl font-bold tracking-tight mb-8">
          The Next Generation AI Assistant
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Experience the power of artificial intelligence with our advanced AI assistant.
          Get instant answers, creative content, and intelligent automation.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="gap-2">
            Get Started <ArrowRight className="h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            Try Demo
          </Button>
        </div>
      </div>

      <div className="w-full bg-muted py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <Zap className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Get instant responses powered by state-of-the-art AI technology.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Sparkles className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Creative Assistant</h3>
              <p className="text-muted-foreground">
                Generate unique content, ideas, and solutions with AI creativity.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Bot className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">
                Always available to help with your questions and tasks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}