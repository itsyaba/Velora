'use client';

import { motion } from 'framer-motion';

interface PromptChipProps {
  prompt: string;
  onClick: (prompt: string) => void;
}

export default function PromptChip({ prompt, onClick }: PromptChipProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(prompt)}
      className="px-4 py-2 rounded-full border border-border bg-background hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
    >
      {prompt}
    </motion.button>
  );
}
