"use client";

import { useState, useEffect } from "react";
import CountUp from "react-countup";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TrendingUp, AlertTriangle, Activity } from "lucide-react";

export interface EcosystemData {
  price: number;
  marketCap: number;
  tvl: number;
  ratio: number;
}

export function useEcosystemHealth() {
  const [data, setData] = useState<EcosystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const cgResponse = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd&include_market_cap=true"
        );
        if (!cgResponse.ok) {
           throw new Error("Failed to fetch CoinGecko data");
        }
        const cgData = await cgResponse.json();
        const price = cgData.cardano.usd;
        const marketCap = cgData.cardano.usd_market_cap;

        const dlResponse = await fetch("https://api.llama.fi/charts/Cardano");
        if (!dlResponse.ok) {
           throw new Error("Failed to fetch DefiLlama data");
        }
        const dlData = await dlResponse.json();
        const latestTVLData = dlData[dlData.length - 1];
        const tvl = latestTVLData.totalLiquidityUSD;

        const ratio = tvl / marketCap;

        setData({
          price,
          marketCap,
          tvl,
          ratio,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}

export default function EcosystemHealth() {
  const { data, loading, error } = useEcosystemHealth();

  if (loading) {
    return (
       <div className="flex-1 flex flex-col items-center justify-center border border-white/5 rounded-lg bg-black/20 p-4">
          <Activity className="text-cyber-blue animate-spin mb-3" size={24} />
          <span className="text-cyber-blue font-mono text-sm animate-pulse">建立連線中...</span>
       </div>
    );
  }

  if (error || !data) {
     return (
       <div className="flex-1 flex flex-col items-center justify-center border border-cyber-red/30 rounded-lg bg-black/20 p-4 text-center">
          <AlertTriangle className="text-cyber-red mb-2" size={24} />
          <span className="text-cyber-red font-mono text-sm">訊號中斷</span>
          <span className="text-gray-500 text-xs mt-1">{error || "無資料"}</span>
       </div>
    );
  }

  // Calculate status
  let statusText = "Stable";
  let statusColor = "var(--color-cyber-blue)";
  let statusGlow = "neon-text-blue";
  
  if (data.ratio < 0.05) {
    statusText = "生態發展中"; // Developing Ecosystem
    statusColor = "var(--color-cyber-blue)";
  } else if (data.ratio > 0.1) {
    statusText = "生態熱度高"; // High Heat Ecosystem
    statusColor = "var(--color-cyber-orange)";
    statusGlow = "neon-text-orange";
  } else {
    statusText = "穩定增長"; // Steady Growth
    statusColor = "var(--color-cyber-green)";
    statusGlow = "text-cyber-green text-shadow-sm";
  }

  // Data for circular progress
  // Recharts Pie uses array of objects
  const percentage = Math.min(data.ratio * 100, 100);
  const chartData = [
    { name: "TVL Ratio", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ];

  const formatCurrency = (val: number) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="flex-1 flex flex-col border border-white/5 rounded-lg bg-black/20 p-5 relative">
       
       {/* Top Stats: Price & TVL */}
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-white/10 pb-4 gap-4 sm:gap-0">
          <div>
            <p className="text-xs text-gray-500 font-mono mb-1 uppercase tracking-wider">ADA 價格</p>
            <div className="text-2xl font-bold text-white tracking-wide">
              $<CountUp end={data.price} decimals={3} duration={2} separator="," />
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-mono mb-1 uppercase tracking-wider">總鎖倉量</p>
            <div className="text-xl font-bold text-cyber-blue flex items-center justify-end gap-2">
              <TrendingUp size={16} className="text-cyber-green" />
              {formatCurrency(data.tvl)}
            </div>
          </div>
       </div>

       {/* Circular Progress & Status */}
       <div className="flex-1 flex flex-col items-center justify-center relative min-h-[220px]">
          
          <div className="h-40 w-40 min-h-[200px] relative flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={75}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell key="cell-0" fill={statusColor} />
                    <Cell key="cell-1" fill="rgba(255,255,255,0.05)" />
                  </Pie>
                </PieChart>
             </ResponsiveContainer>
             
             {/* Center Content */}
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-2xl sm:text-3xl font-bold text-white">
                 {(data.ratio * 100).toFixed(1)}<span className="text-xs sm:text-sm text-gray-400">%</span>
               </span>
               <span className="text-[10px] text-gray-500 font-mono tracking-widest mt-1">佔比</span>
             </div>
          </div>
          
          {/* Status Badge */}
          <div className={`mt-2 sm:mt-4 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border bg-black/50 ${
             data.ratio > 0.1 ? 'border-cyber-orange/30' : 
             data.ratio < 0.05 ? 'border-cyber-blue/30' : 'border-cyber-green/30'
          }`}>
             <span className={`text-xs sm:text-sm font-bold tracking-widest ${statusGlow}`}>
               {statusText}
             </span>
          </div>

          <div className="mt-3 sm:mt-4 w-full flex flex-col sm:flex-row justify-between text-[10px] sm:text-xs font-mono text-gray-500 px-2 sm:px-4 gap-1 sm:gap-0 text-center sm:text-left">
             <span>MCap: {formatCurrency(data.marketCap)}</span>
             <span>TVL: {formatCurrency(data.tvl)}</span>
          </div>
       </div>

    </div>
  );
}
