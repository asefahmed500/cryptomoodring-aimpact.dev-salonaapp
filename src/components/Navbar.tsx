import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-purple-400">
          CryptoMoodRing
        </Link>
        
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-gray-300">{session?.user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              href="/auth/signin"
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;