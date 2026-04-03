'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState('signin');
  const { setIsLoggedIn, pendingMessage, setPendingMessage } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    setIsLoggedIn(true);
    onClose();
    
    // Auto-send pending message after login
    if (pendingMessage) {
      setTimeout(() => {
        // This will be handled by the parent component
        setPendingMessage('');
      }, 100);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border rounded-lg shadow-lg p-6 w-full max-w-md mx-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Welcome to AI Concierge</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin">Sign in</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Sign in
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Create a password"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Register
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
