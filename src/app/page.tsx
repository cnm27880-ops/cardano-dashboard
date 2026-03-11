import EcosystemHealth from "@/components/EcosystemHealth";
import DeveloperActivity from "@/components/DeveloperActivity";
import WhaleAlert from "@/components/WhaleAlert";

export default function Home() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      
      {/* Dashboard Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-white tracking-wide flex items-center gap-3">
          <span className="text-cyber-blue opacity-50 text-4xl">/</span>
          Dashboard Overview
        </h2>
        <p className="text-gray-400 max-w-2xl font-mono text-sm">
          Monitoring critical network infrastructure, on-chain liquidity, developer activity, and large-scale entity movements within the Cardano ecosystem.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Card 1: Ecosystem Health */}
        <div className="glass-card p-6 min-h-[400px] flex flex-col relative overflow-hidden group">
           {/* Cyberpunk accent lines */}
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-blue to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
           <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyber-blue/20 rounded-tr-xl pointer-events-none"></div>
           
           <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
             <span className="w-2 h-2 bg-cyber-blue rounded-sm"></span>
             Ecosystem Health
           </h3>
           <p className="text-xs text-gray-400 font-mono mb-6">TVL / Market Cap Ratio</p>
           
           <EcosystemHealth />
        </div>

        {/* Card 2: Developer Activity */}
        <div className="glass-card p-6 min-h-[400px] flex flex-col relative overflow-hidden group xl:col-span-1 lg:col-span-1">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-purple to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
           <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyber-purple/20 rounded-tr-xl pointer-events-none"></div>
           
           <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
             <span className="w-2 h-2 bg-cyber-purple rounded-sm"></span>
             Developer Activity
           </h3>
           <p className="text-xs text-gray-400 font-mono mb-6">GitHub Commits (7 Days)</p>
           
           <DeveloperActivity />
        </div>

        {/* Card 3: Whale Awakening Alerts */}
        <div className="glass-card p-6 min-h-[400px] flex flex-col relative overflow-hidden group xl:col-span-1 lg:col-span-2">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-red to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
           <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyber-red/20 rounded-tr-xl pointer-events-none"></div>
           
           <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
             <span className="w-2 h-2 bg-cyber-red rounded-sm shadow-[0_0_8px_#ff3333]"></span>
             Whale Alerts
           </h3>
           <p className="text-xs text-gray-400 font-mono mb-6">Large Transactions (&gt;10M ADA)</p>
           
           <WhaleAlert />
        </div>

      </div>
    </div>
  );
}
