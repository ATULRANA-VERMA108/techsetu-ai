import React from 'react';
import { Link } from 'react-router-dom';
import { Waypoints, ArrowRight, Compass, MessageSquareCode, FileCheck, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col justify-between bg-cyber-deep">
      
      {/* Moving Cyberspace Grid Backdrop */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40 z-0"></div>
      
      {/* Background Decorative Blur Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyber-purple/10 rounded-full blur-[120px] animate-glow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyber-cyan/10 rounded-full blur-[120px] animate-glow"></div>

      {/* Navigation Toolbar */}
      <header className="max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-cyber-purple to-cyber-pink rounded-xl shadow-glow-purple">
            <Waypoints className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight text-white">
            TechSetu AI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-all">
            Sign In
          </Link>
          <Link to="/signup" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-pink text-sm font-bold text-white shadow-glow-purple hover:scale-105 transition-all">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-center items-center text-center z-10">
        
        <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-tight tracking-tight text-white mb-6 animate-float">
          Bridge the Gap to your <br />
          <span className="text-gradient-shimmer">
            Dream Tech Career
          </span>
        </h1>

        <p className="max-w-2xl text-slate-400 text-base md:text-lg mb-10 leading-relaxed">
          Upload your resume and choose your target job role. Our AI analyzes your skills, constructs an interactive learning roadmap, and prepares you with mock interview simulator assessments.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link to="/signup" className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-pink font-bold text-white shadow-glow-purple hover:translate-y-[-2px] transition-all hover:scale-105">
            <span>Analyze Your Skill Gap Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Feature Grid Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          
          <div className="moving-glow-card glass-panel p-8 rounded-2xl text-left hover:border-cyber-cyan/30 hover:scale-[1.03] transition-all duration-300 group z-10 cursor-pointer">
            <div className="relative z-10">
              <div className="p-3 bg-cyber-cyan/10 border border-cyber-cyan/20 w-fit rounded-xl text-cyber-cyan mb-6 group-hover:scale-110 transition-transform duration-300">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-cyber-cyan transition-colors duration-300">
                Skill Gap Analyzer
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Upload your CV. We compile a dynamic "Bridge Score" and highlight exactly which production skills you need to learn.
              </p>
            </div>
          </div>

          <div className="moving-glow-card glass-panel p-8 rounded-2xl text-left hover:border-cyber-purple/30 hover:scale-[1.03] transition-all duration-300 group z-10 cursor-pointer">
            <div className="relative z-10">
              <div className="p-3 bg-cyber-purple/10 border border-cyber-purple/20 w-fit rounded-xl text-cyber-purple mb-6 group-hover:scale-110 transition-transform duration-300">
                <Waypoints className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-cyber-purple transition-colors duration-300">
                Dynamic Roadmaps
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Unlock vertical milestones, curated tutorial link cards, and custom checkpoint quizzes equipped with interactive reward systems.
              </p>
            </div>
          </div>

          <div className="moving-glow-card glass-panel p-8 rounded-2xl text-left hover:border-cyber-pink/30 hover:scale-[1.03] transition-all duration-300 group z-10 cursor-pointer">
            <div className="relative z-10">
              <div className="p-3 bg-cyber-pink/10 border border-cyber-pink/20 w-fit rounded-xl text-cyber-pink mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageSquareCode className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-cyber-pink transition-colors duration-300">
                Vernacular Mock Interviews
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Practice speaking in Hinglish, Hindi, or English. Receive granular performance reports assessing technical correctness and communication skills.
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* Footer bar */}
      <footer className="h-16 border-t border-white/5 flex items-center justify-center text-xs text-slate-500 z-10">
        <span>© 2026 TechSetu AI. All Rights Reserved.</span>
      </footer>

    </div>
  );
}
