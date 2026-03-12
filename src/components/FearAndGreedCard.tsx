"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface FngData {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update: string;
}

export default function FearAndGreedCard() {
  const [data, setData] = useState<FngData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://api.alternative.me/fng/");
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            setData(json.data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch F&G data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="glass-card p-3 sm:p-4 min-h-[120px] flex flex-col justify-center items-center w-full h-full border-white/5">
        <Activity className="text-cyber-blue animate-spin mb-2" size={24} />
        <span className="text-cyber-blue font-mono text-xs animate-pulse">載入情緒數據...</span>
      </div>
    );
  }

  // Fallback value if data fails to load
  const value = data ? parseInt(data.value, 10) : 50;

  // Determine color and label based on contrarian investing logic
  let color = "#9ca3af"; // Default gray
  let label = "中立觀望";
  let tailwindColor = "text-gray-400";
  let dotColor = "bg-gray-400";

  if (value >= 0 && value <= 25) {
    color = "#39ff14"; // Fluorescent Green
    label = "極度恐慌 / 絕佳買點";
    tailwindColor = "text-[#39ff14]";
    dotColor = "bg-[#39ff14]";
  } else if (value >= 26 && value <= 45) {
    color = "#84cc16"; // Light Green
    label = "恐慌 / 適合建倉";
    tailwindColor = "text-lime-500";
    dotColor = "bg-lime-500";
  } else if (value >= 46 && value <= 54) {
    color = "#9ca3af"; // Gray
    label = "中立觀望";
    tailwindColor = "text-gray-400";
    dotColor = "bg-gray-400";
  } else if (value >= 55 && value <= 74) {
    color = "#f97316"; // Orange
    label = "貪婪 / 停止加碼";
    tailwindColor = "text-orange-500";
    dotColor = "bg-orange-500";
  } else if (value >= 75 && value <= 100) {
    color = "#ef4444"; // Red
    label = "極度貪婪 / 準備套現";
    tailwindColor = "text-red-500";
    dotColor = "bg-red-500";
  }

  // Calculate gauge parameters
  // Semi-circle gauge (180 degrees)
  const radius = 40;
  const strokeWidth = 8;
  const circumference = radius * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-3 sm:p-4 min-h-[120px] flex flex-col justify-between relative overflow-hidden group w-full h-full border-white/5 hover:border-white/10 transition-colors"
      style={{ borderColor: `color-mix(in srgb, ${color} 30%, transparent)` }}
    >
      <div
        className="absolute top-0 left-0 w-full h-0.5 opacity-30 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }}
      ></div>

      <h3 className="text-xs sm:text-sm font-semibold text-gray-400 flex items-center gap-1.5 font-mono tracking-widest uppercase mb-2">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
        全網市場情緒 (F&G Index)
      </h3>

      <div className="flex flex-col items-center mt-auto w-full relative pt-2">
        {/* Gauge Chart */}
        <div className="relative w-full max-w-[120px] aspect-[2/1] overflow-hidden flex justify-center items-end">
          <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
            {/* Background Arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#1f2937"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Value Arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Value */}
          <div className="absolute bottom-0 flex flex-col items-center justify-end leading-none">
             <span className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
               {value}
             </span>
          </div>
        </div>

        {/* Status Label */}
        <div className={`mt-2 text-[10px] sm:text-xs font-mono font-bold tracking-wider ${tailwindColor}`}>
          {label}
        </div>
      </div>
    </motion.div>
  );
}
