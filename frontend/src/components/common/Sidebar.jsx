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

const themes = [
  { name: 'Purple', primary: '#7f00ff', secondary: '#e100ff', glow: 'rgba(127, 0, 255, 0.4)', glowLight: 'rgba(127, 0, 255, 0.15)', bg: 'bg-[#7f00ff]' },
  { name: 'Pink', primary: '#ff007f', secondary: '#7f00ff', glow: 'rgba(255, 0, 127, 0.4)', glowLight: 'rgba(255, 0, 127, 0.15)', bg: 'bg-[#ff007f]' },
  { name: 'Cyan', primary: '#00f2fe', secondary: '#4facfe', glow: 'rgba(0, 242, 254, 0.4)', glowLight: 'rgba(0, 242, 254, 0.15)', bg: 'bg-[#00f2fe]' },
  { name: 'Green', primary: '#10b981', secondary: '#059669', glow: 'rgba(16, 185, 129, 0.4)', glowLight: 'rgba(16, 185, 129, 0.15)', bg: 'bg-[#10b981]' },
  { name: 'Amber', primary: '#f59e0b', secondary: '#d97706', glow: 'rgba(245, 158, 11, 0.4)', glowLight: 'rgba(245, 158, 11, 0.15)', bg: 'bg-[#f59e0b]' },
  { name: 'Red', primary: '#ef4444', secondary: '#be123c', glow: 'rgba(239, 68, 68, 0.4)', glowLight: 'rgba(239, 68, 68, 0.15)', bg: 'bg-[#ef4444]' },
  { name: 'Blue', primary: '#3b82f6', secondary: '#1d4ed8', glow: 'rgba(59, 130, 246, 0.4)', glowLight: 'rgba(59, 130, 246, 0.15)', bg: 'bg-[#3b82f6]' },
];

export const applyTheme = (theme) => {
  document.documentElement.style.setProperty('--cyber-purple', theme.primary);
  document.documentElement.style.setProperty('--cyber-pink', theme.secondary);
  document.documentElement.style.setProperty('--color-glow-purple', theme.glow);
  document.documentElement.style.setProperty('--color-glow-purple-light', theme.glowLight);
  localStorage.setItem('selected-theme', theme.name);
};

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [toastMessage, setToastMessage] = React.useState('');

  React.useEffect(() => {
    const saved = localStorage.getItem('selected-theme');
    if (saved) {
      const match = themes.find(t => t.name === saved);
      if (match) applyTheme(match);
    }
  }, []);

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
      </div>

      {/* User Footer block & Theme swapper */}
      <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
        {/* Toast Alert Inside Sidebar */}
        {toastMessage && (
          <div className="text-[10px] text-center bg-cyber-purple/20 text-white border border-cyber-purple/30 rounded py-1 px-2 animate-pulse">
            {toastMessage}
          </div>
        )}

        {/* Color Theme Selector */}
        <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 flex flex-col gap-1.5">
          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Accent Palette</p>
          <div className="flex items-center gap-1 justify-between">
            {themes.map(t => (
              <button
                key={t.name}
                onClick={() => {
                  applyTheme(t);
                  setToastMessage(`Active theme: ${t.name}`);
                  setTimeout(() => setToastMessage(''), 2000);
                }}
                className={`w-4 h-4 rounded-full ${t.bg} border border-white/10 hover:scale-125 transition-all`}
                title={t.name}
              />
            ))}
          </div>
        </div>

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
