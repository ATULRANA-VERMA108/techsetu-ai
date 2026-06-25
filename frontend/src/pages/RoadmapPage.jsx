import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header.jsx';
import { RoadmapAPI } from '../services/api';
import { Map, BookOpen, CheckCircle2, Lock, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState(null);

  const [activeResources, setActiveResources] = useState(null);

  const loadRoadmap = async () => {
    try {
      const data = await RoadmapAPI.getActive();
      if (data && !data.message) {
        setRoadmap(data);
      }
    } catch (e) {
      setError("Failed to load active roadmap");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, []);

  const handleOpenQuiz = (milestone) => {
    if (!milestone.quizUnlocked) return;
    setActiveQuiz(milestone.quiz);
    setSelectedAnswers({});
    setQuizFeedback(null);
  };

  const handleSelectAnswer = (qIdx, choiceIdx) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [qIdx]: choiceIdx
    }));
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!activeQuiz) return;

    // Verify all questions are answered
    const answersList = [];
    for (let i = 0; i < activeQuiz.questions.length; i++) {
      if (selectedAnswers[i] === undefined) {
        setQuizFeedback({ type: 'error', message: "Please answer all questions before submitting." });
        return;
      }
      answersList.push(selectedAnswers[i]);
    }

    setQuizLoading(true);
    setQuizFeedback(null);

    try {
      const result = await RoadmapAPI.submitQuiz(activeQuiz.id, answersList);
      if (result.passed) {
        setQuizFeedback({
          type: 'success',
          message: `Congratulations! You passed. Correct answers: ${result.correctCount}/${result.totalQuestions}`
        });
        
        // Confetti!
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });

        // Refresh roadmap states
        setTimeout(() => {
          setActiveQuiz(null);
          loadRoadmap();
        }, 2000);
      } else {
        setQuizFeedback({
          type: 'error',
          message: `Incorrect score. Correct answers: ${result.correctCount}/${result.totalQuestions}. Please review and try again.`
        });
      }
    } catch (err) {
      setQuizFeedback({ type: 'error', message: "Failed to grade the assessment." });
    } finally {
      setQuizLoading(false);
    }
  };

  const handleMarkComplete = async (milestoneId) => {
    try {
      await RoadmapAPI.completeMilestone(milestoneId);
      loadRoadmap();
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.8 }
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Learning Roadmap" />
        <div className="text-center mt-20 text-slate-400">Loading custom roadmap...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Learning Roadmap" />

      <div className="mt-4">
        
        {!roadmap && (
          <div className="glass-panel p-8 rounded-2xl max-w-xl text-center">
            <Map className="w-12 h-12 text-cyber-purple mx-auto mb-4" />
            <h3 className="font-display font-bold text-white text-lg mb-2">No Active Roadmap Found</h3>
            <p className="text-slate-400 text-sm mb-6">
              Please analyze your profile qualifications first. TechSetu AI compiles a learning timeline based on your gaps.
            </p>
            <Link
              to="/analyzer"
              className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-pink font-bold text-xs text-white shadow-glow-purple"
            >
              <span>Go to Skill Analyzer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {roadmap && (
          <div className="max-w-4xl">
            {/* Header info */}
            <div className="glass-panel p-6 rounded-2xl border-l-4 border-cyber-purple mb-8">
              <h3 className="font-display font-bold text-lg text-white">
                {roadmap.targetRole} Learning Roadmap
              </h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                {roadmap.description}
              </p>
            </div>

            {/* Vertical Milestones Timeline */}
            <div className="relative border-l-2 border-white/5 pl-8 ml-4 flex flex-col gap-8">
              {roadmap.milestones.map((m, idx) => (
                <div key={m.title} className="relative">
                  
                  {/* Timeline bullet indicators */}
                  <span className={`
                    absolute left-[-41px] top-1 w-6 h-6 rounded-full flex items-center justify-center border
                    ${m.completed 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                      : m.quizUnlocked 
                        ? 'bg-cyber-purple/20 border-cyber-purple text-cyber-purple animate-pulse' 
                        : 'bg-[#03001e] border-white/10 text-slate-500'
                    }
                  `}>
                    {m.completed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : m.quizUnlocked ? (
                      <BookOpen className="w-3.5 h-3.5" />
                    ) : (
                      <Lock className="w-3 h-3" />
                    )}
                  </span>

                  {/* Milestone Card box */}
                  <div className={`
                    glass-panel p-6 rounded-2xl border transition-all duration-300
                    ${!m.quizUnlocked ? 'opacity-50 select-none' : 'hover:border-white/10'}
                  `}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <h4 className="font-display font-bold text-white text-base leading-tight">
                          {m.title}
                        </h4>
                        <span className="text-[10px] text-cyber-cyan font-semibold uppercase tracking-wider block mt-1">
                          Duration: {m.durationHours} Hours
                        </span>
                      </div>
                      
                      {/* Action buttons */}
                      {m.quizUnlocked && (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setActiveResources(m.title)}
                            className="px-3.5 py-1.5 rounded-lg bg-white/5 text-[10px] text-slate-300 font-bold hover:bg-white/10 hover:text-white"
                          >
                            Study Guides
                          </button>
                          {m.quiz && !m.completed && (
                            <button
                              onClick={() => handleOpenQuiz(m)}
                              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyber-purple to-cyber-pink text-[10px] text-white font-bold shadow-sm"
                            >
                              Gate Quiz
                            </button>
                          )}
                          {!m.quiz && !m.completed && (
                            <button
                              onClick={() => handleMarkComplete(m.id)}
                              className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-400 font-bold"
                            >
                              Check Off
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {m.description}
                    </p>

                    {/* Topics tagging */}
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Key Topics:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {m.topics.split(',').map((topic, i) => (
                          <span key={i} className="text-[10px] text-slate-400 bg-white/3 border border-white/5 px-2.5 py-1 rounded-md">
                            {topic.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* Quiz Modal popup */}
      {activeQuiz && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="max-w-lg w-full glass-panel p-6 rounded-2xl relative max-h-[85vh] overflow-y-auto">
            
            <button
              onClick={() => setActiveQuiz(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-lg text-white mb-2">
              {activeQuiz.title}
            </h3>
            <p className="text-slate-400 text-xs mb-6">
              Complete this gate assessment correctly to certify this milestone.
            </p>

            {quizFeedback && (
              <div className={`
                p-3 rounded-lg text-xs mb-6 font-medium text-center border
                ${quizFeedback.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
                }
              `}>
                {quizFeedback.message}
              </div>
            )}

            <form onSubmit={handleQuizSubmit} className="flex flex-col gap-6">
              
              {activeQuiz.questions.map((q, qIdx) => (
                <div key={qIdx} className="flex flex-col gap-2">
                  <p className="text-xs font-semibold text-white">
                    {qIdx + 1}. {q.text}
                  </p>
                  <div className="flex flex-col gap-2">
                    {q.choices.map((choice, choiceIdx) => (
                      <label
                        key={choiceIdx}
                        className={`
                          flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all
                          ${selectedAnswers[qIdx] === choiceIdx 
                            ? 'bg-cyber-purple/20 border-cyber-purple text-white' 
                            : 'bg-white/3 border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name={`q-${qIdx}`}
                          checked={selectedAnswers[qIdx] === choiceIdx}
                          onChange={() => handleSelectAnswer(qIdx, choiceIdx)}
                          className="hidden"
                        />
                        <span>{choice}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={quizLoading}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-pink text-xs font-bold text-white shadow-glow-purple flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
              >
                <span>{quizLoading ? 'Submitting Answers...' : 'Verify Assessment'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

          </div>
        </div>
      )}

      {/* Resource Modal popup */}
      {activeResources && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="max-w-md w-full glass-panel p-6 rounded-2xl relative">
            <button onClick={() => setActiveResources(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display font-bold text-white text-base mb-4">Study Resource Links</h3>
            <p className="text-slate-400 text-xs mb-6">
              Use these curated, high-quality free channels to study details for <span className="text-cyber-cyan">{activeResources}</span>.
            </p>
            <div className="flex flex-col gap-3">
              <a href="https://www.freecodecamp.org/" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-white/3 border border-white/5 rounded-xl text-xs text-white hover:bg-white/5 transition-all">
                <span>FreeCodeCamp Interactive Paths</span>
                <ArrowRight className="w-4 h-4 text-cyber-cyan" />
              </a>
              <a href="https://developer.mozilla.org/" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-white/3 border border-white/5 rounded-xl text-xs text-white hover:bg-white/5 transition-all">
                <span>MDN Web Docs References</span>
                <ArrowRight className="w-4 h-4 text-cyber-cyan" />
              </a>
              <a href="https://spring.io/guides" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-white/3 border border-white/5 rounded-xl text-xs text-white hover:bg-white/5 transition-all">
                <span>Official Spring Guides (Backend)</span>
                <ArrowRight className="w-4 h-4 text-cyber-cyan" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
