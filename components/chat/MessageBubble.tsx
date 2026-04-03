'use client';

import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import ProviderCard from './ProviderCard';
import { providers } from '@/data/mockData';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  providers?: number[];
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src="/ai-avatar.png" />
          <AvatarFallback>
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[70%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`rounded-lg px-4 py-2 ${
            isUser
              ? 'bg-primary text-primary-foreground ml-auto'
              : 'bg-muted'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        </div>
        
        {message.providers && message.providers.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.providers.map((providerId) => {
              const provider = providers.find(p => p.id === providerId);
              return provider ? (
                <ProviderCard key={providerId} provider={provider} />
              ) : null;
            })}
          </div>
        )}
      </div>
      
      {isUser && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src="/user-avatar.png" />
          <AvatarFallback>
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}
