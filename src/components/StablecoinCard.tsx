"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface StablecoinCardProps {
  momentum: number; // Percentage change (positive or negative)
}

export default function StablecoinCard({ momentum }: StablecoinCardProps) {
  const isPositive = momentum >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-3 sm:p-4 min-h-[120px] flex flex-col justify-between relative overflow-hidden group w-full h-full border-white/5 hover:border-cyber-blue/30 transition-colors"
    >
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyber-blue to-transparent opacity-30 group-hover:opacity-100 transition-opacity"></div>

      <h3 className="text-xs sm:text-sm font-semibold text-gray-400 flex items-center gap-1.5 font-mono tracking-widest uppercase mb-2">
        <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full"></span>
        穩定幣動能 (USDCx)
      </h3>

      <div className="flex flex-col gap-1 mt-auto">
        <div className="flex items-end gap-2">
          <DollarSign className="text-cyber-blue mb-1" size={20} />
          <span className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
            {Math.abs(momentum).toFixed(1)}%
          </span>
        </div>

        <div className={`flex items-center gap-1 text-[10px] sm:text-xs font-mono mt-1 ${isPositive ? 'text-cyber-green' : 'text-cyber-red'}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>24H {isPositive ? '流入增長' : '流出衰退'}</span>
        </div>
      </div>
    </motion.div>
  );
}
