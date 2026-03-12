"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, ShieldCheck, Zap } from "lucide-react";

interface TrendData {
  price: number;
  tvlRatio: number; // e.g., 0.015 for 1.5%
  githubCommits: number;
  whaleActivityLevel: "low" | "medium" | "high" | "extreme";
}

interface MarketStage {
  id: number;
  name: string;
  theme: "blue" | "orange" | "red" | "purple";
  icon: React.ElementType;
  advice: string;
}

// Core Logic: Evaluate Market Stage
function evaluateMarketStage(data: TrendData): MarketStage {
  const { price } = data;

  if (price > 2.5) {
    return {
      id: 4,
      name: "頂峰狂熱期",
      theme: "purple",
      icon: Zap,
      advice: "市場進入超級牛市頂峰。建議執行終極計畫：清空剩餘倉位，準備將資金撤出並轉換為 BTC/ETH 等長線藍籌資產，完成退休資金建構。"
    };
  }

  if (price >= 1.1) {
    return {
      id: 3,
      name: "主升獲利期",
      theme: "red",
      icon: AlertTriangle,
      advice: "警報！已到達第一階段目標價 ($1.3 區間)。建議執行 V1.0 戰術：分批賣出 30%-40% 倉位以回收原始本金，確保投資零風險。"
    };
  }

  if (price >= 0.5) {
    return {
      id: 2,
      name: "初升甦醒期",
      theme: "orange",
      icon: TrendingUp,
      advice: "趨勢已確認反轉向上。請停止加碼，握緊冷錢包中的現貨，切勿在此階段輕易下車被洗出場。"
    };
  }

  return {
    id: 1,
    name: "深蹲蓄力期",
    theme: "blue",
    icon: ShieldCheck,
    advice: "目前為最佳籌碼累積期。建議維持每月 15,000 元的定期定額 (DCA) 紀律，並將購得資產轉入 Tangem 等硬體冷錢包進行原生質押，耐心等待生態發酵。"
  };
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
  }
};

interface TrendStrategyHubProps {
  data: TrendData;
}

export default function TrendStrategyHub({ data }: TrendStrategyHubProps) {
  const stage = useMemo(() => evaluateMarketStage(data), [data]);
  const style = themeStyles[stage.theme];
  const Icon = stage.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`mb-6 rounded-xl border backdrop-blur-md p-5 md:p-8 flex flex-col md:flex-row gap-5 md:gap-10 items-start md:items-center justify-between transition-all duration-500 w-full ${style.border} ${style.bg} ${style.shadow}`}
    >
      {/* Left: Stage Indicator */}
      <div className="flex flex-col items-start space-y-3 min-w-[200px] shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            {stage.theme === 'red' && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${style.pulse}`}></span>}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${stage.theme === 'red' ? 'bg-cyber-red' : style.pulse}`}></span>
          </div>
          <span className="text-gray-400 font-mono text-xs md:text-sm tracking-widest uppercase">市場階段指示</span>
        </div>
        <div className={`flex items-center gap-3 ${style.text}`}>
          <Icon className="w-8 h-8 md:w-10 md:h-10 shrink-0" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-wider">{stage.name}</h2>
        </div>
        <div className="flex flex-row items-center gap-3 md:gap-4 text-xs font-mono text-gray-500 mt-2">
          <span>價格: ${data.price.toFixed(3)}</span>
          <span className="inline">|</span>
          <span>TVL佔比: {(data.tvlRatio * 100).toFixed(1)}%</span>
        </div>
      </div>

      {/* Right: Action Advice */}
      <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
        <h3 className="text-gray-400 font-mono text-xs md:text-sm tracking-widest uppercase mb-2 md:mb-3">本週戰術建議</h3>
        <p className={`text-sm md:text-base leading-relaxed tracking-wide ${stage.theme === 'red' ? 'text-white' : 'text-gray-300'}`}>
          {stage.advice}
        </p>
      </div>
    </motion.div>
  );
}
