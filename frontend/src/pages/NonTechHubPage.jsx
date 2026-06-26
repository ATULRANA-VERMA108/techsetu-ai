import React, { useState } from 'react';
import { NonTechAPI } from '../services/api';
import { 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  LineChart, 
  BookOpen, 
  Briefcase, 
  Code, 
  CheckCircle2, 
  ArrowRight,
  Wand2
} from 'lucide-react';

const POPULAR_ROLES = [
  { name: 'UI/UX Designer', desc: 'Design user interfaces, map user journeys, build interactive wireframes & Figma prototypes.' },
  { name: 'CRM Analyst', desc: 'Manage customer relations systems, build sales pipelines, automate workflows & run CRM analytics.' },
  { name: 'Data Analyst', desc: 'Clean business datasets, run SQL queries, build BI dashboards & extract market insights.' },
  { name: 'Product Manager', desc: 'Define product features, run scrum sprints, coordinate design & engineering releases.' }
];

export default function NonTechHubPage() {
  const [selectedRole, setSelectedRole] = useState('');
  const [customSkills, setCustomSkills] = useState('');
  const [useAiMode, setUseAiMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (roleName) => {
    const roleToQuery = roleName || selectedRole;
    if (!roleToQuery) {
      setError('Please select a career role or type one.');
      return;
    }
    setError('');
    setLoading(true);
    setAnalysisResult(null);

    try {
      const data = await NonTechAPI.analyze(roleToQuery, customSkills);
      setAnalysisResult(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve transition insights.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans pb-16">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-cyber-cyan text-xs font-bold uppercase tracking-wider">
          <Briefcase className="w-4 h-4" />
          <span>Non-Tech Career Transition Hub</span>
        </div>
        <h2 className="text-3xl font-display font-bold text-white leading-tight">
          Bridge from Non-Tech to <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyber-purple to-cyber-pink">Industry Pro</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          No coding background? No problem. Choose a tech-adjacent role below or describe your skills. We'll generate custom growth roadmaps, projects, and learning guides instantly.
        </p>
      </div>

      {/* Main Form Panel */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-6 relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyber-purple/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Generative AI Mode Toggle */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyber-cyan animate-pulse" />
            <div>
              <h4 className="text-sm font-semibold text-white">Generative AI Mode</h4>
              <p className="text-[10px] text-slate-400">Tailor roadmaps dynamically using LLMs</p>
            </div>
          </div>
          <button
            onClick={() => setUseAiMode(!useAiMode)}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
              useAiMode ? 'bg-gradient-to-r from-cyber-purple to-cyber-pink' : 'bg-white/10'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform transform ${
              useAiMode ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Popular roles grid */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">1. Select a Popular Tech-Adjacent Role</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR_ROLES.map((role) => (
              <button
                key={role.name}
                onClick={() => {
                  setSelectedRole(role.name);
                  handleAnalyze(role.name);
                }}
                className={`text-left p-4 rounded-xl border transition-all duration-300 glass-panel-hover flex flex-col gap-2 ${
                  selectedRole === role.name 
                    ? 'border-cyber-purple bg-cyber-purple/10 shadow-glow-purple' 
                    : 'border-white/5 bg-white/2'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-display">{role.name}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-3">
                  {role.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Or Enter Other Role</label>
            <input
              type="text"
              placeholder="e.g. Scrum Master, SEO Analyst, Technical Writer"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyber-purple transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">2. Type Your Skills or Paste Resume Text (Optional)</label>
            <textarea
              rows={2}
              placeholder="e.g. Good with spreadsheets, presentation design, customer relations, writing..."
              value={customSkills}
              onChange={(e) => setCustomSkills(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyber-purple transition-colors resize-none"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center pt-2">
          {error && <span className="text-xs text-red-400 font-medium">{error}</span>}
          {!error && <span className="text-[10px] text-slate-500">Selected role: {selectedRole || 'None'}</span>}
          
          <button
            onClick={() => handleAnalyze()}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-pink text-xs font-bold text-white shadow-glow-purple hover:opacity-90 transition-all flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            <span>Generate Transition Plan</span>
          </button>
        </div>
      </div>

      {/* Loading Shimmer */}
      {loading && (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-white/5 rounded-xl animate-pulse"></div>
            <div className="h-24 bg-white/5 rounded-xl animate-pulse"></div>
            <div className="h-24 bg-white/5 rounded-xl animate-pulse"></div>
          </div>
          <div className="h-64 bg-white/5 rounded-2xl animate-pulse"></div>
        </div>
      )}

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* 1. Job Outlook Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel rounded-xl p-4 border border-white/5 flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Average Salary</p>
                <h4 className="text-base font-bold text-white font-display mt-0.5">{analysisResult.outlook?.salary || 'N/A'}</h4>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-white/5 flex items-center gap-4">
              <div className="p-3 bg-cyber-purple/10 rounded-lg text-cyber-purple">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Job Growth</p>
                <h4 className="text-base font-bold text-white font-display mt-0.5">{analysisResult.outlook?.growth || 'N/A'}</h4>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-white/5 flex items-center gap-4">
              <div className="p-3 bg-cyber-pink/10 rounded-lg text-cyber-pink">
                <LineChart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Market Demand</p>
                <h4 className="text-base font-bold text-white font-display mt-0.5">{analysisResult.outlook?.demand || 'N/A'}</h4>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 2. Custom Roadmap Steps (Left Column) */}
            <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <BookOpen className="w-4 h-4 text-cyber-cyan" />
                <h3 className="text-sm font-bold text-white font-display">Target Roadmap</h3>
              </div>
              
              <div className="space-y-4 relative pl-4 border-l border-white/5">
                {analysisResult.roadmap?.map((step, idx) => (
                  <div key={idx} className="relative space-y-1">
                    {/* Circle Node */}
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-cyber-cyan border-2 border-[#03001e]" />
                    <h4 className="text-xs font-bold text-white">{step.step || `Step ${idx+1}`}</h4>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed">{step.details}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Recommended Platforms & Resource Links (Right Column) */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <Briefcase className="w-4 h-4 text-cyber-pink" />
                  <h3 className="text-sm font-bold text-white font-display">Learning Platforms</h3>
                </div>
                
                <div className="space-y-2">
                  {analysisResult.platforms?.map((platform, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/2 border border-white/5 text-[11px] text-slate-300 font-semibold"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyber-cyan" />
                      <span>{platform}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick note on practicing */}
              <div className="bg-gradient-to-tr from-cyber-purple/10 to-cyber-pink/5 rounded-xl p-3.5 border border-cyber-purple/20 text-[10px] text-slate-400 leading-relaxed">
                <strong className="text-white block mb-1">💡 How to Practice & Learn:</strong>
                Use the platforms listed above to grasp core concepts, then immediately jump into constructing the portfolio projects detailed below to establish real credibility.
              </div>
            </div>
          </div>

          {/* 4. Portfolio Projects Guides (Full Width) */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Code className="w-4 h-4 text-cyber-purple" />
              <h3 className="text-sm font-bold text-white font-display">Recommended Portfolio Projects</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysisResult.projects?.map((proj, idx) => (
                <div key={idx} className="bg-white/2 border border-white/5 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-cyber-pink rounded-full"></span>
                      {proj.title}
                    </h4>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed">{proj.desc}</p>
                  </div>
                  <div className="bg-white/3 border border-white/5 rounded p-2.5 text-[9.5px] text-slate-300 font-mono">
                    <span className="font-bold text-cyber-cyan block mb-1">Execution Steps:</span>
                    {proj.steps}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
