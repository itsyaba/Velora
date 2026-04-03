'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { toast } from 'sonner';

interface Provider {
  id: number;
  name: string;
  category: string;
  languages: string[];
  price: number;
  available: boolean;
  photo: string;
  description?: string;
}

interface ProviderCardProps {
  provider: Provider;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  const handleBook = () => {
    toast.success('Request sent successfully');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-4 p-4 border rounded-lg bg-card"
    >
      <div className="relative">
        <Image
          src={provider.photo}
          alt={provider.name}
          width={60}
          height={60}
          className="rounded-full object-cover"
        />
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
          provider.available ? 'bg-green-500' : 'bg-red-500'
        }`} />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium">{provider.name}</h4>
          <Badge variant="secondary" className="text-xs">
            {provider.category}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
          <span>{provider.languages.join(', ')}</span>
          <span>${provider.price}/hr</span>
        </div>
        
        {provider.description && (
          <p className="text-sm text-muted-foreground line-clamp-1">
            {provider.description}
          </p>
        )}
      </div>
      
      <Button 
        onClick={handleBook}
        disabled={!provider.available}
        size="sm"
      >
        {provider.available ? 'Book' : 'Unavailable'}
      </Button>
    </motion.div>
  );
}
