import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Target, ShieldAlert, ShieldCheck } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export default function Header({ title }) {
  const { user } = useSelector(state => state.auth);
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    // Health check ping to verify API connectivity
    axios.get(`${API_BASE}/status`)
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, []);

  return (
    <header className="h-20 w-[calc(100%-16rem)] fixed top-0 right-0 px-8 bg-[#0c002c]/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between z-10">
      <div>
        <h2 className="font-display font-bold text-xl text-white">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Connection status indicator */}
        <div className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm
          ${backendOnline 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
          }
        `}>
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${backendOnline ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${backendOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span>{backendOnline ? 'Enterprise Online' : 'Simulation Mode'}</span>
        </div>

        {/* Target role & score details */}
        {user && user.targetRole && (
          <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-xl px-4 py-2">
            <div className="flex items-center gap-2 border-r border-white/10 pr-4">
              <Target className="w-4 h-4 text-cyber-cyan" />
              <div className="text-left">
                <p className="text-[10px] text-slate-400 leading-none">Target Goal</p>
                <p className="text-xs font-semibold text-white mt-0.5">{user.targetRole}</p>
              </div>
            </div>
            <div className="text-left">
              <p className="text-[10px] text-slate-400 leading-none">Bridge Score</p>
              <p className="text-xs font-bold text-cyber-pink mt-0.5">{user.bridgeScore}%</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
