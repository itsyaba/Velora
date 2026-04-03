'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Shield, Users, Calendar, DollarSign, LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setIsLoggedIn } = useApp();

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/30 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold">Admin Panel</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start">
                <DollarSign className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/providers">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Providers
              </Button>
            </Link>
            <Link href="/admin/bookings">
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Bookings
              </Button>
            </Link>
          </div>
        </nav>
        
        <div className="p-4 border-t space-y-2">
          <Link href="/chat">
            <Button variant="ghost" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Chat Interface
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b p-4 flex items-center justify-between bg-background">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Admin Access</span>
          </div>
          <ModeToggle />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
