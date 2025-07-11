'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar, SidebarContent, SidebarMenuItem } from '@/components/ui/sidebar';
import { LayoutDashboard, MessageSquare, History, Search, Settings, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const menu = [
  { label: 'Home', href: '/', icon: LayoutDashboard },
  { label: 'New Chat', href: '/new-chat', icon: MessageSquare },
  { label: 'History', href: '/history', icon: History },
  { label: 'Search', href: '/search', icon: Search },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'About', href: '/about', icon: Info },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="bg-zinc-900 border-r border-zinc-800 text-white">
      <SidebarContent className="pt-6 space-y-4">
        {/* Glowing Animated Logo */}
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
  className="flex justify-center items-center mb-8"
>
  <div className="relative">
    {/* Glow Effect Behind */}
    <div className="absolute inset-0 rounded-full blur-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-40 animate-pulse" />
    
    {/* Logo Image */}
    <img
      src="/logo.png"
      alt="Tesseract Logo"
      className="relative z-10 h-20 w-20 object-contain"
    />
  </div>
</motion.div>

        {/* Menu Items */}
        <nav className="space-y-2">
          {menu.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={index} href={item.href}>
                <SidebarMenuItem
                  className={clsx(
                    'flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-zinc-800 text-purple-400 border border-purple-600'
                      : 'hover:bg-zinc-800 text-gray-300'
                  )}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </SidebarMenuItem>
              </Link>
            );
          })}
        </nav>
      </SidebarContent>
    </Sidebar>
  );
}
