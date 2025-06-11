import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Home, 
  Brain, 
  TrendingUp, 
  Users, 
  Trophy, 
  Settings,
  BarChart3
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const router = useRouter();

  const menuItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/mood', icon: Brain, label: 'Mood Tracker' },
    { href: '/predictions', icon: TrendingUp, label: 'Predictions' },
    { href: '/community', icon: Users, label: 'Community' },
    { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { href: '/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <aside className="fixed left-0 top-16 h-full w-64 bg-gray-900 border-r border-gray-800 p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = router.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
