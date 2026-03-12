"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Clock, ShieldAlert, Navigation } from "lucide-react";

export interface WhaleTransaction {
  id: string;
  txHash: string;
  amount: number;
  timestamp: number;
  fromAddress: string;
  toAddress: string;
}

export function useWhaleAlerts() {
  const [transactions, setTransactions] = useState<WhaleTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const lastBlockHash = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchLatestBlockAndTxs = async () => {
      try {
        const url = new URL("/api/whale-alerts", window.location.origin);
        if (lastBlockHash.current) {
          url.searchParams.set("lastHash", lastBlockHash.current);
        }

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Failed to fetch whale alerts");

        const data = await res.json();

        if (data.latestHash) {
          lastBlockHash.current = data.latestHash;
        }

        const newWhaleTxs: WhaleTransaction[] = data.transactions || [];

        if (newWhaleTxs.length > 0 && mounted) {
           setTransactions((prev) => {
             const combined = [...newWhaleTxs, ...prev];
             // Remove duplicates based on ID and keep top 10
             const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
             return unique.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
           });
        }
      } catch (error) {
        console.error("Error polling whale alerts:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Initial fetch
    fetchLatestBlockAndTxs();

    // Poll every 20 seconds
    const interval = setInterval(fetchLatestBlockAndTxs, 20000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []); // Missing bracket here!

  // Previous mock data code was overriding the real data. Removed for now to use real API.

  return { transactions, loading };
}

// Format the transaction time ago
function timeAgo(timestamp: number) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return `${seconds}秒前`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}分鐘前`;
  const hours = Math.floor(minutes / 60);
  return `${hours}小時前`;
}

// Masking addresses and hashes
function maskString(str: string, startChars: number = 8, endChars: number = 6) {
  if (str.length <= startChars + endChars) return str;
  return `${str.substring(0, startChars)}...${str.substring(str.length - endChars)}`;
}

export default function WhaleAlert() {
  const { transactions, loading } = useWhaleAlerts();

  if (loading && transactions.length === 0) {
      return (
       <div className="flex-1 flex flex-col items-center justify-center border border-white/5 rounded-lg bg-black/20 p-4 min-h-[200px]">
          <Activity className="text-cyber-blue animate-spin mb-3" size={24} />
          <span className="text-cyber-blue font-mono text-sm animate-pulse">連線至主網掃描中...</span>
       </div>
    );
  }

  if (!loading && transactions.length === 0) {
      return (
       <div className="flex-1 flex flex-col items-center justify-center border border-white/5 rounded-lg bg-black/20 p-4 min-h-[200px]">
          <span className="text-gray-500 font-mono text-sm">目前無大額交易 (&gt;1M ADA)</span>
       </div>
    );
  }

  const formatAmount = (val: number) => {
    return `${(val / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden h-full p-0">
       
       {/* List Header */}
       <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-ping"></div>
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">即時動態</span>
          </div>
          <span className="text-[10px] text-gray-500 font-mono tracking-widest">主網連線中</span>
       </div>

       {/* Notification List */}
       <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 max-h-[300px]">
         <AnimatePresence initial={false}>
           {transactions.map((tx) => {
             // Determine severity based on amount
             const isCritical = tx.amount > 10000000; // > 10M ADA is critical

             return (
               <motion.div
                 key={tx.id}
                 initial={{ opacity: 0, y: -20, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                 transition={{ type: "spring", stiffness: 300, damping: 24 }}
                 className={`mb-2 p-3 sm:p-4 rounded-lg border ${
                   isCritical 
                    ? 'bg-cyber-red/10 border-cyber-red/30 shadow-[inset_0_0_15px_rgba(255,51,51,0.1)]' 
                    : 'bg-black/40 border-white/5 hover:border-white/20'
                 } transition-colors`}
               >
                 {/* Top Row: Warning Badge + Amount */}
                 <div className="flex justify-between items-start mb-2 sm:mb-3">
                    <div className="flex items-center gap-2">
                      {isCritical ? (
                         <div className="flex items-center gap-1 sm:gap-1.5 bg-cyber-red/20 border border-cyber-red/50 text-cyber-red px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[10px] font-bold tracking-widest uppercase animate-pulse">
                           <ShieldAlert size={10} className="sm:w-3 sm:h-3" />
                           嚴重警報
                         </div>
                      ) : (
                         <div className="flex items-center gap-1 sm:gap-1.5 bg-cyber-orange/10 border border-cyber-orange/30 text-cyber-orange px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[10px] font-bold tracking-widest uppercase">
                           巨鯨交易
                         </div>
                      )}
                    </div>
                    
                    <div className={`font-mono font-bold text-sm sm:text-lg tracking-wider ${isCritical ? 'neon-text-red' : 'text-white'}`}>
                       {formatAmount(tx.amount)} <span className="text-[10px] sm:text-xs text-gray-500 font-sans tracking-normal">ADA</span>
                    </div>
                 </div>

                 {/* Middle Row: Addresses */}
                 <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono mb-2 sm:mb-3 bg-black/30 p-1.5 sm:p-2 rounded border border-white/5">
                    <div className="flex-1 overflow-hidden min-w-0">
                       <p className="text-[8px] sm:text-[9px] text-gray-600 mb-0.5 uppercase">發送方</p>
                       <p className="text-gray-400 truncate" title={tx.fromAddress}>{maskString(tx.fromAddress, 6, 4)}</p>
                    </div>
                    <div className="flex-shrink-0 text-cyber-blue opacity-50 px-1 sm:px-0">
                       <Navigation size={12} className="rotate-90 sm:w-[14px] sm:h-[14px]" />
                    </div>
                    <div className="flex-1 overflow-hidden min-w-0 text-right">
                       <p className="text-[8px] sm:text-[9px] text-gray-600 mb-0.5 uppercase">接收方</p>
                       <p className="text-gray-400 truncate" title={tx.toAddress}>{maskString(tx.toAddress, 6, 4)}</p>
                    </div>
                 </div>

                 {/* Bottom Row: TxHash and Time */}
                 <div className="flex justify-between items-center text-[8px] sm:text-[10px] font-mono text-gray-500">
                    <div className="flex items-center gap-1 truncate">
                      <span className="text-gray-600 shrink-0">Tx:</span>
                      <a href={`https://cardanoscan.io/transaction/${tx.txHash}`} target="_blank" rel="noopener noreferrer" className="hover:text-cyber-blue transition-colors truncate">
                        {maskString(tx.txHash, 6, 4)}
                      </a>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Clock size={10} />
                      {timeAgo(tx.timestamp)}
                    </div>
                 </div>

               </motion.div>
             );
           })}
         </AnimatePresence>
       </div>

    </div>
  );
}
