import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { 
  LayoutDashboard, 
  Trophy,
  Award,
  Compass, 
  Map, 
  MessageSquareCode, 
  FileCheck, 
  Layers, 
  Terminal, 
  LogOut, 
  Waypoints,
  Briefcase,
  Newspaper
} from 'lucide-react';

export default function Sidebar({ onToggleLiveNews, isLiveNewsOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'DSA & Coding Hub', path: '/dsa', icon: Trophy },
    { name: 'Leaderboard', path: '/leaderboard', icon: Award },
    { name: 'Industry News', path: '/news', icon: Newspaper },
    { name: 'Skill Analyzer', path: '/analyzer', icon: Compass },
    { name: 'Roadmap Generator', path: '/roadmap', icon: Map },
    { name: 'Non-Tech Hub', path: '/nontech', icon: Briefcase },
    { name: 'Project Workspace', path: '/workspace', icon: Layers },
    { name: 'Mock Interviewer', path: '/interview', icon: MessageSquareCode },
    { name: 'Resume Optimizer', path: '/resume', icon: FileCheck },
    { name: 'AI Sandbox', path: '/ai', icon: Terminal },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-cyber-deep/80 backdrop-blur-xl border-r border-white/5 flex flex-col justify-between p-6 z-20">
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-cyber-purple to-cyber-pink rounded-xl shadow-glow-purple">
            <Waypoints className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-base leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              TechSetu AI
            </h1>
            <span className="text-[10px] text-cyber-cyan uppercase tracking-wider font-semibold">
              Career Bridge
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 overflow-y-auto max-h-[50vh] pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-2 rounded-lg text-xs transition-all duration-200 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-cyber-purple/20 to-cyber-pink/10 border-l-4 border-cyber-purple text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
                  }
                `}
              >
                <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Live News Drawer Toggle */}
        <button
          onClick={onToggleLiveNews}
          className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-[11px] transition-all duration-200 group border-l-4 shrink-0 ${
            isLiveNewsOpen 
              ? 'bg-cyber-purple/20 border-cyber-purple text-white shadow-sm font-semibold' 
              : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-pink opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-pink"></span>
            </span>
            <span>Live Tech Feed</span>
          </div>
          <span className={`text-[8px] uppercase px-1.5 py-0.2 rounded font-extrabold ${
            isLiveNewsOpen ? 'bg-cyber-purple/30 text-cyber-cyan' : 'bg-cyber-pink/20 text-cyber-pink'
          }`}>
            {isLiveNewsOpen ? 'Hide' : 'Live'}
          </span>
        </button>
      </div>

      {/* User Footer block */}
      <div className="flex flex-col gap-3 border-t border-white/5 pt-4">

        {user && (
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-blue to-cyber-purple flex items-center justify-center font-bold text-white text-[10px] shadow-md shrink-0">
              {user.username.substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user.username}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-medium transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
