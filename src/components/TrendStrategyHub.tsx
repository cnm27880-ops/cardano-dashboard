"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Droplet, Activity, Cpu } from "lucide-react";
import { DashboardInsights, InsightLevel } from "@/lib/decisionEngine";

interface TrendData {
  price: number;
  tvlRatio: number;
  githubCommits: number;
  insights: DashboardInsights;
}

const themeStyles = {
  blue: {
    border: "border-cyber-blue/30",
    bg: "bg-cyber-blue/5",
    text: "text-cyber-blue",
    shadow: "shadow-[0_0_15px_rgba(0,255,255,0.15)]",
    pulse: "bg-cyber-blue",
  },
  orange: {
    border: "border-cyber-orange/30",
    bg: "bg-cyber-orange/5",
    text: "text-cyber-orange",
    shadow: "shadow-[0_0_15px_rgba(255,165,0,0.15)]",
    pulse: "bg-cyber-orange",
  },
  red: {
    border: "border-cyber-red/50",
    bg: "bg-cyber-red/10",
    text: "text-cyber-red",
    shadow: "shadow-[0_0_20px_rgba(255,51,51,0.2)]",
    pulse: "bg-cyber-red animate-ping",
  },
  purple: {
    border: "border-purple-500/50",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    shadow: "shadow-[0_0_25px_rgba(168,85,247,0.3)]",
    pulse: "bg-purple-500",
  },
  green: {
    border: "border-cyber-green/50",
    bg: "bg-cyber-green/10",
    text: "text-cyber-green",
    shadow: "shadow-[0_0_20px_rgba(0,255,102,0.2)]",
    pulse: "bg-cyber-green",
  },
  gray: {
    border: "border-gray-500/30",
    bg: "bg-gray-500/5",
    text: "text-gray-400",
    shadow: "shadow-[0_0_10px_rgba(156,163,175,0.1)]",
    pulse: "bg-gray-500",
  }
};

interface TrendStrategyHubProps {
  data: TrendData;
}

type TabType = 'overall' | 'liquidity' | 'strength' | 'fundamentals';

export default function TrendStrategyHub({ data }: TrendStrategyHubProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overall');

  const tabs = [
    { id: 'overall', label: '全域總結', icon: ShieldCheck, insightKey: 'overall' },
    { id: 'liquidity', label: '籌碼與資金', icon: Droplet, insightKey: 'liquidity' },
    { id: 'strength', label: '大盤強弱', icon: Activity, insightKey: 'strength' },
    { id: 'fundamentals', label: '基本面', icon: Cpu, insightKey: 'fundamentals' },
  ] as const;

  const currentTabInfo = tabs.find(t => t.id === activeTab)!;
  const currentInsight: InsightLevel = data.insights[currentTabInfo.insightKey as keyof DashboardInsights];
  const style = themeStyles[currentInsight.color];

  return (
    <div className={`mb-6 rounded-xl border backdrop-blur-md transition-all duration-500 w-full overflow-hidden ${style.border} ${style.bg} ${style.shadow}`}>
      {/* Tabs Header */}
      <div className="flex flex-nowrap overflow-x-auto custom-scrollbar border-b border-white/10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const TabIcon = tab.icon;
          const tabInsight = data.insights[tab.insightKey as keyof DashboardInsights];
          const tabStyle = themeStyles[tabInsight.color];

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-mono text-sm tracking-widest whitespace-nowrap transition-colors relative ${
                isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <TabIcon size={16} className={isActive ? tabStyle.text : ''} />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${tabStyle.pulse}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Area */}
      <div className="p-5 md:p-8 min-h-[200px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 w-full flex flex-col md:flex-row gap-5 md:gap-10 items-start md:items-center justify-between"
          >
            {/* Left: Stage Indicator */}
            <div className="flex flex-col items-start space-y-3 min-w-[200px] shrink-0">
              <div className="flex items-center gap-2">
                <div className="relative flex h-3 w-3">
                  {currentInsight.color === 'red' && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${style.pulse}`}></span>}
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${currentInsight.color === 'red' ? 'bg-cyber-red' : style.pulse}`}></span>
                </div>
                <span className="text-gray-400 font-mono text-xs md:text-sm tracking-widest uppercase">狀態評級: Level {currentInsight.level}</span>
              </div>
              <div className={`flex items-center gap-3 ${style.text}`}>
                <currentTabInfo.icon className="w-8 h-8 md:w-10 md:h-10 shrink-0" />
                <h2 className="text-2xl md:text-3xl font-bold tracking-wider">{currentInsight.title}</h2>
              </div>
              {activeTab === 'overall' && (
                <div className="flex flex-row items-center gap-3 md:gap-4 text-xs font-mono text-gray-500 mt-2">
                  <span>價格: ${data.price.toFixed(3)}</span>
                  <span className="inline">|</span>
                  <span>TVL佔比: {data.tvlRatio.toFixed(1)}%</span>
                </div>
              )}
            </div>

            {/* Right: Action Advice */}
            <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
              <h3 className="text-gray-400 font-mono text-xs md:text-sm tracking-widest uppercase mb-2 md:mb-3">
                {activeTab === 'overall' ? '具體行動建議' : '交叉比對結論'}
              </h3>
              <p className={`text-sm md:text-base leading-relaxed tracking-wide ${currentInsight.color === 'red' ? 'text-white' : 'text-gray-300'}`}>
                {currentInsight.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
