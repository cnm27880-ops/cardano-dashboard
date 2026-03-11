"use client";

import { useState, useEffect } from "react";
import CountUp from "react-countup";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Users, Activity, AlertTriangle } from "lucide-react";

export interface CommitData {
  date: string;
  count: number;
}

export interface DevActivityData {
  commits: CommitData[];
  totalContributors: number;
}

export function useDeveloperActivity() {
  const [data, setData] = useState<DevActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch last 7 days of commits for cardano-node
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const since = sevenDaysAgo.toISOString();

        const response = await fetch(
          `https://api.github.com/repos/IntersectMBO/cardano-node/commits?since=${since}&per_page=100`
        );
        
        if (!response.ok) {
           throw new Error("Failed to fetch GitHub data");
        }
        
        const commits = await response.json();
        
        // Process data
        const uniqueContributors = new Set();
        const commitsByDate: Record<string, number> = {};
        
        // Initialize last 7 days with 0
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            commitsByDate[dateStr] = 0;
        }

        commits.forEach((commit: { author: { login: string }; commit: { author: { name: string; date: string } } }) => {
            // Count contributor
            if (commit.author && commit.author.login) {
                uniqueContributors.add(commit.author.login);
            } else if (commit.commit.author.name) {
                uniqueContributors.add(commit.commit.author.name);
            }
            
            // Count commits per day
            const dateStr = commit.commit.author.date.split('T')[0];
            if (commitsByDate[dateStr] !== undefined) {
                commitsByDate[dateStr]++;
            }
        });

        const chartData = Object.keys(commitsByDate).map(date => ({
            date: date.substring(5), // MM-DD
            count: commitsByDate[date]
        }));

        setData({
            commits: chartData,
            totalContributors: uniqueContributors.size,
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

// Custom Tooltip for the Recharts BarChart
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 border border-cyber-purple/30 p-3 rounded-lg backdrop-blur-md">
        <p className="text-gray-400 text-xs font-mono mb-1">{label}</p>
        <p className="text-cyber-purple font-bold text-lg">
          {payload[0].value} <span className="text-sm font-normal text-gray-300">commits</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function DeveloperActivity() {
  const { data, loading, error } = useDeveloperActivity();

  if (loading) {
    return (
       <div className="flex-1 flex flex-col items-center justify-center border border-white/5 rounded-lg bg-black/20">
          <Activity className="text-cyber-purple animate-spin mb-3" size={24} />
          <span className="text-cyber-purple font-mono text-sm animate-pulse">Syncing Repositories...</span>
       </div>
    );
  }

  if (error || !data) {
     return (
       <div className="flex-1 flex flex-col items-center justify-center border border-cyber-red/30 rounded-lg bg-black/20 p-4 text-center">
          <AlertTriangle className="text-cyber-red mb-2" size={24} />
          <span className="text-cyber-red font-mono text-sm">GitHub API Limit Reached</span>
          <span className="text-gray-500 text-xs mt-1">{error || "No data"}</span>
       </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col border border-white/5 rounded-lg bg-black/20 p-5 relative">
       
       {/* Top Stats: Active Contributors */}
       <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs text-gray-500 font-mono mb-1 uppercase tracking-wider">Active Core Devs</p>
            <div className="text-2xl font-bold text-white tracking-wide flex items-center gap-3">
              <Users size={20} className="text-cyber-purple" />
              <CountUp end={data.totalContributors} duration={2.5} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-600 font-mono mt-1 uppercase tracking-widest">Target Repo</p>
            <p className="text-xs text-cyber-purple font-mono">cardano-node</p>
          </div>
       </div>

       {/* Bar Chart: Commits Over Time */}
       <div className="flex-1 w-full h-full min-h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.commits} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }} 
                dy={10}
              />
              <Tooltip cursor={{ fill: 'rgba(176, 38, 255, 0.1)' }} content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.commits.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.count > 0 ? 'var(--color-cyber-purple)' : 'rgba(255,255,255,0.05)'} 
                    fillOpacity={entry.count > 0 ? 0.8 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
       </div>

    </div>
  );
}
