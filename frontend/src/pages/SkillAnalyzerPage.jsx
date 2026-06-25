import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header.jsx';
import { SkillsAPI, RoadmapAPI } from '../services/api';
import { updateProfile } from '../redux/slices/authSlice';
import { Compass, AlertCircle, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SkillAnalyzerPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Frontend Developer');
  const [customRole, setCustomRole] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);

  const rolesList = ['Frontend Developer', 'Backend Developer', 'Data Analyst', 'UX Designer', 'Mobile Developer', 'Custom'];

  const handleAnalyze = async (e) => {
    e.preventDefault();
    const finalRole = targetRole === 'Custom' ? customRole : targetRole;
    if (!finalRole || !resumeText.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await SkillsAPI.analyze(finalRole, resumeText);
      setResult(data);
      
      // Update store state in real time
      dispatch(updateProfile({
        targetRole: finalRole,
        bridgeScore: data.bridgeScore
      }));

      // Trigger celebration confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.75 }
      });
    } catch (err) {
      setError(err.message || 'Error occurred during gap analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!result) return;
    setGeneratingRoadmap(true);
    try {
      const finalRole = targetRole === 'Custom' ? customRole : targetRole;
      await RoadmapAPI.generate(finalRole, result.missingSkills);
      navigate('/roadmap');
    } catch (e) {
      console.error(e);
      setError("Failed to generate learning roadmap.");
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="Skill Gap Analyzer" />

      <div className="mt-4 flex flex-col gap-8">
        
        {/* Input Form card */}
        {!result && (
          <div className="glass-panel p-8 rounded-2xl max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Compass className="w-6 h-6 text-cyber-cyan" />
              <h3 className="font-display font-bold text-lg text-white">Compare Profile to Target Standards</h3>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 text-xs mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleAnalyze} className="flex flex-col gap-6">
              
              {/* Role Select */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400">Target Role</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {rolesList.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setTargetRole(role)}
                      className={`
                        py-3 px-4 rounded-xl text-xs font-bold border transition-all text-center
                        ${targetRole === role 
                          ? 'bg-gradient-to-r from-cyber-purple/20 to-cyber-pink/20 border-cyber-purple text-white shadow-sm'
                          : 'bg-white/3 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {targetRole === 'Custom' && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-400">Custom Target Role Title</label>
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="glass-input p-3 text-sm"
                    placeholder="e.g. DevOps Engineer, Machine Learning Engineer"
                    required
                  />
                </div>
              )}

              {/* Resume Paste */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400">
                  Paste Resume Content (or write your core programming/technical skills)
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={8}
                  className="glass-input p-4 text-sm resize-none"
                  placeholder="Paste your qualifications, skills, and summary description..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-pink text-sm font-bold text-white shadow-glow-purple self-start flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <span>{loading ? 'Analyzing Gap Dynamics...' : 'Run Gap Analysis'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          </div>
        )}

        {/* Results Dashboard output card */}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Side: Score & AI Advice details */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              {/* Gap analysis scorecard */}
              <div className="glass-panel p-8 rounded-2xl relative overflow-hidden bg-gradient-to-r from-cyber-cyan/10 to-transparent border-l-4 border-cyber-cyan">
                <h3 className="font-display font-bold text-xl text-white mb-2">Bridge Profile Analyzed</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {result.summary}
                </p>
                <button
                  onClick={handleGenerateRoadmap}
                  disabled={generatingRoadmap}
                  className="flex items-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-pink text-xs font-bold text-white shadow-glow-purple hover:translate-y-[-2px] transition-all disabled:opacity-50"
                >
                  <span>{generatingRoadmap ? 'Assembling Timelines...' : 'Build Custom Learning Roadmap'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Skills breakdown section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                
                {/* Missing Skills list */}
                <div className="glass-panel p-6 rounded-2xl border-t-4 border-red-500/30">
                  <div className="flex items-center gap-2 text-red-400 mb-4 font-display font-bold text-sm">
                    <XCircle className="w-5 h-5" />
                    <span>Skills to Bridge ({result.missingSkills.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.missingSkills.map((skill, idx) => (
                      <span key={idx} className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-1.5 rounded-lg font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Acquired Skills list */}
                <div className="glass-panel p-6 rounded-2xl border-t-4 border-emerald-500/30">
                  <div className="flex items-center gap-2 text-emerald-400 mb-4 font-display font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Acquired Strengths ({result.acquiredSkills.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.acquiredSkills.map((skill, idx) => (
                      <span key={idx} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1.5 rounded-lg font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Right Side: Score ring & Gauge */}
            <div className="flex flex-col gap-8">
              
              <div className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center justify-center">
                <h4 className="font-display font-bold text-white mb-6">Computed Bridge Score</h4>
                
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="65" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                    <circle cx="80" cy="80" r="65" stroke="#00f2fe" strokeWidth="8" fill="transparent"
                      strokeDasharray={408}
                      strokeDashoffset={408 - (408 * result.bridgeScore) / 100}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-white">{result.bridgeScore}%</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Ready</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-6 text-xs text-cyber-cyan font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Aligned to Junior/Mid Benchmarks</span>
                </div>

                <button
                  onClick={() => setResult(null)}
                  className="text-xs text-slate-400 hover:text-white mt-8 hover:underline"
                >
                  Re-run with new parameters
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
