"use client";

import { useState, useEffect } from "react";
import { generateMarketInsights, DashboardInsights, MarketData } from "@/lib/decisionEngine";

export interface DashboardData {
  price: number;
  tvlRatio: number;
  githubCommits: number;
  whaleActivityLevel: "low" | "medium" | "high" | "extreme";
  stablecoinMomentum: number;
  adaBtcRatio: number;
  btcDominance: number;
  insights: DashboardInsights;
  loading: boolean;
  lastUpdated: Date;
}

const POLL_INTERVAL = 600000; // 10 minutes

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<Omit<DashboardData, 'loading' | 'lastUpdated'>>({
    price: 0.35,
    tvlRatio: 1.5,
    githubCommits: 350,
    whaleActivityLevel: "medium",
    stablecoinMomentum: 2.4,
    adaBtcRatio: 0.0000085,
    btcDominance: 53.2,
    insights: generateMarketInsights({
      stablecoinGrowth: 2.4,
      whaleAction: "neutral",
      btcDominance: 53.2,
      adaBtcRatio: 0.0000085,
      adaBtcTrend: "flat",
      tvlRatio: 1.5,
      githubCommits: 350,
    }),
  });

  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    let isMounted = true;

    async function fetchAllData() {
      if (isMounted) setLoading(true);

      const marketData: MarketData = {
         stablecoinGrowth: 2.4,
         whaleAction: "neutral",
         btcDominance: 53.2,
         adaBtcRatio: 0.0000085,
         adaBtcTrend: "flat",
         tvlRatio: 1.5,
         githubCommits: 350,
      };

      let newPrice = 0.35;

      try {
        // Fetch CoinGecko (ADA Price, BTC.D)
        const cgRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=cardano,bitcoin&vs_currencies=usd,btc&include_market_cap=true");
        if (cgRes.ok) {
          const cgJson = await cgRes.json();
          newPrice = cgJson.cardano?.usd || newPrice;
          marketData.adaBtcRatio = cgJson.cardano?.btc || marketData.adaBtcRatio;

          // Rough approximation of BTC.D using global market cap if available, otherwise mock
          // The /global endpoint requires a pro key usually, so we stick to simple price and mock BTC.D
          marketData.btcDominance = 53.2; // Mocking BTC.D for now as standard endpoint doesn't provide it
        }
      } catch (e) {
        console.error("CoinGecko fetch failed, using fallback.", e);
      }

      try {
         // Fetch DefiLlama (TVL)
         const dlRes = await fetch("https://api.llama.fi/charts/Cardano");
         if (dlRes.ok) {
           const dlJson = await dlRes.json();
           const tvl = dlJson[dlJson.length - 1]?.totalLiquidityUSD || 0;
           // If we had real mcap from CG, calculate actual ratio. Mocking ratio derived from TVL here
           marketData.tvlRatio = (tvl / (newPrice * 35000000000)) * 100 || 1.5;
         }
      } catch (e) {
        console.error("DefiLlama fetch failed, using fallback.", e);
      }

      try {
        // Fetch Github Commits
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const ghRes = await fetch(`https://api.github.com/repos/IntersectMBO/cardano-node/commits?since=${sevenDaysAgo.toISOString()}&per_page=100`);
        if (ghRes.ok) {
          const ghJson = await ghRes.json();
          marketData.githubCommits = ghJson.length;
        }
      } catch (e) {
         console.error("GitHub fetch failed, using fallback.", e);
      }

      // We rely on the existing WhaleAlert component's internal hook for real-time whale polling,
      // but we can mock the overall sentiment for the decision engine here.
      marketData.whaleAction = "wallet_out";
      marketData.stablecoinGrowth = 3.5;
      marketData.adaBtcTrend = "up";

      if (isMounted) {
         setData({
            price: newPrice,
            tvlRatio: marketData.tvlRatio,
            githubCommits: marketData.githubCommits,
            whaleActivityLevel: "medium", // Mapping mock
            stablecoinMomentum: marketData.stablecoinGrowth,
            adaBtcRatio: marketData.adaBtcRatio,
            btcDominance: marketData.btcDominance,
            insights: generateMarketInsights(marketData)
         });
         setLastUpdated(new Date());
         setLoading(false);
      }
    }

    // Initial fetch
    fetchAllData();

    // Set up 10-minute polling
    const interval = setInterval(fetchAllData, POLL_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { ...data, loading, lastUpdated };
}
