import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/common/Header.jsx';
import { AiAPI } from '../services/api';
import { 
  Terminal, 
  Send, 
  Map, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AiPlaygroundPage() {
  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  
  // Roadmap states
  const [targetRole, setTargetRole] = useState('DevOps Engineer');
  const [skillsText, setSkillsText] = useState('Linux, Scripting, Docker');
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);
  
  // Indicators
  const [chatLoading, setChatLoading] = useState(false);
  const [roadmapLoading, setRoadmapLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const loadChatHistory = async () => {
    try {
      const data = await AiAPI.getHistory();
      const formatted = [];
      data.forEach(item => {
        formatted.push({ sender: 'USER', content: item.prompt, timestamp: item.createdAt });
        formatted.push({ sender: 'AI', content: item.response, timestamp: item.createdAt });
      });
      setMessages(formatted);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || chatLoading) return;

    const userPrompt = inputText;
    setInputText('');
    setChatLoading(true);

    setMessages(prev => [...prev, { sender: 'USER', content: userPrompt, timestamp: new Date() }]);

    try {
      const result = await AiAPI.ask(userPrompt);
      setMessages(prev => [...prev, { sender: 'AI', content: result.response, timestamp: new Date() }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'SYSTEM', content: "Prompt submission failed. Please retry." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerateRoadmap = async (e) => {
    e.preventDefault();
    if (!targetRole.trim()) return;

    setRoadmapLoading(true);
    setGeneratedRoadmap(null);

    const skillsList = skillsText.split(',').map(s => s.trim());

    try {
      const data = await AiAPI.generateRoadmap(targetRole, skillsList);
      setGeneratedRoadmap(data);
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.75 }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setRoadmapLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="AI Sandbox" />

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Chat Console */}
        <div className="glass-panel rounded-2xl flex flex-col h-[70vh] overflow-hidden border border-white/5">
          <div className="px-6 py-4 bg-white/3 border-b border-white/5 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyber-purple" />
            <div>
              <h4 className="font-display font-bold text-white text-xs leading-none">Architect Chatbot Console</h4>
              <span className="text-[9px] text-slate-400">Ask about compilation logs, coding patterns, or system architectures</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            {messages.length === 0 && (
              <p className="text-[10px] text-slate-500 text-center py-10">
                Type a prompt below (e.g. \"How do I configure JWT CORS in Spring Boot?\") to begin.
              </p>
            )}
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`
                  flex flex-col max-w-[80%] rounded-2xl p-4 text-[10px] leading-relaxed
                  ${msg.sender === 'SYSTEM' 
                    ? 'self-center bg-red-500/10 border border-red-500/20 text-red-400 font-semibold'
                    : msg.sender === 'AI' 
                      ? 'self-start bg-white/5 border border-white/5 text-slate-100 rounded-tl-none' 
                      : 'self-end bg-gradient-to-tr from-cyber-purple/35 to-cyber-pink/25 border border-cyber-purple/20 text-white rounded-tr-none'
                  }
                `}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <span className="text-[8px] text-slate-500 self-end mt-1 font-medium">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {chatLoading && (
              <div className="self-start bg-white/3 border border-white/5 rounded-2xl rounded-tl-none p-4 text-[10px] text-slate-400 flex items-center gap-2 font-medium">
                <span className="animate-pulse">Analyzing prompt context...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendChat} className="p-4 bg-white/3 border-t border-white/5 flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask TechSetu AI..."
              className="flex-1 glass-input px-4 py-2.5 text-xs"
              disabled={chatLoading}
              required
            />
            <button
              type="submit"
              disabled={chatLoading || !inputText.trim()}
              className="p-3 rounded-xl bg-gradient-to-tr from-cyber-purple to-cyber-pink text-white shadow-glow-purple flex items-center justify-center disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Side: Career Roadmap Builder */}
        <div className="flex flex-col gap-6">
          
          <div className="glass-panel p-6 rounded-2xl text-left">
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
              <Map className="w-5 h-5 text-cyber-cyan" />
              <h4 className="font-display font-bold text-white text-xs">Build Custom Career Roadmap</h4>
            </div>

            <form onSubmit={handleGenerateRoadmap} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-semibold">Target Job Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="glass-input p-2.5 text-xs"
                  placeholder="e.g. Kubernetes Administrator"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-semibold">Your Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  className="glass-input p-2.5 text-xs"
                  placeholder="e.g. Java, Docker, Git"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={roadmapLoading}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-tr from-cyber-purple to-cyber-pink text-xs font-bold text-white shadow-sm flex items-center justify-center gap-2 hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                <span>{roadmapLoading ? 'Compiling Pathway...' : 'Generate AI Roadmap'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {generatedRoadmap && (
            <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col gap-4 max-h-[40vh] overflow-y-auto pr-1 text-left">
              <h5 className="font-display font-bold text-white text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyber-cyan" />
                <span>Custom Roadmaps: {targetRole}</span>
              </h5>
              
              <div className="flex flex-col gap-4 border-l border-white/5 pl-4 ml-2">
                {generatedRoadmap.map((m, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute left-[-21px] top-1 w-2.5 h-2.5 rounded-full bg-cyber-purple border border-cyber-purple/50 animate-pulse"></span>
                    <h6 className="text-xs font-bold text-white leading-none">{m.title}</h6>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{m.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {m.topics.split(',').map((topic, i) => (
                        <span key={i} className="text-[8px] text-slate-300 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                          {topic.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
