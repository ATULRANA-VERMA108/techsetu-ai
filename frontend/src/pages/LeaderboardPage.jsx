import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header.jsx';
import { AuthAPI } from '../services/api';
import { 
  Trophy, 
  Flame, 
  Award, 
  Target, 
  Compass, 
  User, 
  Zap,
  Sparkles
} from 'lucide-react';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRankings = async () => {
    try {
      const data = await AuthAPI.getLeaderboard();
      setLeaderboard(data || []);
    } catch (e) {
      console.error("Failed to load leaderboard data: ", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, []);

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="min-h-screen">
      <Header title="Bridgers Leaderboard" />

      {/* Main Container */}
      <div className="mt-4 flex flex-col gap-8">
        
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500 font-medium">
            <span className="animate-pulse">Loading global coder rankings...</span>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-500">
            No rankings found. Be the first to solve a problem!
          </div>
        ) : (
          <>
            {/* Top 3 Podium Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mt-4">
              
              {/* Rank 2 (Silver) */}
              {topThree[1] && (
                <div className="glass-panel p-6 rounded-2xl flex flex-col items-center relative overflow-hidden bg-gradient-to-t from-slate-500/10 via-transparent to-transparent border-t-2 border-slate-400/30 text-center md:order-1 h-[220px] justify-center">
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-slate-500/20 rounded-md text-[9px] font-bold text-slate-300">
                    2nd Rank
                  </div>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center font-bold text-white text-base shadow-lg mb-3 border-2 border-slate-300 relative">
                    <Award className="absolute -top-2 -right-2 w-5 h-5 text-slate-300 drop-shadow-md" />
                    {topThree[1].username.substring(0, 2).toUpperCase()}
                  </div>
                  <h4 className="font-display font-bold text-sm text-white truncate max-w-full">
                    @{topThree[1].username}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate max-w-full mt-0.5">
                    {topThree[1].targetRole || "Bridger"}
                  </p>
                  
                  <div className="flex gap-4 mt-3">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-300">
                      <Trophy className="w-3.5 h-3.5" />
                      {topThree[1].solvedCount} Solved
                    </span>
                    {topThree[1].streak > 0 && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-orange-400">
                        <Flame className="w-3.5 h-3.5" />
                        {topThree[1].streak}d
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Rank 1 (Gold) */}
              {topThree[0] && (
                <div className="glass-panel p-6 rounded-2xl flex flex-col items-center relative overflow-hidden bg-gradient-to-t from-yellow-500/15 via-transparent to-transparent border-t-4 border-yellow-500 text-center md:order-2 h-[260px] justify-center shadow-glow-purple">
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-yellow-500/20 rounded-md text-[9px] font-bold text-yellow-400 flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Champion</span>
                  </div>
                  
                  <div className="w-18 h-18 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center font-black text-white text-lg shadow-xl mb-3 border-2 border-yellow-400 relative">
                    <Trophy className="absolute -top-3 -right-3 w-7 h-7 text-yellow-400 drop-shadow-md animate-bounce" />
                    {topThree[0].username.substring(0, 2).toUpperCase()}
                  </div>
                  <h4 className="font-display font-extrabold text-base text-white truncate max-w-full">
                    @{topThree[0].username}
                  </h4>
                  <p className="text-[10px] text-yellow-200/70 font-semibold truncate max-w-full mt-0.5">
                    {topThree[0].targetRole || "Algorithms Master"}
                  </p>
                  
                  <div className="flex gap-5 mt-4">
                    <span className="flex items-center gap-1.5 text-xs font-black text-yellow-400">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      {topThree[0].solvedCount} Solved
                    </span>
                    {topThree[0].streak > 0 && (
                      <span className="flex items-center gap-1 text-xs font-black text-orange-400">
                        <Flame className="w-4 h-4" />
                        {topThree[0].streak}d
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Rank 3 (Bronze) */}
              {topThree[2] && (
                <div className="glass-panel p-6 rounded-2xl flex flex-col items-center relative overflow-hidden bg-gradient-to-t from-amber-700/10 via-transparent to-transparent border-t-2 border-amber-600/30 text-center md:order-3 h-[200px] justify-center">
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-amber-600/20 rounded-md text-[9px] font-bold text-amber-500">
                    3rd Rank
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center font-bold text-white text-xs shadow-md mb-3 border-2 border-amber-600 relative">
                    <Award className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 text-amber-500 drop-shadow-md" />
                    {topThree[2].username.substring(0, 2).toUpperCase()}
                  </div>
                  <h4 className="font-display font-bold text-sm text-white truncate max-w-full">
                    @{topThree[2].username}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate max-w-full mt-0.5">
                    {topThree[2].targetRole || "Bridger"}
                  </p>
                  
                  <div className="flex gap-4 mt-3">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                      <Trophy className="w-3.5 h-3.5" />
                      {topThree[2].solvedCount} Solved
                    </span>
                    {topThree[2].streak > 0 && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-orange-400">
                        <Flame className="w-3.5 h-3.5" />
                        {topThree[2].streak}d
                      </span>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Standings Table */}
            <div className="glass-panel rounded-2xl overflow-hidden mt-2">
              <div className="p-6 border-b border-white/5 flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyber-cyan" />
                <div>
                  <h3 className="font-display font-bold text-sm text-white">Full Leaderboard Standing</h3>
                  <p className="text-[10px] text-slate-400">Compare algorithmic completions and scoring quotients across developers</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/3 border-b border-white/5 text-slate-400 uppercase tracking-wider text-[9px] font-bold">
                      <th className="p-4 pl-6 text-center">Rank</th>
                      <th className="p-4">User</th>
                      <th className="p-4">Target Role</th>
                      <th className="p-4 text-center">Solved</th>
                      <th className="p-4 text-center">Streak</th>
                      <th className="p-4 text-center">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {leaderboard.map((row, index) => {
                      const rank = index + 1;
                      return (
                        <tr 
                          key={row.username} 
                          className={`hover:bg-white/3 transition-colors ${
                            rank <= 3 ? 'bg-white/1 font-semibold' : ''
                          }`}
                        >
                          <td className="p-4 pl-6 text-center font-bold">
                            {rank === 1 ? (
                              <span className="text-yellow-400 font-extrabold text-sm">🥇</span>
                            ) : rank === 2 ? (
                              <span className="text-slate-300 font-extrabold text-sm">🥈</span>
                            ) : rank === 3 ? (
                              <span className="text-amber-500 font-extrabold text-sm">🥉</span>
                            ) : (
                              rank
                            )}
                          </td>
                          <td className="p-4 flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-[10px]">
                              {row.username.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="text-white">@{row.username}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-[11px] text-slate-400 font-medium">
                              {row.targetRole || "General Coder"}
                            </span>
                          </td>
                          <td className="p-4 text-center font-bold text-cyber-pink">
                            {row.solvedCount}
                          </td>
                          <td className="p-4 text-center font-semibold text-orange-400">
                            {row.streak > 0 ? `${row.streak} days` : '0'}
                          </td>
                          <td className="p-4 text-center font-bold text-cyber-cyan">
                            {row.bridgeScore}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
