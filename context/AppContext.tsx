'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { pastConversations, providers as mockProviders } from '@/data/mockData';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  providers?: number[];
}

interface Conversation {
  id: number;
  title: string;
  lastMessage: string;
  timestamp: string;
  messages: Message[];
}

interface AppContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  pendingMessage: string;
  setPendingMessage: (value: string) => void;
  chatHistory: Conversation[];
  currentChat: Conversation | null;
  setCurrentChat: (chat: Conversation | null) => void;
  addMessage: (message: Omit<Message, 'id'>) => void;
  createNewChat: (message: string) => void;
  providers: any[];
  setProviders: (providers: any[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Conversation[]>(pastConversations as Conversation[]);
  const [currentChat, setCurrentChat] = useState<Conversation | null>(null);
  const [providers, setProviders] = useState<any[]>(mockProviders);

  const addMessage = (message: Omit<Message, 'id'>) => {
    if (!currentChat) return;

    const newMessage: Message = {
      ...message,
      id: Date.now()
    };

    setCurrentChat(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...prev.messages, newMessage],
        lastMessage: message.text
      };
    });

    setChatHistory(prev => 
      prev.map(chat => 
        chat.id === currentChat.id 
          ? { ...chat, messages: [...chat.messages, newMessage], lastMessage: message.text }
          : chat
      )
    );
  };

  const createNewChat = (firstMessage: string) => {
    const newChat: Conversation = {
      id: Date.now(),
      title: firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : ''),
      lastMessage: firstMessage,
      timestamp: 'Just now',
      messages: [
        { id: 1, sender: 'user', text: firstMessage }
      ]
    };

    setChatHistory(prev => [newChat, ...prev]);
    setCurrentChat(newChat);
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      setIsLoggedIn,
      pendingMessage,
      setPendingMessage,
      chatHistory,
      currentChat,
      setCurrentChat,
      addMessage,
      createNewChat,
      providers,
      setProviders
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
