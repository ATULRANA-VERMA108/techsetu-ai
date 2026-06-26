import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Settings, 
  Sun, 
  Moon,
  Search,
  Volume2
} from 'lucide-react';

// Common Layout components
import Sidebar from './components/common/Sidebar.jsx';

// Pages loaded lazily for system design performance & free bandwidth conservation
const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const SignupPage = lazy(() => import('./pages/SignupPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const SkillAnalyzerPage = lazy(() => import('./pages/SkillAnalyzerPage.jsx'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage.jsx'));
const MockInterviewPage = lazy(() => import('./pages/MockInterviewPage.jsx'));
const ResumeOptimizerPage = lazy(() => import('./pages/ResumeOptimizerPage.jsx'));
const ProjectHubPage = lazy(() => import('./pages/ProjectHubPage.jsx'));
const AiPlaygroundPage = lazy(() => import('./pages/AiPlaygroundPage.jsx'));
const DsaCodingHubPage = lazy(() => import('./pages/DsaCodingHubPage.jsx'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage.jsx'));
const CodeEditorPage = lazy(() => import('./pages/CodeEditorPage.jsx'));
const NonTechHubPage = lazy(() => import('./pages/NonTechHubPage.jsx'));
const TechNewsPage = lazy(() => import('./pages/TechNewsPage.jsx'));

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector(state => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

const themes = [
  { name: 'Purple', primary: '#7f00ff', secondary: '#e100ff', glow: 'rgba(127, 0, 255, 0.4)', glowLight: 'rgba(127, 0, 255, 0.15)', bg: 'bg-[#7f00ff]' },
  { name: 'Pink', primary: '#ff007f', secondary: '#7f00ff', glow: 'rgba(255, 0, 127, 0.4)', glowLight: 'rgba(255, 0, 127, 0.15)', bg: 'bg-[#ff007f]' },
  { name: 'Cyan', primary: '#00f2fe', secondary: '#4facfe', glow: 'rgba(0, 242, 254, 0.4)', glowLight: 'rgba(0, 242, 254, 0.15)', bg: 'bg-[#00f2fe]' },
  { name: 'Green', primary: '#10b981', secondary: '#059669', glow: 'rgba(16, 185, 129, 0.4)', glowLight: 'rgba(16, 185, 129, 0.15)', bg: 'bg-[#10b981]' },
  { name: 'Amber', primary: '#f59e0b', secondary: '#d97706', glow: 'rgba(245, 158, 11, 0.4)', glowLight: 'rgba(245, 158, 11, 0.15)', bg: 'bg-[#f59e0b]' },
  { name: 'Red', primary: '#ef4444', secondary: '#be123c', glow: 'rgba(239, 68, 68, 0.4)', glowLight: 'rgba(239, 68, 68, 0.15)', bg: 'bg-[#ef4444]' },
  { name: 'Blue', primary: '#3b82f6', secondary: '#1d4ed8', glow: 'rgba(59, 130, 246, 0.4)', glowLight: 'rgba(59, 130, 246, 0.15)', bg: 'bg-[#3b82f6]' },
];

const backgrounds = [
  { 
    name: 'Cosmic Nebula', 
    type: 'dark',
    css: 'radial-gradient(circle at 50% 50%, #0c002c 0%, #03001e 100%)', 
    panelBg: 'rgba(10, 5, 30, 0.55)', 
    text: '#f8fafc', 
    textMuted: '#94a3b8', 
    border: 'rgba(255, 255, 255, 0.06)',
    preview: 'bg-gradient-to-tr from-[#0c002c] to-[#03001e]'
  },
  { 
    name: 'Deep Obsidian', 
    type: 'dark',
    css: '#05020c', 
    panelBg: 'rgba(12, 6, 20, 0.7)', 
    text: '#f8fafc', 
    textMuted: '#94a3b8', 
    border: 'rgba(127, 0, 255, 0.1)',
    preview: 'bg-[#05020c]'
  },
  { 
    name: 'Slate Cyberpunk', 
    type: 'dark',
    css: '#0f172a', 
    panelBg: 'rgba(30, 41, 59, 0.7)', 
    text: '#f8fafc', 
    textMuted: '#94a3b8', 
    border: 'rgba(255, 255, 255, 0.08)',
    preview: 'bg-[#0f172a]'
  },
  { 
    name: 'Emerald Matrix', 
    type: 'dark',
    css: '#022c22', 
    panelBg: 'rgba(6, 78, 59, 0.4)', 
    text: '#f0fdf4', 
    textMuted: '#86efac', 
    border: 'rgba(16, 185, 129, 0.1)',
    preview: 'bg-[#022c22]'
  },
  { 
    name: 'Light Slate', 
    type: 'light',
    css: '#f8fafc', 
    panelBg: 'rgba(255, 255, 255, 0.85)', 
    text: '#0f172a', 
    textMuted: '#475569', 
    border: 'rgba(15, 23, 42, 0.08)',
    preview: 'bg-[#f1f5f9] border border-slate-300'
  },
  { 
    name: 'Pure White', 
    type: 'light',
    css: '#ffffff', 
    panelBg: 'rgba(248, 250, 252, 0.9)', 
    text: '#0f172a', 
    textMuted: '#475569', 
    border: 'rgba(15, 23, 42, 0.1)',
    preview: 'bg-white border border-slate-300'
  }
];

const applyTheme = (theme) => {
  document.documentElement.style.setProperty('--cyber-purple', theme.primary);
  document.documentElement.style.setProperty('--cyber-pink', theme.secondary);
  document.documentElement.style.setProperty('--color-glow-purple', theme.glow);
  document.documentElement.style.setProperty('--color-glow-purple-light', theme.glowLight);
  localStorage.setItem('selected-theme', theme.name);
};

const applyBackground = (bg) => {
  document.documentElement.style.setProperty('--cyber-bg', bg.css);
  document.documentElement.style.setProperty('--cyber-panel-bg', bg.panelBg);
  document.documentElement.style.setProperty('--cyber-text', bg.text);
  document.documentElement.style.setProperty('--cyber-text-muted', bg.textMuted);
  document.documentElement.style.setProperty('--cyber-border', bg.border);
  localStorage.setItem('theme-bg-name', bg.name);
};

const LIVE_FEEDS = [
  { id: 'news-1', tag: 'Google', title: 'Google Launches Gemini 2.5 Ultra: Advanced Multi-Agent Planning & 3M Context', category: 'Company Update' },
  { id: 'news-2', tag: 'Stripe', title: 'Stripe Partners with Google Cloud to Power Next-Gen Billing Orchestration', category: 'Tech Deals' },
  { id: 'news-3', tag: 'Microsoft', title: 'Microsoft Copilot Dev Division Hires Over 500 Engineers for Azure Scaling', category: 'Tech Jobs' },
  { id: 'news-4', tag: 'Netflix', title: 'How Netflix Re-engineered its Video Streaming Pipeline using Rust and WebAssembly', category: 'Technology Stack' },
  { id: 'news-5', tag: 'Meta', title: 'Meta Open-Sources Llama 4.5: PyTorch Native Environments & Self-Debugging Code', category: 'AI Research' },
  { id: 'news-6', tag: 'Medium', title: 'Medium Migrates Core Feed Algorithm to Real-Time Collaborative Filtering', category: 'Article Insight' },
  { id: 'news-7', tag: 'Amazon', title: 'Amazon Web Services Launches Bedrock Agents for Autonomous App Compilation', category: 'Company Update' },
  { id: 'news-8', tag: 'Airbnb', title: 'Airbnb Redesigns Search Backend to Support Real-Time Vector Similarity Search', category: 'Technology Stack' },
  { id: 'news-9', tag: 'Uber', title: 'Uber signs Cloud Migration Contract with Oracle Cloud Infrastructure (OCI)', category: 'Tech Deals' }
];

// Shell wrapper for logged in pages
function AppLayout({ children }) {
  const navigate = useNavigate();
  
  // States
  const [isOpen, setIsOpen] = React.useState(false); // customizer open
  const [isLiveNewsOpen, setIsLiveNewsOpen] = React.useState(false); // live news drawer open
  
  const [newsSearch, setNewsSearch] = React.useState('');
  const [newsFilter, setNewsFilter] = React.useState('All');
  const [selectedBg, setSelectedBg] = React.useState(() => localStorage.getItem('theme-bg-name') || 'Cosmic Nebula');

  // Sync background and accent theme
  React.useEffect(() => {
    const activeBg = backgrounds.find(b => b.name === selectedBg) || backgrounds[0];
    applyBackground(activeBg);
    
    const savedColor = localStorage.getItem('selected-theme');
    if (savedColor) {
      const match = themes.find(t => t.name === savedColor);
      if (match) applyTheme(match);
    }
  }, [selectedBg]);

  const filteredFeeds = LIVE_FEEDS.filter(feed => {
    const matchesSearch = feed.title.toLowerCase().includes(newsSearch.toLowerCase()) || 
                          feed.tag.toLowerCase().includes(newsSearch.toLowerCase());
    const matchesCategory = newsFilter === 'All' || feed.category === newsFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex">
      {/* Sidebar navigation */}
      <Sidebar 
        onToggleLiveNews={() => setIsLiveNewsOpen(!isLiveNewsOpen)} 
        isLiveNewsOpen={isLiveNewsOpen} 
      />
      
      {/* Main content viewport */}
      <main className="flex-1 min-h-screen pl-64 transition-all duration-300 pb-8">
        <div className="pt-20 pb-8 px-8">
          {children}
        </div>
      </main>

      {/* Collapsible Left Live News Drawer (Slides out next to Sidebar at left-64) */}
      <div 
        className="fixed top-0 bottom-0 z-30 w-80 glass-panel border-r border-white/5 shadow-2xl transition-all duration-300 p-5 pt-20 flex flex-col gap-4 overflow-y-auto"
        style={{ left: isLiveNewsOpen ? '256px' : '-320px' }}
      >
        <div className="border-b border-white/5 pb-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-cyber-cyan uppercase tracking-wider">Live Tech Briefings</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-pink opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-pink"></span>
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">Under-60-word scannable alerts & company updates</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            value={newsSearch}
            onChange={(e) => setNewsSearch(e.target.value)}
            placeholder="Search live feeds..." 
            className="w-full text-xs bg-white/5 border border-white/5 rounded-lg py-2 pl-9 pr-3 focus:outline-none focus:border-cyber-purple/50 text-white font-medium"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-1 border-b border-white/5 pb-3">
          {['All', 'Company Update', 'Tech Deals', 'Tech Jobs', 'AI Research'].map(cat => (
            <button
              key={cat}
              onClick={() => setNewsFilter(cat)}
              className={`px-2 py-0.5 rounded text-[8.5px] font-bold transition-all ${
                newsFilter === cat 
                  ? 'bg-cyber-purple/20 text-cyber-cyan border border-cyber-cyan/30' 
                  : 'bg-white/5 text-slate-400 border border-transparent hover:text-white'
              }`}
            >
              {cat.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* News Feed Stream */}
        <div className="flex-1 flex flex-col gap-2.5">
          {filteredFeeds.length === 0 ? (
            <span className="text-[10px] text-slate-500 text-center py-4 font-medium">No matching updates.</span>
          ) : (
            filteredFeeds.map(feed => (
              <div 
                key={feed.id}
                onClick={() => {
                  setIsLiveNewsOpen(false);
                  navigate(`/news?id=${feed.id}`);
                }}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all cursor-pointer flex flex-col gap-1.5 group"
              >
                <div className="flex items-center justify-between text-[8.5px] font-bold">
                  <span className="text-cyber-pink uppercase">#{feed.tag}</span>
                  <span className="text-slate-500 uppercase">{feed.category}</span>
                </div>
                <h4 className="text-[11.5px] font-semibold text-slate-200 group-hover:text-white leading-snug transition-colors">
                  {feed.title}
                </h4>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Settings Customizer Panel in Top Right Corner */}
      <div className="fixed right-6 top-5 z-50 flex items-start">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 bg-gradient-to-tr from-cyber-purple to-cyber-pink hover:opacity-90 rounded-full shadow-glow-purple border border-white/10 text-white transition-all flex items-center justify-center cursor-pointer"
          title="Customize Theme & Presets"
        >
          <Settings className={`w-4 h-4 ${isOpen ? 'animate-spin' : ''}`} />
        </button>

        <div className={`glass-panel border border-white/10 rounded-2xl p-4 w-52 flex flex-col gap-4 shadow-2xl transition-all duration-300 absolute right-0 top-12 transform ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}>
          <div className="border-b border-white/5 pb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customizer Settings</span>
          </div>

          {/* Option 1: Background Presets */}
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Background presets</span>
            <div className="grid grid-cols-3 gap-2">
              {backgrounds.map(bg => (
                <button
                  key={bg.name}
                  onClick={() => setSelectedBg(bg.name)}
                  className={`w-full h-8 rounded-lg ${bg.preview} transition-all relative flex items-center justify-center cursor-pointer hover:scale-105`}
                  title={bg.name}
                >
                  {selectedBg === bg.name && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-pink shadow-glow-purple"></span>
                  )}
                </button>
              ))}
            </div>
            <span className="text-[9px] text-cyber-cyan font-bold text-center truncate">{selectedBg}</span>
          </div>

          {/* Option 2: Accent Template Colors */}
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Accent Palette</span>
            <div className="grid grid-cols-4 gap-1.5">
              {themes.map(t => (
                <button
                  key={t.name}
                  onClick={() => applyTheme(t)}
                  className={`w-5.5 h-5.5 rounded-full ${t.bg} border border-white/10 hover:scale-125 transition-all cursor-pointer`}
                  title={t.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={
        <div className="min-h-screen bg-[#03001e] flex flex-col items-center justify-center text-white gap-3 select-none">
          <div className="w-10 h-10 border-4 border-cyber-purple/20 border-t-cyber-cyan rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-400 tracking-wider">Syncing TechSetu AI...</span>
        </div>
      }>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Dashboard Core Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout><DashboardPage /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/dsa" element={
            <ProtectedRoute>
              <AppLayout><DsaCodingHubPage /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <AppLayout><LeaderboardPage /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/editor" element={
            <ProtectedRoute>
              <AppLayout><CodeEditorPage /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/workspace" element={
            <ProtectedRoute>
              <AppLayout><ProjectHubPage /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/ai" element={
            <ProtectedRoute>
              <AppLayout><AiPlaygroundPage /></AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/analyzer" element={
            <ProtectedRoute>
              <AppLayout><SkillAnalyzerPage /></AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/roadmap" element={
            <ProtectedRoute>
              <AppLayout><RoadmapPage /></AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/interview" element={
            <ProtectedRoute>
              <AppLayout><MockInterviewPage /></AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/resume" element={
            <ProtectedRoute>
              <AppLayout><ResumeOptimizerPage /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/nontech" element={
            <ProtectedRoute>
              <AppLayout><NonTechHubPage /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/news" element={
            <ProtectedRoute>
              <AppLayout><TechNewsPage /></AppLayout>
            </ProtectedRoute>
          } />

          {/* Fallback routing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
