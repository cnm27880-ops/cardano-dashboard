import { Geist, Geist_Mono } from "next/font/google";
import { Clock } from "lucide-react";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import type { Viewport, Metadata } from "next";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col lg:flex-row overflow-hidden bg-black text-white`}
      >
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col z-0 h-[calc(100vh-65px)] lg:h-screen overflow-hidden w-full">
          {/* Top Status Bar */}
          <header className="h-12 lg:h-16 glass-panel flex items-center justify-between px-4 lg:px-8 border-b border-white/10 z-10 shrink-0">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse shadow-[0_0_8px_#00ff66]"></div>
              <span className="text-xs lg:text-sm font-mono tracking-wider text-gray-300 uppercase">系統狀態: 運作中</span>
            </div>
            
            <div className="flex items-center gap-4 text-xs lg:text-sm text-gray-400">
               <div className="flex items-center gap-2">
                 <Clock size={12} className="text-cyber-blue lg:w-[14px] lg:h-[14px]" />
                 <span className="font-mono text-xs">最後更新: <span className="text-white">剛剛</span></span>
               </div>
            </div>
          </header>
          
          {/* Scrollable Main Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar w-full">
             {children}
          </main>
        </div>
      </body>
    </html>
  );
}
