import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Pages
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import SkillAnalyzerPage from './pages/SkillAnalyzerPage.jsx';
import RoadmapPage from './pages/RoadmapPage.jsx';
import MockInterviewPage from './pages/MockInterviewPage.jsx';
import ResumeOptimizerPage from './pages/ResumeOptimizerPage.jsx';

// Common Layout components
import Sidebar from './components/common/Sidebar.jsx';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector(state => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Shell wrapper for logged in pages
function AppLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-[#03001e] pl-64 transition-all duration-300">
        <div className="pt-20 pb-8 px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
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

        {/* Fallback routing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
