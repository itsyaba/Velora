'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import ChatInput from '@/components/chat/ChatInput';
import MessageBubble from '@/components/chat/MessageBubble';
import TypingIndicator from '@/components/chat/TypingIndicator';
import { useApp } from '@/context/AppContext';
import { mockResponses } from '@/data/mockData';
import { ArrowLeft, MessageSquare } from 'lucide-react';

export default function ChatPage() {
  const [isTyping, setIsTyping] = useState(false);
  const { 
    isLoggedIn, 
    currentChat, 
    setCurrentChat, 
    chatHistory, 
    addMessage, 
    pendingMessage,
    setPendingMessage,
    createNewChat 
  } = useApp();

  useEffect(() => {
    // Handle pending message from landing page
    if (pendingMessage && isLoggedIn) {
      handleSendMessage(pendingMessage);
      setPendingMessage('');
    }
  }, [pendingMessage, isLoggedIn]);

  const handleSendMessage = (message: string) => {
    if (!currentChat) {
      createNewChat(message);
    } else {
      addMessage({ sender: 'user', text: message });
    }

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const response = getAIResponse(message);
      setIsTyping(false);
      
      if (!currentChat) {
        // If this was the first message, currentChat should be set by now
        const newChat = chatHistory[0];
        if (newChat) {
          addMessage({ sender: 'ai', text: response.reply, providers: response.providers });
        }
      } else {
        addMessage({ sender: 'ai', text: response.reply, providers: response.providers });
      }
    }, 1500);
  };

  const getAIResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    for (const response of mockResponses) {
      if (response.trigger && lowerMessage.includes(response.trigger)) {
        return response;
      }
    }
    
    // Return the last response (fallback)
    return mockResponses[mockResponses.length - 1];
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Please sign in to access chat</h2>
          <Link href="/">
            <Button>Go to Landing Page</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 border-r bg-muted/30 flex flex-col">
        <div className="p-4 border-b">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="font-semibold mb-4">Past Conversations</h3>
          <div className="space-y-2">
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setCurrentChat(chat)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  currentChat?.id === chat.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-medium truncate">{chat.title}</span>
                </div>
                <p className="text-sm opacity-70 truncate">{chat.lastMessage}</p>
                <p className="text-xs opacity-50 mt-1">{chat.timestamp}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b p-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">AI Concierge</h1>
            {currentChat && (
              <p className="text-sm text-muted-foreground">{currentChat.title}</p>
            )}
          </div>
          <ModeToggle />
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {currentChat ? (
            <div className="space-y-4">
              {currentChat.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <div className="w-4 h-4 bg-muted-foreground rounded-full" />
                  </div>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <TypingIndicator />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose from past conversations or start a new one</p>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        {currentChat && (
          <div className="border-t p-4">
            <ChatInput
              onSend={handleSendMessage}
              disabled={isTyping}
            />
          </div>
        )}
      </div>
    </div>
  );
}
