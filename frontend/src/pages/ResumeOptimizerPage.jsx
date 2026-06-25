import React, { useState } from 'react';
import Header from '../components/common/Header.jsx';
import { ResumeAPI } from '../services/api';
import { FileText, Award, AlertCircle, Printer, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ResumeOptimizerPage() {
  const [content, setContent] = useState(
    "JOHN DOE\n" +
    "john.doe@email.com | github.com/johndoe\n\n" +
    "SUMMARY\n" +
    "Detail-oriented software engineer with experience developing web applications using React and Node.js. Skilled in database queries and Git workflows.\n\n" +
    "EXPERIENCE\n" +
    "Software Developer - Techsetu Corp (2024 - Present)\n" +
    "- Worked on the frontend team to build responsive dashboards.\n" +
    "- Wrote backend REST API endpoints using Java.\n" +
    "- Optimized SQL queries to improve system performance."
  );

  const [loading, setLoading] = useState(false);
  const [scorecard, setScorecard] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await ResumeAPI.optimize(content);
      setScorecard(data);
      if (data.score >= 80) {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.8 }
        });
      }
    } catch (err) {
      setError("Failed to run resume review.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>TechSetu AI - Optimized Resume Export</title>
          <style>
            body { font-family: 'Georgia', 'Times New Roman', serif; padding: 40px; color: #333; line-height: 1.6; }
            h1 { font-family: 'Helvetica', sans-serif; text-align: center; margin-bottom: 5px; font-size: 24px; }
            p.contact { text-align: center; margin-top: 0; font-size: 13px; color: #666; margin-bottom: 25px; }
            h2 { font-family: 'Helvetica', sans-serif; border-bottom: 1px solid #ddd; padding-bottom: 5px; font-size: 16px; margin-top: 20px; color: #111; text-transform: uppercase; }
            pre { white-space: pre-wrap; font-family: inherit; font-size: 12px; }
          </style>
        </head>
        <body>
          <pre>${content}</pre>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen">
      <Header title="Resume Optimizer" />

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Markdown Editor */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyber-cyan" />
              <h3 className="font-display font-bold text-white text-sm">Resume Builder Content</h3>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white border border-white/5 px-2.5 py-1.5 rounded-lg hover:bg-white/5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 w-full bg-white/3 border border-white/5 rounded-xl p-4 text-xs font-mono text-slate-200 resize-none h-[60vh] focus:outline-none focus:border-cyber-purple/50"
            placeholder="Edit your resume structure here..."
          />

          <button
            onClick={handleAnalyze}
            disabled={loading || !content.trim()}
            className="py-3 px-6 rounded-xl bg-gradient-to-tr from-cyber-purple to-cyber-pink text-xs font-bold text-white shadow-glow-purple hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {loading ? 'Analyzing Content Flow...' : 'Assess Resume Structure'}
          </button>
        </div>

        {/* Right Side: Scorecard & Suggestions panel */}
        <div className="flex flex-col gap-6">
          
          {!scorecard && (
            <div className="glass-panel p-8 rounded-2xl flex-1 flex flex-col items-center justify-center text-center">
              <Award className="w-12 h-12 text-slate-500 mb-4" />
              <h4 className="font-display font-bold text-white text-sm mb-2">Structure Scorecard Ready</h4>
              <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                Provide your details on the left, then trigger assessment to examine contact details, metric inclusions, and action verbs.
              </p>
            </div>
          )}

          {scorecard && (
            <div className="flex flex-col gap-6 flex-1">
              
              {/* Score display card */}
              <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border-l-4 border-cyber-cyan bg-gradient-to-r from-cyber-cyan/10 to-transparent">
                <div>
                  <h4 className="font-display font-bold text-white text-base">Resume Quality Rating</h4>
                  <p className="text-slate-400 text-[10px] mt-1 leading-relaxed">
                    {scorecard.generalAdvice}
                  </p>
                </div>
                
                <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.03)" strokeWidth="5" fill="transparent" />
                    <circle cx="40" cy="40" r="32" stroke="#00f2fe" strokeWidth="5" fill="transparent"
                      strokeDasharray={201}
                      strokeDashoffset={201 - (201 * scorecard.score) / 100}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <span className="absolute text-sm font-extrabold text-white">{scorecard.score}%</span>
                </div>
              </div>

              {/* Strengths card */}
              {scorecard.strengths.length > 0 && (
                <div className="glass-panel p-6 rounded-2xl">
                  <h5 className="font-display font-bold text-white text-xs mb-3 flex items-center gap-1.5">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                    <span>Identified Strengths ({scorecard.strengths.length})</span>
                  </h5>
                  <div className="flex flex-col gap-2.5">
                    {scorecard.strengths.map((str, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-emerald-400 font-bold mt-0.5">•</span>
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements checklist */}
              {scorecard.improvements.length > 0 && (
                <div className="glass-panel p-6 rounded-2xl border-t-4 border-red-500/20">
                  <h5 className="font-display font-bold text-white text-xs mb-3 flex items-center gap-1.5">
                    <AlertCircle className="w-4.5 h-4.5 text-red-400" />
                    <span>Recommended Gaps to Fix ({scorecard.improvements.length})</span>
                  </h5>
                  <div className="flex flex-col gap-2.5">
                    {scorecard.improvements.map((imp, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-red-400 font-bold mt-0.5">•</span>
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
