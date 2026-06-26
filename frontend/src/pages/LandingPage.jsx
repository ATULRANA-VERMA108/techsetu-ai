import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Waypoints, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  Compass, 
  Terminal, 
  MessageSquare, 
  HelpCircle,
  Briefcase
} from 'lucide-react';

const STEPS = [
  {
    icon: ShieldCheck,
    title: "Step 1: Secure Quick Authentication",
    description: "Get started in seconds. Securely log in using your standard email credentials or instantly link your Google / GitHub account. TechSetu utilizes optimized JWT tokens and quick local database fallbacks so you never experience slow authentication loading screens.",
    bullets: ["Zero-wait local mock authorization fallback", "Google and GitHub SSO integration hooks", "Password security hashing and email recovery"],
    previewType: "auth"
  },
  {
    icon: FileText,
    title: "Step 2: Run Skill Gap & Resume Analysis",
    description: "Define your target career role (e.g. React Developer, Cloud Architect) and paste your current CV/skills. Our system parses the parameters and returns your custom Bridge Score alongside your missing and acquired industry skills.",
    bullets: ["Automated resume analyzer and CV scanner", "Comparative score matrix calculation", "Identifies precise tech stack gaps"],
    previewType: "gap"
  },
  {
    icon: Compass,
    title: "Step 3: Generate Structured Learning Roadmaps",
    description: "Based on the missing skills gap, the engine designs a custom learning timeline showing hour durations and topics. Each milestone contains checkpoint quizzes and learning links to help you track your progress.",
    bullets: ["Interactive milestone progression gates", "Built-in assessment checkpoint quizzes", "Verified external platform directories"],
    previewType: "roadmap"
  },
  {
    icon: Terminal,
    title: "Step 4: Practice in Sandbox Compiler Coding Hub",
    description: "Write, test, and execute algorithms directly inside the dashboard workspace. Select major languages like Java, C++, Python, and JavaScript, solving coding patterns with instant sandbox compilation feedback.",
    bullets: ["Integrated split-pane code editor layout", "AI-generated coding logic explanations", "Supports Java, Python, C++, and JS"],
    previewType: "compiler"
  },
  {
    icon: MessageSquare,
    title: "Step 5: Complete Vernacular Mock Interviews",
    description: "Simulate actual technical rounds. Speak in Hinglish, English, or Hindi, and receive detailed scorecards assessing your technical correctness, communication skills, and architectural depth.",
    bullets: ["Multi-lingual speech prompt adapters", "Detailed performance rating summaries", "Actionable tips and strength logs"],
    previewType: "interview"
  },
  {
    icon: Briefcase,
    title: "Step 6: Explore the Non-Tech Transition Hub",
    description: "If you don't have a programming background, access specialized transition pathways for roles like UI/UX Designers, CRM Analysts, and Data Analysts to build real-world project portfolios.",
    bullets: ["No-code role templates and roadmaps", "Interactive career salary & outlook cards", "Hands-on project development guidelines"],
    previewType: "nontech"
  }
];

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="relative min-h-screen overflow-y-auto flex flex-col justify-between bg-cyber-deep text-white font-sans selection:bg-cyber-purple selection:text-white">
      
      {/* Moving Cyberspace Grid Backdrop */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20 z-0"></div>
      
      {/* Background Decorative Blur Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyber-purple/10 rounded-full blur-[120px] animate-glow pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyber-cyan/10 rounded-full blur-[120px] animate-glow pointer-events-none"></div>

      {/* Navigation Toolbar */}
      <header className="max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between z-10 border-b border-white/5 bg-cyber-deep/60 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-cyber-purple to-cyber-pink rounded-xl shadow-glow-purple">
            <Waypoints className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-display font-extrabold text-lg tracking-tight text-white block">
              TechSetu AI
            </span>
            <span className="text-[9px] text-cyber-cyan font-bold tracking-widest uppercase block -mt-1">
              Career Bridge
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-all">
            Sign In
          </Link>
          <Link to="/signup" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-pink text-xs font-bold text-white shadow-glow-purple hover:scale-105 transition-all">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Welcome Intro & Interactive Walkthrough */}
      <main className="max-w-7xl w-full mx-auto px-6 py-12 flex-1 flex flex-col gap-12 z-10">
        
        {/* Welcome Intro Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-purple/10 border border-cyber-purple/20 text-cyber-cyan text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Learning Platform</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-tight tracking-tight">
            How <span className="text-gradient-shimmer font-black">TechSetu AI</span> Works
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            TechSetu AI is an end-to-end career transition portal. We analyze your tech capabilities, generate custom learning milestones, provide compile workspaces, and run vernacular interviews. Explore the step-by-step guide below to get started.
          </p>
        </div>

        {/* Walkthrough Content Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Accordion Steps (Lg: col-span-7) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4 text-cyber-cyan" />
              <span>Step-by-Step Platform Guide</span>
            </div>

            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              return (
                <div 
                  key={idx} 
                  onClick={() => setActiveStep(idx)}
                  className={`glass-panel rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                    isActive 
                      ? 'border-cyber-purple/50 bg-cyber-purple/5 shadow-glow-purple' 
                      : 'border-white/5 bg-white/1 hover:border-white/10'
                  }`}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-colors ${
                        isActive ? 'bg-cyber-purple text-white' : 'bg-white/5 text-slate-400'
                      }`}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <h3 className={`text-xs md:text-sm font-bold font-display ${
                        isActive ? 'text-white' : 'text-slate-300'
                      }`}>
                        {step.title}
                      </h3>
                    </div>
                    <div className={`w-2 h-2 rounded-full transition-all ${
                      isActive ? 'bg-cyber-cyan scale-125' : 'bg-slate-700'
                    }`} />
                  </div>

                  {/* Collapsible Content */}
                  <div className={`transition-all duration-300 ease-in-out px-4 pb-4 ${
                    isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}>
                    <p className="text-[11.5px] text-slate-400 leading-relaxed mb-3">
                      {step.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-t border-white/5 pt-3">
                      {step.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-1.5 text-[9.5px] text-slate-300">
                          <div className="w-1 h-1 bg-cyber-cyan rounded-full" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Direct CTA */}
            <div className="pt-4 text-center lg:text-left">
              <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-pink font-bold text-xs text-white shadow-glow-purple hover:translate-y-[-2px] transition-all hover:scale-105">
                <span>Enter Career Portal Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Mockup Previews (Lg: col-span-5) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Dynamic Screen Preview</span>
            </div>
            
            <div className="glass-panel rounded-3xl border border-white/10 p-5 bg-[#0a0026]/90 relative overflow-hidden min-h-[300px] flex flex-col justify-between shadow-2xl">
              {/* Outer top border grid lines */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyber-purple via-cyber-pink to-cyber-cyan"></div>
              
              {/* Render dynamic mockup depending on active step */}
              {STEPS[activeStep].previewType === 'auth' && (
                <div className="space-y-4 my-auto animate-in fade-in zoom-in-95 duration-200">
                  <div className="text-center">
                    <Waypoints className="w-8 h-8 text-cyber-purple mx-auto mb-2 animate-bounce" />
                    <h4 className="text-xs font-bold font-display">Authentication Portal</h4>
                    <p className="text-[10px] text-slate-400">Security Gate Access</p>
                  </div>
                  <div className="space-y-2 max-w-xs mx-auto">
                    <div className="h-8 bg-white/5 rounded border border-white/10 flex items-center px-3 text-[9px] text-slate-400">Email Address</div>
                    <div className="h-8 bg-white/5 rounded border border-white/10 flex items-center px-3 text-[9px] text-slate-400">Password</div>
                    <button className="w-full h-8 bg-cyber-purple rounded text-[9.5px] font-bold">Sign In</button>
                    <div className="flex gap-2 justify-center pt-2">
                      <span className="px-2 py-1 bg-white/5 rounded text-[8px] border border-white/10">Google</span>
                      <span className="px-2 py-1 bg-white/5 rounded text-[8px] border border-white/10">GitHub</span>
                    </div>
                  </div>
                </div>
              )}

              {STEPS[activeStep].previewType === 'gap' && (
                <div className="space-y-4 my-auto text-center animate-in fade-in zoom-in-95 duration-200">
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                      <circle cx="48" cy="48" r="40" stroke="#7f00ff" strokeWidth="6" fill="transparent" strokeDasharray="251.2" strokeDashoffset="62.8" className="animate-pulse" />
                    </svg>
                    <span className="absolute text-sm font-black font-display text-cyber-cyan">75%</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-display">Bridge Score Computed</h4>
                    <p className="text-[9px] text-slate-400 mt-1 max-w-xs mx-auto">Missing: Redux, TypeScript, Docker. Acquired: HTML, CSS, REST APIs.</p>
                  </div>
                  <div className="flex gap-1 justify-center">
                    <span className="text-[8px] px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">Resume Matched</span>
                    <span className="text-[8px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Score Optimized</span>
                  </div>
                </div>
              )}

              {STEPS[activeStep].previewType === 'roadmap' && (
                <div className="space-y-3 my-auto animate-in fade-in zoom-in-95 duration-200">
                  <div className="border-b border-white/5 pb-2">
                    <h4 className="text-xs font-bold font-display text-cyber-cyan">Roadmap Milestones</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 bg-white/5 border-l-2 border-cyber-cyan rounded flex items-center justify-between text-[9px]">
                      <span>1. Core CSS Flex & Grids</span>
                      <span className="text-[8px] bg-green-500/20 text-green-400 px-1 rounded">Passed</span>
                    </div>
                    <div className="p-2 bg-white/5 border-l-2 border-cyber-purple rounded flex items-center justify-between text-[9px]">
                      <span>2. ES6 Async / Promises</span>
                      <span className="text-[8px] bg-cyber-purple/20 text-cyber-cyan px-1 rounded">Unlock Quiz</span>
                    </div>
                    <div className="p-2 bg-white/5 border-l-2 border-slate-700 rounded flex items-center justify-between text-[9px] opacity-50">
                      <span>3. React State Hooks</span>
                      <span className="text-[8px] text-slate-400">Locked</span>
                    </div>
                  </div>
                </div>
              )}

              {STEPS[activeStep].previewType === 'compiler' && (
                <div className="space-y-3 my-auto animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[9px]">
                    <span className="font-mono text-slate-400">Solution.java</span>
                    <span className="bg-cyber-purple text-white px-2 py-0.5 rounded font-bold">Java 21</span>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded font-mono text-[8px] text-green-400 leading-normal border border-white/5">
                    <p><span className="text-purple-400">public class</span> Solution &#123;</p>
                    <p className="pl-4"><span className="text-purple-400">public int[]</span> twoSum(<span className="text-purple-400">int[]</span> nums) &#123;</p>
                    <p className="pl-8 text-slate-400">// Optimize time O(N)</p>
                    <p className="pl-4">&#125;</p>
                    <p>&#125;</p>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-1.5 rounded text-[8.5px]">
                    <span className="text-green-400 font-semibold">Test Case Passed!</span>
                    <span className="text-slate-500 font-mono">Time: 12ms</span>
                  </div>
                </div>
              )}

              {STEPS[activeStep].previewType === 'interview' && (
                <div className="space-y-3 my-auto animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-cyber-pink animate-pulse"></div>
                    <span className="text-[9px] font-bold">AI Interviewer Simulator</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white/5 p-2 rounded text-[8.5px] max-w-[80%] border border-white/5 text-slate-300">
                      Explain JVM memory pools, thread safeties and concurrent collections. (Hindi/Hinglish allowed)
                    </div>
                    <div className="bg-cyber-purple/20 p-2 rounded text-[8.5px] max-w-[80%] ml-auto border border-cyber-purple/30 text-white">
                      Hame ConcurrentHashMap use karna chahiye parameters safe transitions ke liye...
                    </div>
                  </div>
                  <div className="text-[8px] text-center text-slate-500">Press spacebar to speak</div>
                </div>
              )}

              {STEPS[activeStep].previewType === 'nontech' && (
                <div className="space-y-3 my-auto animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[9px]">
                    <span className="font-bold text-cyber-pink">Non-Tech Transition Board</span>
                    <span className="text-cyber-cyan font-bold">4 Roles Available</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[9px]">
                    <div className="p-2 bg-white/5 border border-white/10 rounded text-center">
                      <p className="font-bold text-white">UI/UX Designer</p>
                      <p className="text-[7.5px] text-slate-400 mt-1">Growth: +16%</p>
                    </div>
                    <div className="p-2 bg-white/5 border border-white/10 rounded text-center">
                      <p className="font-bold text-white">CRM Analyst</p>
                      <p className="text-[7.5px] text-slate-400 mt-1">Growth: +12%</p>
                    </div>
                  </div>
                  <div className="p-2 bg-white/5 border border-white/10 rounded flex items-center justify-between text-[8px]">
                    <span>Figma Portfolio Project guide unlocked</span>
                    <span className="text-cyber-cyan font-semibold">Start</span>
                  </div>
                </div>
              )}

              {/* Bottom stats indicator */}
              <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[8.5px] text-slate-500 font-semibold">
                <span>TECHSETU DEV BOARD</span>
                <span>STATUS: SECURED</span>
              </div>
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
