import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header.jsx';
import { 
  Trophy, 
  CheckCircle2, 
  Code2, 
  ExternalLink, 
  Flame, 
  User, 
  Save, 
  BookOpen, 
  Terminal,
  Search,
  Sparkles,
  Youtube,
  Linkedin,
  Compass,
  ArrowRight,
  BookOpenCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { 
  DSA_SHEETS, 
  PLATFORMS, 
  MENTORS_DIRECTORY, 
  DSA_TOPICS, 
  CHEAT_SHEETS 
} from '../data/dsaData.js';


export default function DsaCodingHubPage() {
  // Profiles state
  const [solvedInput, setSolvedInput] = useState(() => localStorage.getItem('dsa_solved_count') || '0');
  const [solvedCount, setSolvedCount] = useState(() => parseInt(localStorage.getItem('dsa_solved_count') || '0'));
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('dsa_streak') || '0'));
  const [leetcodeUser, setLeetcodeUser] = useState(() => localStorage.getItem('leetcode_user') || '');
  const [cfUser, setCfUser] = useState(() => localStorage.getItem('codeforces_user') || '');
  
  // Problems completed mapping
  const [completedProblems, setCompletedProblems] = useState(() => {
    const saved = localStorage.getItem('completed_dsa_problems');
    return saved ? JSON.parse(saved) : {};
  });

  // UI state
  const [activeTopic, setActiveTopic] = useState('phase-1');
  const [activeLang, setActiveLang] = useState('cpp');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Active topic
  const activeTopicObj = DSA_TOPICS.find(t => t.id === activeTopic) || DSA_TOPICS[0];

  // Search logic across all phases
  const searchResults = React.useMemo(() => {
    if (!searchTerm.trim()) return null;
    const term = searchTerm.toLowerCase();
    const results = [];
    DSA_TOPICS.forEach(phase => {
      phase.problems.forEach(prob => {
        if (prob.name.toLowerCase().includes(term) || phase.title.toLowerCase().includes(term)) {
          results.push({ ...prob, phaseTitle: phase.title });
        }
      });
    });
    return results;
  }, [searchTerm]);

  const displayProblems = searchResults !== null ? searchResults : activeTopicObj.problems;

  // Sync statistics
  const totalProblems = DSA_TOPICS.reduce((acc, topic) => acc + topic.problems.length, 0);
  const completedCount = Object.values(completedProblems).filter(Boolean).length;
  const progressPercent = totalProblems > 0 ? Math.round((completedCount / totalProblems) * 100) : 0;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('dsa_solved_count', solvedInput);
    localStorage.setItem('dsa_streak', streak.toString());
    localStorage.setItem('leetcode_user', leetcodeUser);
    localStorage.setItem('codeforces_user', cfUser);
    setSolvedCount(parseInt(solvedInput) || 0);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const toggleProblem = (probName) => {
    const nextCompleted = {
      ...completedProblems,
      [probName]: !completedProblems[probName]
    };
    setCompletedProblems(nextCompleted);
    localStorage.setItem('completed_dsa_problems', JSON.stringify(nextCompleted));

    if (!completedProblems[probName]) {
      confetti({
        particleCount: 40,
        spread: 30,
        origin: { y: 0.8 }
      });
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      <Header title="DSA & Competitive Coding Hub" />

      {/* KPI statistics section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="glass-panel p-4 rounded-xl flex items-center gap-4 relative overflow-hidden bg-gradient-to-tr from-cyber-purple/10 to-transparent">
          <div className="p-3 bg-cyber-purple/20 rounded-xl text-cyber-purple">
            <Trophy className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Solved</p>
            <h4 className="text-xl font-bold text-white mt-0.5">{solvedCount + completedCount}</h4>
            <span className="text-[9px] text-cyber-cyan font-medium">+{completedCount} from sheet tracker</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center gap-4 relative overflow-hidden bg-gradient-to-tr from-cyber-pink/10 to-transparent">
          <div className="p-3 bg-cyber-pink/20 rounded-xl text-cyber-pink">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Streak</p>
            <div className="flex items-center gap-2 mt-0.5">
              <h4 className="text-xl font-bold text-white">{streak} days</h4>
              <div className="flex gap-0.5">
                <button onClick={() => setStreak(prev => Math.max(0, prev - 1))} className="text-[9px] bg-white/5 hover:bg-white/10 px-1 rounded cursor-pointer font-bold text-white">-</button>
                <button onClick={() => setStreak(prev => prev + 1)} className="text-[9px] bg-white/5 hover:bg-white/10 px-1 rounded cursor-pointer font-bold text-white">+</button>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center gap-4 relative overflow-hidden bg-gradient-to-tr from-cyber-cyan/10 to-transparent">
          <div className="p-3 bg-cyber-cyan/20 rounded-xl text-cyber-cyan">
            <BookOpenCheck className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Curated Sheet Progress</p>
            <div className="flex items-center justify-between mt-0.5">
              <h4 className="text-sm font-bold text-white">{completedCount}/{totalProblems} Problems</h4>
              <span className="text-[10px] font-bold text-cyber-cyan">{progressPercent}%</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-gradient-to-r from-cyber-purple to-cyber-cyan h-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center gap-4 relative overflow-hidden bg-gradient-to-tr from-cyber-blue/10 to-transparent">
          <div className="p-3 bg-cyber-blue/20 rounded-xl text-cyber-blue">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Current Level</p>
            <h4 className="text-sm font-bold text-white mt-0.5">
              {solvedCount + completedCount < 40 ? 'Beginner Bridger' : solvedCount + completedCount < 100 ? 'Algorithms Cadet' : 'Master Competitive SDE'}
            </h4>
            <span className="text-[9px] text-slate-500">Solve sheets to raise your title!</span>
          </div>
        </div>

      </div>

      {/* Main split workarea */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column (2/3 width): Sheet and Editor Cheat Sheets */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main DSA Curriculum Hub Card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-5">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-cyber-border pb-4 gap-3">
              <div>
                <h3 className="font-display font-extrabold text-white text-base">Curated DSA Curriculum Sheet</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">16 Core Phases covering coding interview patterns</p>
              </div>
              
              {/* Dynamic search across all phases */}
              <div className="relative w-full md:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search questions or phases..."
                  className="w-full text-xs bg-white/5 border border-cyber-border rounded-lg py-2 pl-9 pr-3 focus:outline-none focus:border-cyber-purple/50 text-white font-medium"
                />
              </div>
            </div>

            {/* Split layout inside the card: Left topic sidebar, Right problem table */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-start">
              
              {/* Left sidebar: 16 Phases */}
              <div className="md:col-span-1 flex flex-col gap-1 max-h-[55vh] overflow-y-auto pr-1">
                {DSA_TOPICS.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setActiveTopic(topic.id);
                      setSearchTerm('');
                    }}
                    className={`px-3 py-2 rounded-lg text-left text-[10px] font-bold transition-all border-l-2 cursor-pointer ${
                      activeTopic === topic.id && !searchTerm
                        ? 'bg-gradient-to-r from-cyber-purple/15 to-cyber-pink/5 border-cyber-purple text-white'
                        : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {topic.title}
                  </button>
                ))}
              </div>

              {/* Right list: Problems display */}
              <div className="md:col-span-3 flex flex-col gap-2.5 max-h-[55vh] overflow-y-auto pr-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>{searchTerm ? `Search results for "${searchTerm}"` : activeTopicObj.title}</span>
                  <span className="text-cyber-cyan">{displayProblems.length} Problems</span>
                </div>

                {displayProblems.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs bg-white/2 border border-white/5 rounded-xl">
                    No matching problems found.
                  </div>
                ) : (
                  displayProblems.map(prob => {
                    const isCompleted = !!completedProblems[prob.name];
                    return (
                      <div 
                        key={prob.name}
                        className={`flex items-center justify-between p-3 border rounded-xl transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-emerald-500/5 border-emerald-500/20' 
                            : 'bg-white/3 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleProblem(prob.name)}
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all cursor-pointer ${
                              isCompleted 
                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                : 'border-white/20 hover:border-cyber-purple/50 bg-white/5'
                            }`}
                          >
                            {isCompleted && <span className="text-[10px] font-bold">✓</span>}
                          </button>
                          <div>
                            <span className={`text-[12px] font-bold ${isCompleted ? 'text-slate-500 line-through' : 'text-white'}`}>
                              {prob.name}
                            </span>
                            {prob.phaseTitle && (
                              <div className="text-[8px] text-cyber-pink font-bold uppercase mt-0.5">{prob.phaseTitle}</div>
                            )}
                            <div className="flex gap-2 items-center mt-1 flex-wrap">
                              <span className={`text-[8.5px] font-bold uppercase tracking-wider ${
                                prob.difficulty === 'Easy' ? 'text-emerald-400' : prob.difficulty === 'Medium' ? 'text-amber-400' : 'text-red-400'
                              }`}>
                                {prob.difficulty}
                              </span>
                              <span className="text-slate-500">•</span>
                              <a 
                                href={prob.practiceUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[8.5px] text-slate-400 hover:text-cyber-cyan flex items-center gap-0.5 font-semibold transition-colors"
                              >
                                <span>Practice Code</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                              <span className="text-slate-500">•</span>
                              <a 
                                href={prob.conceptUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[8.5px] text-slate-400 hover:text-cyber-pink flex items-center gap-0.5 font-semibold transition-colors"
                              >
                                <span>Concept Resources</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </div>
                        </div>

                        <Link 
                          to={`/editor?question=${prob.path}`}
                          className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-cyber-purple/20 to-cyber-pink/20 hover:from-cyber-purple/35 hover:to-cyber-pink/35 border border-cyber-purple/30 rounded-lg text-[9px] text-white font-bold transition-all shrink-0"
                        >
                          <Code2 className="w-3 h-3 text-cyber-pink" />
                          <span>Solve</span>
                        </Link>
                      </div>
                    );
                  })
                )}
              </div>

            </div>

          </div>

          {/* Interactive Coding Sandbox Cheat Sheet */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between border-b border-cyber-border pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyber-purple" />
                <h3 className="font-display font-extrabold text-white text-sm">Algorithms Cheat Sheet</h3>
              </div>
              
              <div className="flex gap-1.5">
                {Object.keys(CHEAT_SHEETS).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      activeLang === lang 
                        ? 'text-cyber-cyan border-b-2 border-cyber-cyan' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang === 'cpp' ? 'C++' : lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <pre className="p-4 bg-black/40 border border-white/5 rounded-xl text-[10px] text-slate-300 overflow-x-auto max-h-64 font-mono leading-relaxed">
                <code>{CHEAT_SHEETS[activeLang]}</code>
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(CHEAT_SHEETS[activeLang]);
                  confetti({ particleCount: 20, spread: 20, origin: { y: 0.8 } });
                }}
                className="absolute top-3 right-3 py-1 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[8px] font-bold text-white transition-all cursor-pointer"
              >
                Copy Template
              </button>
            </div>
          </div>

        </div>

        {/* Right Column (1/3 width): Profiles, Counselor Mentors, sheets */}
        <div className="space-y-6">
          
          {/* Platform Profiles */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 mb-4 border-b border-cyber-border pb-3">
              <User className="w-4 h-4 text-cyber-cyan" />
              <h3 className="font-display font-extrabold text-white text-xs">Coding Platform Profiles</h3>
            </div>

            {savedSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg p-2 text-[10px] mb-4 text-center font-medium">
                Stats saved successfully!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-semibold">Total Platforms Solved Count</label>
                <input
                  type="number"
                  value={solvedInput}
                  onChange={(e) => setSolvedInput(e.target.value)}
                  className="glass-input p-2.5 text-xs"
                  placeholder="e.g. 142"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-semibold">LeetCode Username</label>
                <input
                  type="text"
                  value={leetcodeUser}
                  onChange={(e) => setLeetcodeUser(e.target.value)}
                  className="glass-input p-2.5 text-xs"
                  placeholder="leetcode_handle"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-semibold">Codeforces Handle</label>
                <input
                  type="text"
                  value={cfUser}
                  onChange={(e) => setCfUser(e.target.value)}
                  className="glass-input p-2.5 text-xs"
                  placeholder="cf_handle"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-pink font-bold text-xs text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow-purple cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Stats</span>
              </button>

            </form>
          </div>

          {/* Mentors & Career Counselors (Rich Indian & Global Directory) */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-cyber-border pb-3">
              <Linkedin className="w-4 h-4 text-cyber-blue" />
              <h3 className="font-display font-extrabold text-white text-xs">Mentors & Counselors</h3>
            </div>

            {/* Scrollable list of counselor directory */}
            <div className="flex flex-col gap-3 max-h-[45vh] overflow-y-auto pr-1">
              {MENTORS_DIRECTORY.map((mentor) => (
                <a
                  key={mentor.name}
                  href={mentor.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col p-3 bg-white/3 border border-white/5 hover:border-cyber-blue/40 rounded-xl transition-all group text-left relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-cyber-blue transition-colors">
                      {mentor.name}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[8.5px] text-cyber-blue font-bold uppercase mt-0.5 tracking-wider">{mentor.role}</span>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    {mentor.desc}
                  </p>
                  <span className={`text-[7px] font-extrabold absolute bottom-2 right-2 px-1 rounded uppercase ${
                    mentor.origin === 'India' ? 'bg-orange-500/10 text-orange-400' : 'bg-cyber-cyan/15 text-cyber-cyan'
                  }`}>
                    {mentor.origin}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Access DSA sheets */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 mb-4 border-b border-cyber-border pb-3">
              <BookOpen className="w-4 h-4 text-cyber-pink" />
              <h3 className="font-display font-extrabold text-white text-xs">DSA Standard Sheets</h3>
            </div>

            <div className="flex flex-col gap-3">
              {DSA_SHEETS.map((sheet) => (
                <a
                  key={sheet.name}
                  href={sheet.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col p-3 bg-white/3 border border-white/5 hover:border-cyber-pink/40 rounded-xl transition-all group text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-cyber-pink transition-colors">
                      {sheet.name}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                    {sheet.description}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* Competitive Platform Shortcuts */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 mb-4 border-b border-cyber-border pb-3">
              <Code2 className="w-4 h-4 text-cyber-purple" />
              <h3 className="font-display font-extrabold text-white text-xs">Competitive Shortcuts</h3>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {PLATFORMS.map((plat) => (
                <a
                  key={plat.name}
                  href={plat.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center justify-between p-3 rounded-xl bg-gradient-to-r border border-white/5 hover:border-white/10 transition-all ${plat.color} text-left`}
                >
                  <div>
                    <span className={`text-xs font-bold ${plat.textColor}`}>{plat.name}</span>
                    <p className="text-[9px] text-slate-400 leading-normal mt-0.5">{plat.desc}</p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
