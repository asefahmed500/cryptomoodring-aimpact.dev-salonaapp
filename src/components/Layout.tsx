'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Brain, Home, Users, LogOut, User , Heart , TrendingUp } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session } = useSession();

   const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Mood Log', href: '/mood', icon: Heart },
    { name: 'Predictions', href: '/predictions', icon: TrendingUp },
    { name: 'Community', href: '/community', icon: Users }
  
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Brain className="text-purple-400" size={32} />
              <span className="text-2xl font-bold">CryptoMoodRing</span>
            </Link>

            <div className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center space-x-4">
              {session && (
                <div className="flex items-center space-x-2 text-gray-300">
                  <User size={20} />
                  <span>{session.user?.username || session.user?.name}</span>
                </div>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
