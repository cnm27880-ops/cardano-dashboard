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
    <div className="flex-1 flex flex-col p-0 relative h-full">
       
       {/* Top Stats: Price & TVL */}
       <div className="flex flex-row justify-between items-start mb-3 border-b border-white/10 pb-2 gap-2">
          <div>
            <p className="text-[10px] text-gray-500 font-mono mb-0.5 uppercase tracking-wider">ADA 價格</p>
            <div className="text-sm sm:text-lg font-bold text-white tracking-wide">
              $<CountUp end={data.price} decimals={3} duration={2} separator="," />
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 font-mono mb-0.5 uppercase tracking-wider">總鎖倉量</p>
            <div className="text-xs sm:text-sm font-bold text-cyber-blue flex items-center justify-end gap-1">
              <TrendingUp size={12} className="text-cyber-green" />
              {formatCurrency(data.tvl)}
            </div>
          </div>
       </div>

       {/* Circular Progress & Status */}
       <div className="flex-1 flex flex-col items-center justify-center relative min-h-[120px]">
          
          <div className="h-24 w-24 sm:h-28 sm:w-28 relative flex items-center justify-center">
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
               <span className="text-[8px] sm:text-[10px] text-gray-500 font-mono tracking-widest mt-1">佔比</span>
             </div>
          </div>
          
          {/* Status Badge */}
          <div className={`mt-2 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border bg-black/50 ${
             data.ratio > 0.1 ? 'border-cyber-orange/30' : 
             data.ratio < 0.05 ? 'border-cyber-blue/30' : 'border-cyber-green/30'
          }`}>
             <span className={`text-[10px] sm:text-xs font-bold tracking-widest ${statusGlow}`}>
               {statusText}
             </span>
          </div>
       </div>

    </div>
  );
}
