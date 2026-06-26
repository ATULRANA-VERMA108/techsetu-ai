import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

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

const TECH_NEWS = [
  { id: 1, tag: "AI/ML", title: "OpenAI announces GPT-5 with multi-modal reasoning and 99% logic validation." },
  { id: 2, tag: "MongoDB", title: "MongoDB 8.0 launches with 3x faster query engines & vector indexes." },
  { id: 3, tag: "Google", title: "Google I/O 2026: Gemini 2.5 Pro debuts with 2M token context window." },
  { id: 4, tag: "Hackathons", title: "GitHub Universe AI-Agent Hackathon 2026 announced with $100k pool." },
  { id: 5, tag: "Regulation", title: "EU AI Act enters active enforcement phase for foundation models." }
];

// Shell wrapper for logged in pages
function AppLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-[#03001e] pl-64 transition-all duration-300 pb-16">
        <div className="pt-20 pb-8 px-8">
          {children}
        </div>
      </main>

      {/* Marquee Ticker */}
      <div 
        onClick={() => navigate('/news')}
        className="fixed bottom-0 left-64 right-0 h-10 bg-cyber-deep/90 border-t border-white/5 backdrop-blur-xl flex items-center z-10 overflow-hidden px-4 cursor-pointer hover:bg-white/5 transition-all"
        title="Click to view detailed Inshorts Tech Feed"
      >
        {/* Ticker Title */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-cyber-purple to-cyber-pink px-3 py-1 rounded text-[10px] font-bold text-white z-20 shadow-glow-purple select-none shrink-0">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
          LIVE TECH FEED
        </div>
        
        {/* Scrolling text container */}
        <div className="relative w-full overflow-hidden flex items-center h-full">
          <div className="flex gap-16 whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
            {TECH_NEWS.concat(TECH_NEWS).map((news, idx) => (
              <span 
                key={`${news.id}-${idx}`} 
                className="text-[11px] text-slate-300 hover:text-cyber-cyan transition-colors font-medium flex items-center gap-2"
              >
                <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-bold text-cyber-pink uppercase tracking-wide">
                  #{news.tag}
                </span>
                {news.title}
                <span className="text-slate-500 font-bold ml-4">|</span>
              </span>
            ))}
          </div>
        </div>

        {/* CSS for Marquee */}
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 45s linear infinite;
          }
        `}</style>
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
