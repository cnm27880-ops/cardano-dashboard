import EcosystemHealth from "@/components/EcosystemHealth";
import DeveloperActivity from "@/components/DeveloperActivity";
import WhaleAlert from "@/components/WhaleAlert";
import TrendStrategyHub from "@/components/TrendStrategyHub";
import StablecoinCard from "@/components/StablecoinCard";
import AdaBtcCard from "@/components/AdaBtcCard";
import BtcDominanceCard from "@/components/BtcDominanceCard";

export default function Home() {
  // Simulated real-time metrics that would typically come from an API/Context
  const currentTrendData = {
    price: 0.35, // Currently under 0.5 ADA (Stage 1)
    tvlRatio: 0.015, // 1.5%
    githubCommits: 350,
    whaleActivityLevel: "medium" as const,
    stablecoinMomentum: 2.4, // USDCx increased by 2.4%
    adaBtcRatio: 0.0000085,
    btcDominance: 53.2,
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 lg:space-y-8">
      
      {/* Dashboard Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-wide flex items-center gap-2 lg:gap-3">
          <span className="text-cyber-blue opacity-50 text-3xl lg:text-4xl">/</span>
          Cardano 觀測站
        </h2>
        <p className="text-gray-400 max-w-2xl font-mono text-xs lg:text-sm">
          監測 Cardano 生態系統中的關鍵網路基礎設施、鏈上流動性、開發者活躍度以及大規模實體資金動向。
        </p>
      </div>

      {/* Hero Section: Trend & Strategy Hub */}
      <div id="ecosystem-center">
        <TrendStrategyHub data={currentTrendData} />
      </div>

      {/* Compact Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
        
        {/* Card: Ecosystem Health */}
        <div id="network-health" className="glass-card p-3 sm:p-4 min-h-[200px] flex flex-col relative overflow-hidden group w-full col-span-1">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-blue to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
           
           <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-1.5">
             <span className="w-1.5 h-1.5 bg-cyber-blue rounded-sm"></span>
             生態健康度
           </h3>
           <p className="text-[10px] text-gray-400 font-mono mb-3">TVL / 市值佔比</p>
           
           <EcosystemHealth />
        </div>

        {/* Card: Developer Activity */}
        <div id="dapp-metrics" className="glass-card p-3 sm:p-4 min-h-[200px] flex flex-col relative overflow-hidden group w-full col-span-1">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-purple to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
           
           <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-1.5">
             <span className="w-1.5 h-1.5 bg-cyber-purple rounded-sm"></span>
             GitHub 活躍度
           </h3>
           <p className="text-[10px] text-gray-400 font-mono mb-3">提交數 (7天)</p>
           
           <DeveloperActivity />
        </div>

        {/* Small Indicator Cards stacked or spread */}
        <div className="col-span-1 h-full">
          <StablecoinCard momentum={currentTrendData.stablecoinMomentum} />
        </div>

        <div className="col-span-1 h-full">
          <AdaBtcCard ratio={currentTrendData.adaBtcRatio} trend="down" />
        </div>

        <div className="col-span-1 h-full">
          <BtcDominanceCard percentage={currentTrendData.btcDominance} />
        </div>

        {/* Card: Whale Awakening Alerts (Spans 2 columns) */}
        <div id="security-protocol" className="glass-card p-3 sm:p-4 min-h-[200px] flex flex-col relative overflow-hidden group w-full col-span-2 md:col-span-3">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-red to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
           
           <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-1.5">
             <span className="w-1.5 h-1.5 bg-cyber-red rounded-sm shadow-[0_0_8px_#ff3333]"></span>
             巨鯨出沒警報
           </h3>
           <p className="text-[10px] text-gray-400 font-mono mb-3">大額交易 (&gt;1,000萬 ADA)</p>
           
           <WhaleAlert />
        </div>

      </div>
    </div>
  );
}
