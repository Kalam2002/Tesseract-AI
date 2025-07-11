'use client';

import './globals.css';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link'
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}>
        <SidebarProvider>
          {/* 🌌 Animated Background Layer */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-purple-700 blur-3xl opacity-30 animate-pulse rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500 blur-3xl opacity-30 animate-ping rounded-full" />
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-pink-600 blur-2xl opacity-20 animate-spin rounded-full" />
          </div>
           {/* 🔐 Login Button */}
          <Link
            href="/login"
            className="fixed top-4 right-4 z-50 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow hover:scale-105 transition-transform"
          >
            Login
          </Link>
          {/* 🧠 Sidebar & Main Content */}
          <AppSidebar />
          <SidebarTrigger />
          <main className="flex-1 bg-transparent relative z-10">
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
