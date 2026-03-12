"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, AlertTriangle, ShieldCheck, Zap, Droplet, Activity, Cpu } from "lucide-react";

interface TrendData {
  price: number;
  tvlRatio: number; // e.g., 0.015 for 1.5%
  githubCommits: number;
  whaleActivityLevel: "low" | "medium" | "high" | "extreme";
  stablecoinMomentum: number; // percentage change
  adaBtcRatio: number;
  btcDominance: number; // percentage
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
    advice: "目前為最佳籌碼累積期。建議維持每月 15,000 元的定期定額 (DCA) 紀律，並將購得資產轉入硬體冷錢包進行原生質押，耐心等待生態發酵。"
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

type TabType = 'overall' | 'liquidity' | 'strength' | 'fundamentals';

export default function TrendStrategyHub({ data }: TrendStrategyHubProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overall');
  const stage = useMemo(() => evaluateMarketStage(data), [data]);
  const style = themeStyles[stage.theme];
  const Icon = stage.icon;

  const tabs = [
    { id: 'overall', label: '全域總結', icon: ShieldCheck },
    { id: 'liquidity', label: '籌碼與資金', icon: Droplet },
    { id: 'strength', label: '大盤強弱', icon: Activity },
    { id: 'fundamentals', label: '基本面', icon: Cpu },
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overall':
        return (
          <motion.div
            key="overall"
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
              <h3 className="text-gray-400 font-mono text-xs md:text-sm tracking-widest uppercase mb-2 md:mb-3">具體行動建議</h3>
              <p className={`text-sm md:text-base leading-relaxed tracking-wide ${stage.theme === 'red' ? 'text-white' : 'text-gray-300'}`}>
                {stage.advice}
              </p>
            </div>
          </motion.div>
        );

      case 'liquidity': {
        const isWhaleQuiet = data.whaleActivityLevel === 'low' || data.whaleActivityLevel === 'medium';
        const isStablecoinGrowing = data.stablecoinMomentum > 0;
        let liquidityAdvice = "資金流動平穩，目前無顯著異常跡象，建議持續觀察大戶動向。";
        let liquidityTitle = "流動性中性";

        if (isWhaleQuiet && isStablecoinGrowing) {
          liquidityTitle = "底部強支撐";
          liquidityAdvice = "蓄水池注水中，大戶籌碼穩定，底部強支撐。穩定幣的增加暗示潛在的購買力正在累積。";
        } else if (!isWhaleQuiet && !isStablecoinGrowing) {
          liquidityTitle = "流動性抽離風險";
          liquidityAdvice = "巨鯨活動頻繁且穩定幣流出，可能面臨拋售壓力，建議提高警覺。";
        }

        return (
          <motion.div
            key="liquidity"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 w-full flex flex-col md:flex-row gap-5 md:gap-10 items-start md:items-center justify-between"
          >
            <div className="flex flex-col items-start space-y-3 min-w-[200px] shrink-0">
              <span className="text-gray-400 font-mono text-xs md:text-sm tracking-widest uppercase">資金流向判讀</span>
              <div className="flex items-center gap-3 text-cyber-blue">
                <Droplet className="w-8 h-8 md:w-10 md:h-10 shrink-0" />
                <h2 className="text-2xl md:text-3xl font-bold tracking-wider">{liquidityTitle}</h2>
              </div>
            </div>
            <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
              <h3 className="text-gray-400 font-mono text-xs md:text-sm tracking-widest uppercase mb-2 md:mb-3">交叉比對結論</h3>
              <p className="text-sm md:text-base leading-relaxed tracking-wide text-gray-300">
                {liquidityAdvice}
              </p>
            </div>
          </motion.div>
        );
      }

      case 'strength': {
        const isBtcDominanceHigh = data.btcDominance > 50;
        const isAdaBtcFalling = data.adaBtcRatio < 0.00001; // Mock threshold
        let strengthAdvice = "ADA 與大盤走勢連動，尚未出現明顯獨立行情，建議跟隨大盤節奏。";
        let strengthTitle = "走勢連動中";

        if (isBtcDominanceHigh && isAdaBtcFalling) {
          strengthTitle = "比特幣吸血期";
          strengthAdvice = "資金尚未溢出至公鏈，BTC 強勢吸血。此時山寨幣表現疲軟，需耐心等待資金輪動。";
        } else if (!isBtcDominanceHigh && !isAdaBtcFalling) {
          strengthTitle = "山寨季來臨前夕";
          strengthAdvice = "BTC 統治力下降且 ADA 匯率走強，顯示資金正在流向優質公鏈，為主升段前兆。";
        }

        return (
          <motion.div
            key="strength"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 w-full flex flex-col md:flex-row gap-5 md:gap-10 items-start md:items-center justify-between"
          >
             <div className="flex flex-col items-start space-y-3 min-w-[200px] shrink-0">
              <span className="text-gray-400 font-mono text-xs md:text-sm tracking-widest uppercase">匯率與統治力判讀</span>
              <div className="flex items-center gap-3 text-cyber-orange">
                <Activity className="w-8 h-8 md:w-10 md:h-10 shrink-0" />
                <h2 className="text-2xl md:text-3xl font-bold tracking-wider">{strengthTitle}</h2>
              </div>
            </div>
            <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
              <h3 className="text-gray-400 font-mono text-xs md:text-sm tracking-widest uppercase mb-2 md:mb-3">交叉比對結論</h3>
              <p className="text-sm md:text-base leading-relaxed tracking-wide text-gray-300">
                {strengthAdvice}
              </p>
            </div>
          </motion.div>
        );
      }

      case 'fundamentals': {
        const isDevActive = data.githubCommits > 300;
        const isTvlLow = data.tvlRatio < 0.02;
        let fundamentalsAdvice = "生態發展與市值匹配，處於合理估值區間。";
        let fundamentalsTitle = "估值合理";

        if (isDevActive && isTvlLow) {
          fundamentalsTitle = "價值嚴重低估";
          fundamentalsAdvice = "開發動能強勁但 TVL 佔比極低，顯示市場尚未反映其基本面價值，為長線佈局良機。";
        } else if (!isDevActive && !isTvlLow) {
          fundamentalsTitle = "短期估值偏高";
          fundamentalsAdvice = "TVL 佔比高但開發活躍度下降，可能有短期過熱跡象，建議暫停追高。";
        }

        return (
           <motion.div
            key="fundamentals"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 w-full flex flex-col md:flex-row gap-5 md:gap-10 items-start md:items-center justify-between"
          >
             <div className="flex flex-col items-start space-y-3 min-w-[200px] shrink-0">
              <span className="text-gray-400 font-mono text-xs md:text-sm tracking-widest uppercase">開發與鎖倉判讀</span>
              <div className="flex items-center gap-3 text-cyber-purple">
                <Cpu className="w-8 h-8 md:w-10 md:h-10 shrink-0" />
                <h2 className="text-2xl md:text-3xl font-bold tracking-wider">{fundamentalsTitle}</h2>
              </div>
            </div>
            <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
              <h3 className="text-gray-400 font-mono text-xs md:text-sm tracking-widest uppercase mb-2 md:mb-3">交叉比對結論</h3>
              <p className="text-sm md:text-base leading-relaxed tracking-wide text-gray-300">
                {fundamentalsAdvice}
              </p>
            </div>
          </motion.div>
        );
      }
    }
  };

  return (
    <div className={`mb-6 rounded-xl border backdrop-blur-md transition-all duration-500 w-full overflow-hidden ${style.border} ${style.bg} ${style.shadow}`}>
      {/* Tabs Header */}
      <div className="flex flex-nowrap overflow-x-auto custom-scrollbar border-b border-white/10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-mono text-sm tracking-widest whitespace-nowrap transition-colors relative ${
                isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <TabIcon size={16} className={isActive ? style.text : ''} />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${style.pulse}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Area */}
      <div className="p-5 md:p-8 min-h-[200px] flex items-center">
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </div>
    </div>
  );
}
