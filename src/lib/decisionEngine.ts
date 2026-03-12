export interface MarketData {
  stablecoinGrowth: number; // 7-day percentage
  whaleAction: "exchange_in_large" | "exchange_in" | "neutral" | "wallet_out" | "staking_spike";
  btcDominance: number; // percentage
  adaBtcRatio: number; // in sats (1 sat = 0.00000001 BTC)
  adaBtcTrend: "down" | "flat" | "up" | "spike";
  tvlRatio: number; // percentage
  githubCommits: number; // 7-day count
}

export interface InsightLevel {
  level: number;
  color: "red" | "orange" | "gray" | "blue" | "green";
  title: string;
  description: string;
}

export interface DashboardInsights {
  liquidity: InsightLevel;
  strength: InsightLevel;
  fundamentals: InsightLevel;
  overall: InsightLevel;
}

export function generateMarketInsights(data: MarketData): DashboardInsights {
  const insights: DashboardInsights = {
    liquidity: getLiquidityInsight(data.stablecoinGrowth, data.whaleAction),
    strength: getStrengthInsight(data.btcDominance, data.adaBtcRatio, data.adaBtcTrend),
    fundamentals: getFundamentalsInsight(data.tvlRatio, data.githubCommits),
    overall: { level: 3, color: "gray", title: "", description: "" } // Placeholder, calculated later
  };

  insights.overall = getOverallInsight(insights);
  return insights;
}

function getLiquidityInsight(growth: number, whale: MarketData["whaleAction"]): InsightLevel {
  if (growth < -5 && whale === "exchange_in_large") {
    return { level: 1, color: "red", title: "流動性枯竭", description: "大資金撤出，強烈建議暫停買入。" };
  }
  if (growth < 0 && whale === "exchange_in") {
    return { level: 2, color: "orange", title: "短期拋壓加劇", description: "穩定幣停止流入，市場承壓。" };
  }
  if (growth > 5 && whale === "staking_spike") {
    return { level: 5, color: "green", title: "大水漫灌", description: "大戶極致惜售，即將迎來主升浪！" };
  }
  if (growth > 2 && whale === "wallet_out") {
    return { level: 4, color: "blue", title: "暗流湧動", description: "蓄水池持續注水，大戶提幣囤積，底部強支撐。" };
  }
  return { level: 3, color: "gray", title: "籌碼重新分配", description: "多空交戰，建議觀望。" };
}

function getStrengthInsight(btcD: number, adaBtc: number, trend: MarketData["adaBtcTrend"]): InsightLevel {
  if (btcD > 58 && adaBtc < 0.00000300) {
    return { level: 1, color: "red", title: "比特幣極度吸血期", description: "公鏈失血，切勿重倉抄底。" };
  }
  if (btcD > 54 && trend === "down") {
    return { level: 2, color: "orange", title: "大盤壓制", description: "資金未溢出，山寨幣持續弱勢。" };
  }
  if (btcD < 48 && trend === "spike") {
    return { level: 5, color: "green", title: "山寨季狂歡", description: "進入完全獨立的暴漲行情！" };
  }
  if (btcD < 52 && trend === "up") {
    return { level: 4, color: "blue", title: "資金初步外溢", description: "比特幣漲勢暫歇，匯率轉強。" };
  }
  return { level: 3, color: "gray", title: "隨波逐流", description: "缺乏獨立上漲動能。" };
}

function getFundamentalsInsight(tvl: number, commits: number): InsightLevel {
  // Assuming tvlRatio is passed as a raw percentage here e.g. 0.4 for 0.4%
  if (tvl < 0.5 && commits < 50) {
    return { level: 1, color: "red", title: "生態停滯警報", description: "基本面存在重大隱患。" };
  }
  if (tvl < 1.0 && commits < 100) {
    return { level: 2, color: "orange", title: "熱度減退", description: "技術更新放緩，幣價可能高估。" };
  }
  if (tvl > 3.0 && commits > 300) {
    return { level: 5, color: "green", title: "生態大爆發", description: "技術紅利徹底兌現，基本面無懈可擊！" };
  }
  if (tvl >= 1.5 && tvl <= 3.0 && commits > 250) {
    return { level: 4, color: "blue", title: "價值嚴重低估", description: "開發動能極強，為最佳 DCA 買點。" };
  }
  return { level: 3, color: "gray", title: "平穩建設期", description: "符合常規發展，無崩盤風險。" };
}

function getOverallInsight(insights: DashboardInsights): InsightLevel {
  const levels = [insights.liquidity.level, insights.strength.level, insights.fundamentals.level];
  const minLevel = Math.min(...levels);
  const maxLevel = Math.max(...levels);
  const avgLevel = levels.reduce((a, b) => a + b, 0) / levels.length;

  if (minLevel <= 2 && avgLevel < 3) {
     return {
       level: Math.floor(avgLevel),
       color: minLevel === 1 ? "red" : "orange",
       title: "短期風險警報",
       description: "警報！系統偵測到短期風險，請暫停加碼，保護既有籌碼。"
     };
  }

  if (maxLevel >= 4 && avgLevel > 3) {
      return {
        level: Math.ceil(avgLevel),
        color: maxLevel === 5 ? "green" : "blue",
        title: "絕佳籌碼累積期",
        description: "目前為絕佳籌碼累積期。請維持每月 15,000 元定期定額紀律，並將資產轉入 Tangem 原生質押。"
      };
  }

  return { level: 3, color: "gray", title: "市場震盪期", description: "多空交戰，建議保持觀望，耐心等待明確信號。" };
}
