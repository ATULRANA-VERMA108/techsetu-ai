import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Header from '../components/common/Header.jsx';
import { InterviewAPI } from '../services/api';
import { 
  MessageSquareCode, 
  Send, 
  Mic, 
  Settings, 
  StopCircle,
  History,
  Calendar,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function MockInterviewPage() {
  const { user } = useSelector(state => state.auth);
  
  // Setup State
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Frontend Developer');
  const [interviewType, setInterviewType] = useState('TECHNICAL');
  const [language, setLanguage] = useState('HINGLISH');
  
  // Active Session State
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  
  // States
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [ending, setEnding] = useState(false);
  
  // Past History state
  const [history, setHistory] = useState([]);
  const [selectedPastSession, setSelectedPastSession] = useState(null);

  const messagesEndRef = useRef(null);

  const loadHistory = async () => {
    try {
      const data = await InterviewAPI.getHistory();
      setHistory(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    // Smooth scroll chat area to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStart = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await InterviewAPI.start(targetRole, interviewType, language);
      setSession(data.session);
      setMessages([data.welcomeMessage]);
    } catch (err) {
      console.error("Failed to start session", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !session || sending) return;

    const candidateMsg = inputText;
    setInputText('');
    setSending(true);

    // Append user message locally
    const userMsgLocal = { id: "temp-user-" + Date.now(), sender: "USER", content: candidateMsg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsgLocal]);

    try {
      const aiReply = await InterviewAPI.sendMessage(session.id, candidateMsg);
      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      console.error("Failed to send message", err);
      setMessages(prev => [...prev, { 
        id: "error-" + Date.now(), 
        sender: "SYSTEM", 
        content: "Message transmission failed. Please retry." 
      }]);
    } finally {
      setSending(false);
    }
  };

  const handleEnd = async () => {
    if (!session || ending) return;
    setEnding(true);
    try {
      const updatedSession = await InterviewAPI.end(session.id);
      setSession(updatedSession);
      loadHistory();
    } catch (err) {
      console.error("Failed to end session", err);
    } finally {
      setEnding(false);
    }
  };

  const handleViewPastSession = async (pastSession) => {
    setSelectedPastSession(pastSession);
    try {
      const pastMessages = await InterviewAPI.getMessages(pastSession.id);
      setMessages(pastMessages);
    } catch (e) {
      console.error("Failed to fetch past session logs", e);
    }
  };

  const handleClosePastSessionView = () => {
    setSelectedPastSession(null);
    setMessages([]);
  };

  return (
    <div className="min-h-screen">
      <Header title="Mock Interviewer" />

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Columns (3 cols): Primary Interview Sandbox Console */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* 1. SETUP STATE VIEW */}
          {!session && !selectedPastSession && (
            <div className="glass-panel p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquareCode className="w-6 h-6 text-cyber-purple" />
                <h3 className="font-display font-bold text-lg text-white">Start a New Mock Assessment</h3>
              </div>

              <form onSubmit={handleStart} className="flex flex-col gap-5 max-w-xl">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">Target Role</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="glass-input p-3 text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">Interview Focus</label>
                    <select
                      value={interviewType}
                      onChange={(e) => setInterviewType(e.target.value)}
                      className="glass-input p-3 text-sm bg-cyber-deep"
                    >
                      <option value="TECHNICAL">Technical Architecture</option>
                      <option value="HR">HR & Cultural Fit</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">Interview Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="glass-input p-3 text-sm bg-cyber-deep"
                    >
                      <option value="HINGLISH">Hinglish (Hindi + English)</option>
                      <option value="ENGLISH">English</option>
                      <option value="HINDI">Hindi (हिंदी)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-pink font-bold text-sm text-white shadow-glow-purple flex items-center justify-center gap-2 hover:scale-[1.02] transition-all mt-4 disabled:opacity-50"
                >
                  <span>{loading ? 'Entering Sandbox...' : 'Begin Mock Interview'}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>

              </form>
            </div>
          )}

          {/* 2. ACTIVE CHAT CONSOLE VIEW */}
          {(session?.active || (selectedPastSession && messages.length > 0)) && (
            <div className="glass-panel rounded-2xl flex flex-col h-[70vh] overflow-hidden border border-white/5">
              
              {/* Active Chat Header */}
              <div className="px-6 py-4 bg-white/3 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-white text-sm">
                    {selectedPastSession ? `Session Log: ${selectedPastSession.targetRole}` : `Active Assessment: ${session.targetRole}`}
                  </h4>
                  <span className="text-[10px] text-cyber-cyan uppercase font-semibold">
                    {selectedPastSession ? selectedPastSession.interviewType : session.interviewType} Focus • {selectedPastSession ? selectedPastSession.language : session.language}
                  </span>
                </div>
                
                {session?.active && !selectedPastSession && (
                  <button
                    onClick={handleEnd}
                    disabled={ending}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <StopCircle className="w-4 h-4" />
                    <span>{ending ? 'Grading...' : 'End & Generate Feedback'}</span>
                  </button>
                )}

                {selectedPastSession && (
                  <button
                    onClick={handleClosePastSessionView}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Close Log
                  </button>
                )}
              </div>

              {/* Chat Message Scroll area */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {messages.map((msg, i) => {
                  const isAi = msg.sender === 'AI';
                  const isSystem = msg.sender === 'SYSTEM';
                  return (
                    <div 
                      key={i} 
                      className={`
                        flex flex-col max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed
                        ${isSystem 
                          ? 'self-center bg-red-500/10 border border-red-500/20 text-red-400 font-semibold'
                          : isAi 
                            ? 'self-start bg-white/5 border border-white/5 text-slate-100 rounded-tl-none' 
                            : 'self-end bg-gradient-to-tr from-cyber-purple/35 to-cyber-pink/25 border border-cyber-purple/20 text-white rounded-tr-none'
                        }
                      `}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <span className="text-[9px] text-slate-500 self-end mt-1 font-medium">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                {sending && (
                  <div className="self-start bg-white/3 border border-white/5 rounded-2xl rounded-tl-none p-4 text-xs text-slate-400 flex items-center gap-2 font-medium">
                    <span className="animate-pulse">TechSetu AI is analyzing your response...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input form */}
              {session?.active && !selectedPastSession && (
                <form onSubmit={handleSend} className="p-4 bg-white/3 border-t border-white/5 flex gap-3">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your response here..."
                    className="flex-1 glass-input px-4 py-3 text-xs"
                    disabled={sending}
                    required
                  />
                  <button
                    type="submit"
                    disabled={sending || !inputText.trim()}
                    className="p-3.5 rounded-xl bg-gradient-to-tr from-cyber-purple to-cyber-pink text-white shadow-glow-purple hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}

            </div>
          )}

          {/* 3. EVALUATION SUMMARY STATE VIEW */}
          {session && !session.active && !selectedPastSession && (
            <div className="glass-panel p-8 rounded-2xl border-l-4 border-emerald-500">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
                <h3 className="font-display font-bold text-lg text-white">Interview Assessment Scorecard</h3>
              </div>
              
              <div className="prose prose-invert text-xs text-slate-300 leading-relaxed mb-8 max-w-none bg-white/3 border border-white/5 p-6 rounded-xl">
                {session.feedbackSummary ? (
                  <div className="whitespace-pre-wrap">{session.feedbackSummary}</div>
                ) : (
                  <p>Grading summary is empty. Please run a new assessment.</p>
                )}
              </div>

              <button
                onClick={() => setSession(null)}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-pink font-bold text-xs text-white shadow-glow-purple"
              >
                Start New Session
              </button>
            </div>
          )}

        </div>

        {/* Right Column (1 col): Historic sessions records panel */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
              <History className="w-4 h-4 text-cyber-cyan" />
              <h4 className="font-display font-bold text-white text-sm">Past Assessments</h4>
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No past sessions found.</p>
            ) : (
              <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
                {history.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => handleViewPastSession(h)}
                    className={`
                      w-full p-3 rounded-xl border text-left hover:bg-white/5 transition-all
                      ${selectedPastSession?.id === h.id 
                        ? 'bg-cyber-purple/10 border-cyber-purple' 
                        : 'bg-white/3 border-white/5'
                      }
                    `}
                  >
                    <p className="text-xs font-semibold text-white truncate">{h.targetRole}</p>
                    <span className="text-[9px] text-slate-400 block mt-1 uppercase font-bold">
                      {h.interviewType} • {h.language}
                    </span>
                    <span className="text-[9px] text-slate-500 flex items-center gap-1 mt-1 font-medium">
                      <Calendar className="w-3 h-3" />
                      {new Date(h.createdAt).toLocaleDateString()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
