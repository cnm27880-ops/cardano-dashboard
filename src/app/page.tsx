import EcosystemHealth from "@/components/EcosystemHealth";
import DeveloperActivity from "@/components/DeveloperActivity";
import WhaleAlert from "@/components/WhaleAlert";
import TrendStrategyHub from "@/components/TrendStrategyHub";

export default function Home() {
  // Simulated real-time metrics that would typically come from an API/Context
  const currentTrendData = {
    price: 0.35, // Currently under 0.5 ADA (Stage 1)
    tvlRatio: 0.015, // 1.5%
    githubCommits: 350,
    whaleActivityLevel: "medium" as const,
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
      <TrendStrategyHub data={currentTrendData} />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        
        {/* Card 1: Ecosystem Health */}
        <div className="glass-card p-4 lg:p-6 min-h-[400px] flex flex-col relative overflow-hidden group">
           {/* Cyberpunk accent lines */}
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-blue to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
           <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyber-blue/20 rounded-tr-xl pointer-events-none"></div>
           
           <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
             <span className="w-2 h-2 bg-cyber-blue rounded-sm"></span>
             生態健康度
           </h3>
           <p className="text-xs text-gray-400 font-mono mb-6">總鎖倉量 / 市值佔比</p>
           
           <EcosystemHealth />
        </div>

        {/* Card 2: Developer Activity */}
        <div className="glass-card p-4 lg:p-6 min-h-[400px] flex flex-col relative overflow-hidden group xl:col-span-1 lg:col-span-1">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-purple to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
           <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyber-purple/20 rounded-tr-xl pointer-events-none"></div>
           
           <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
             <span className="w-2 h-2 bg-cyber-purple rounded-sm"></span>
             Github工程活躍板
           </h3>
           <p className="text-xs text-gray-400 font-mono mb-6">GitHub 提交數 (7 天內)</p>
           
           <DeveloperActivity />
        </div>

        {/* Card 3: Whale Awakening Alerts */}
        <div className="glass-card p-4 lg:p-6 min-h-[400px] flex flex-col relative overflow-hidden group xl:col-span-1 lg:col-span-2">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-red to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
           <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyber-red/20 rounded-tr-xl pointer-events-none"></div>
           
           <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
             <span className="w-2 h-2 bg-cyber-red rounded-sm shadow-[0_0_8px_#ff3333]"></span>
             巨鯨出沒警報
           </h3>
           <p className="text-xs text-gray-400 font-mono mb-6">大額交易 (&gt;1,000萬 ADA)</p>
           
           <WhaleAlert />
        </div>

      </div>
    </div>
  );
}
