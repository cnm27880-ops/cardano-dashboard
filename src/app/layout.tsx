import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Activity, Clock, Database, Globe, Layers, Shield } from "lucide-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import type { Viewport } from "next";

export const metadata: Metadata = {
  title: "Cardano Whale & Ecosystem Dashboard",
  description: "A cyberpunk-themed dashboard for monitoring Cardano ecosystem health, developer activity, and whale alerts.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ADA_SYS",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col lg:flex-row overflow-hidden`}
      >
        {/* Sidebar */}
        <aside className="w-full lg:w-64 glass-panel flex flex-col z-10 border-b lg:border-b-0 lg:border-r border-white/10 shrink-0">
          <div className="p-6 border-b border-white/10">
            <h1 className="text-xl font-bold tracking-wider text-white">
              <span className="text-cyber-blue font-mono">ADA</span>_SYS
            </h1>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">全域監控</p>
          </div>
          
          <nav className="flex-row lg:flex-col lg:flex-1 p-4 gap-2 lg:space-y-2 overflow-x-auto custom-scrollbar flex shrink-0">
            <a href="#" className="flex items-center gap-2 lg:gap-3 px-4 py-2 lg:py-3 bg-white/5 rounded-lg text-cyber-blue border border-cyber-blue/20 transition-all hover:bg-white/10 whitespace-nowrap">
              <Globe size={18} />
              <span className="font-medium text-sm tracking-wide">生態中心</span>
            </a>
            <a href="#" className="flex items-center gap-2 lg:gap-3 px-4 py-2 lg:py-3 rounded-lg text-gray-400 transition-all hover:bg-white/5 hover:text-white whitespace-nowrap">
              <Activity size={18} />
              <span className="font-medium text-sm tracking-wide">網路健康狀態</span>
            </a>
            <a href="#" className="flex items-center gap-2 lg:gap-3 px-4 py-2 lg:py-3 rounded-lg text-gray-400 transition-all hover:bg-white/5 hover:text-white whitespace-nowrap">
              <Layers size={18} />
              <span className="font-medium text-sm tracking-wide">DApp 指標</span>
            </a>
            <a href="#" className="flex items-center gap-2 lg:gap-3 px-4 py-2 lg:py-3 rounded-lg text-gray-400 transition-all hover:bg-white/5 hover:text-white whitespace-nowrap">
              <Shield size={18} />
              <span className="font-medium text-sm tracking-wide">安全協議</span>
            </a>
          </nav>
          
          <div className="hidden lg:block p-4 border-t border-white/10">
            <div className="bg-black/40 rounded-lg p-4 flex items-center justify-center gap-2 border border-white/5">
               <Database size={16} className="text-cyber-purple" />
               <span className="text-xs text-gray-400">節點同步率: <span className="text-cyber-green">100%</span></span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col z-0 h-[calc(100vh-140px)] lg:h-screen overflow-hidden">
          {/* Top Status Bar */}
          <header className="h-12 lg:h-16 glass-panel flex items-center justify-between px-4 lg:px-8 border-b border-white/10 z-10 shrink-0">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse shadow-[0_0_8px_#00ff66]"></div>
              <span className="text-sm font-mono tracking-wider text-gray-300 uppercase">系統狀態: 運作中</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
               <div className="flex items-center gap-2">
                 <Clock size={14} className="text-cyber-blue" />
                 <span className="font-mono text-xs">最後更新: <span className="text-white">剛剛</span></span>
               </div>
            </div>
          </header>
          
          {/* Scrollable Main Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
             {children}
          </main>
        </div>
      </body>
    </html>
  );
}
