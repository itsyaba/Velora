'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import ChatInput from '@/components/chat/ChatInput';
import PromptChip from '@/components/chat/PromptChip';
import AuthModal from '@/components/auth/AuthModal';
import { useApp } from '@/context/AppContext';
import { suggestedPrompts } from '@/data/mockData';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isLoggedIn, setIsLoggedIn, pendingMessage, setPendingMessage, createNewChat } = useApp();
  const router = useRouter();

  const handleSendMessage = (message: string) => {
    if (!isLoggedIn) {
      setPendingMessage(message);
      setShowAuthModal(true);
    } else {
      createNewChat(message);
      router.push('/chat');
    }
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="flex relative min-h-screen flex-col">
      {/* Navbar */}
      <header className="relative z-20 border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="font-bold text-xl">AI Concierge</span>
          </div>
          <nav className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <ModeToggle />
              {isLoggedIn ? (
                <Link href="/chat">
                  <Button className="rounded-sm">
                    Go to Chat
                  </Button>
                </Link>
              ) : (
                <Button 
                  className="rounded-sm" 
                  onClick={() => setShowAuthModal(true)}
                >
                  Sign in
                </Button>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Your AI Travel Assistant
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover Ethiopia with personalized recommendations for tours, guides, translators, and more.
            </p>
          </div>

          {/* Chat Input */}
          <div className="w-full max-w-2xl mb-8">
            <ChatInput
              onSend={handleSendMessage}
              placeholder="ምን እርዳታ ይፈልጋሉ? / How can I help you today?"
            />
          </div>

          {/* Suggested Prompts */}
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestedPrompts.map((prompt, index) => (
              <PromptChip
                key={index}
                prompt={prompt}
                onClick={handlePromptClick}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2024 AI Concierge. Your personal travel assistant.
            </div>
            <div className="flex items-center space-x-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
