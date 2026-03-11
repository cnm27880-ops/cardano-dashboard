"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { Activity, Clock, Database, Globe, Layers, Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="zh-TW">
      <head>
        <title>Cardano Whale & Ecosystem Dashboard</title>
        <meta name="description" content="A cyberpunk-themed dashboard for monitoring Cardano ecosystem health, developer activity, and whale alerts." />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ADA_SYS" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col md:flex-row overflow-hidden bg-black text-white`}
      >
        {/* Mobile Topbar */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 glass-panel z-20 shrink-0">
          <h1 className="text-xl font-bold tracking-wider">
            <span className="text-cyber-blue font-mono">ADA</span>_SYS
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-400 hover:text-white transition-colors focus:outline-none"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Sidebar Overlay (Mobile) */}
        {isSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/80 z-20 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed md:relative inset-y-0 left-0 z-30 w-64 glass-panel flex flex-col border-r border-white/10 shrink-0
          transition-transform duration-300 ease-in-out md:translate-x-0 bg-black/95 md:bg-transparent
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="hidden md:block p-6 border-b border-white/10">
            <h1 className="text-xl font-bold tracking-wider text-white">
              <span className="text-cyber-blue font-mono">ADA</span>_SYS
            </h1>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">全域監控</p>
          </div>

          <div className="md:hidden p-6 border-b border-white/10 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold tracking-wider text-white">
                <span className="text-cyber-blue font-mono">ADA</span>_SYS
              </h1>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">全域監控</p>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          <nav className="flex-col flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar flex shrink-0">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg text-cyber-blue border border-cyber-blue/20 transition-all hover:bg-white/10 whitespace-nowrap">
              <Globe size={18} />
              <span className="font-medium text-sm tracking-wide">生態中心</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 transition-all hover:bg-white/5 hover:text-white whitespace-nowrap">
              <Activity size={18} />
              <span className="font-medium text-sm tracking-wide">網路健康狀態</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 transition-all hover:bg-white/5 hover:text-white whitespace-nowrap">
              <Layers size={18} />
              <span className="font-medium text-sm tracking-wide">DApp 指標</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 transition-all hover:bg-white/5 hover:text-white whitespace-nowrap">
              <Shield size={18} />
              <span className="font-medium text-sm tracking-wide">安全協議</span>
            </a>
          </nav>
          
          <div className="p-4 border-t border-white/10">
            <div className="bg-black/40 rounded-lg p-4 flex items-center justify-center gap-2 border border-white/5">
               <Database size={16} className="text-cyber-purple" />
               <span className="text-xs text-gray-400">節點同步率: <span className="text-cyber-green">100%</span></span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col z-0 h-[calc(100vh-65px)] md:h-screen overflow-hidden w-full">
          {/* Top Status Bar */}
          <header className="h-12 md:h-16 glass-panel flex items-center justify-between px-4 md:px-8 border-b border-white/10 z-10 shrink-0">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse shadow-[0_0_8px_#00ff66]"></div>
              <span className="text-xs md:text-sm font-mono tracking-wider text-gray-300 uppercase">系統狀態: 運作中</span>
            </div>
            
            <div className="flex items-center gap-4 text-xs md:text-sm text-gray-400">
               <div className="flex items-center gap-2">
                 <Clock size={12} className="text-cyber-blue md:w-[14px] md:h-[14px]" />
                 <span className="font-mono text-xs">最後更新: <span className="text-white">剛剛</span></span>
               </div>
            </div>
          </header>
          
          {/* Scrollable Main Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar w-full">
             {children}
          </main>
        </div>
      </body>
    </html>
  );
}
