"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

interface AdaBtcCardProps {
  ratio: number;
  trend: "up" | "down" | "neutral";
}

export default function AdaBtcCard({ ratio, trend }: AdaBtcCardProps) {
  const isUp = trend === "up";
  const isDown = trend === "down";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-3 sm:p-4 min-h-[120px] flex flex-col justify-between relative overflow-hidden group w-full h-full border-white/5 hover:border-cyber-orange/30 transition-colors"
    >
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyber-orange to-transparent opacity-30 group-hover:opacity-100 transition-opacity"></div>

      <h3 className="text-xs sm:text-sm font-semibold text-gray-400 flex items-center gap-1.5 font-mono tracking-widest uppercase mb-2">
        <span className="w-1.5 h-1.5 bg-cyber-orange rounded-full"></span>
        ADA/BTC 匯率
      </h3>

      <div className="flex flex-col gap-1 mt-auto">
        <div className="flex items-end gap-2">
          <Activity className="text-cyber-orange mb-1" size={20} />
          <span className="text-xl sm:text-2xl font-bold text-white tracking-wide font-mono">
            {ratio.toFixed(8)}
          </span>
        </div>

        <div className={`flex items-center gap-1 text-[10px] sm:text-xs font-mono mt-1 ${isUp ? 'text-cyber-green' : isDown ? 'text-cyber-red' : 'text-gray-400'}`}>
          {isUp ? <ArrowUpRight size={12} /> : isDown ? <ArrowDownRight size={12} /> : null}
          <span>{isUp ? '匯率走強' : isDown ? '匯率走弱' : '震盪盤整'}</span>
        </div>
      </div>
    </motion.div>
  );
}
