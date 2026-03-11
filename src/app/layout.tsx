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

export const metadata: Metadata = {
  title: "Cardano Whale & Ecosystem Dashboard",
  description: "A cyberpunk-themed dashboard for monitoring Cardano ecosystem health, developer activity, and whale alerts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex overflow-hidden`}
      >
        {/* Sidebar */}
        <aside className="w-64 glass-panel flex flex-col z-10 border-r border-white/10">
          <div className="p-6 border-b border-white/10">
            <h1 className="text-xl font-bold tracking-wider text-white">
              <span className="text-cyber-blue font-mono">ADA</span>_SYS
            </h1>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Global Monitor</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg text-cyber-blue border border-cyber-blue/20 transition-all hover:bg-white/10">
              <Globe size={18} />
              <span className="font-medium text-sm tracking-wide">Ecosystem Hub</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 transition-all hover:bg-white/5 hover:text-white">
              <Activity size={18} />
              <span className="font-medium text-sm tracking-wide">Network Health</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 transition-all hover:bg-white/5 hover:text-white">
              <Layers size={18} />
              <span className="font-medium text-sm tracking-wide">DApp Metrics</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 transition-all hover:bg-white/5 hover:text-white">
              <Shield size={18} />
              <span className="font-medium text-sm tracking-wide">Security Protocols</span>
            </a>
          </nav>
          
          <div className="p-4 border-t border-white/10">
            <div className="bg-black/40 rounded-lg p-4 flex items-center justify-center gap-2 border border-white/5">
               <Database size={16} className="text-cyber-purple" />
               <span className="text-xs text-gray-400">Node Sync: <span className="text-cyber-green">100%</span></span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col z-0 h-screen overflow-hidden">
          {/* Top Status Bar */}
          <header className="h-16 glass-panel flex items-center justify-between px-8 border-b border-white/10 z-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse shadow-[0_0_8px_#00ff66]"></div>
              <span className="text-sm font-mono tracking-wider text-gray-300 uppercase">System Status: Online</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
               <div className="flex items-center gap-2">
                 <Clock size={14} className="text-cyber-blue" />
                 <span className="font-mono text-xs">Last Updated: <span className="text-white">Just now</span></span>
               </div>
            </div>
          </header>
          
          {/* Scrollable Main Content */}
          <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
             {children}
          </main>
        </div>
      </body>
    </html>
  );
}
