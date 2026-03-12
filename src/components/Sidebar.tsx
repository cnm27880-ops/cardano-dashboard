"use client";

import { Activity, Database, Globe, Layers, Shield, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
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
        fixed lg:relative inset-y-0 left-0 z-30 w-full sm:w-64 lg:w-64 glass-panel flex flex-col border-r border-white/10 shrink-0
        transition-transform duration-300 ease-in-out lg:translate-x-0 bg-black/95 lg:bg-transparent
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="hidden lg:block p-6 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-wider text-white">
            <span className="text-cyber-blue font-mono">ADA</span>_SYS
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">全域監控</p>
        </div>

        <div className="lg:hidden p-6 border-b border-white/10 flex justify-between items-center">
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

        <nav className="flex-col flex-1 p-4 gap-2 lg:space-y-2 overflow-y-auto custom-scrollbar flex shrink-0">
          <a href="#ecosystem-center" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-2 lg:gap-3 px-4 py-2 lg:py-3 bg-white/5 rounded-lg text-cyber-blue border border-cyber-blue/20 transition-all hover:bg-white/10 whitespace-nowrap">
            <Globe size={18} />
            <span className="font-medium text-sm tracking-wide">生態中心</span>
          </a>
          <a href="#network-health" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-2 lg:gap-3 px-4 py-2 lg:py-3 rounded-lg text-gray-400 transition-all hover:bg-white/5 hover:text-white whitespace-nowrap">
            <Activity size={18} />
            <span className="font-medium text-sm tracking-wide">網路健康狀態</span>
          </a>
          <a href="#dapp-metrics" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-2 lg:gap-3 px-4 py-2 lg:py-3 rounded-lg text-gray-400 transition-all hover:bg-white/5 hover:text-white whitespace-nowrap">
            <Layers size={18} />
            <span className="font-medium text-sm tracking-wide">DApp 指標</span>
          </a>
          <a href="#security-protocol" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-2 lg:gap-3 px-4 py-2 lg:py-3 rounded-lg text-gray-400 transition-all hover:bg-white/5 hover:text-white whitespace-nowrap">
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
    </>
  );
}
