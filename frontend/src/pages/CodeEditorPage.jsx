import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { incrementSolvedCount } from '../redux/slices/authSlice';
import Header from '../components/common/Header.jsx';
import { QuestionAPI } from '../services/api';
import { 
  Terminal, 
  Play, 
  FileCode, 
  Sparkles, 
  HelpCircle, 
  Compass, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Youtube,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DSA_TOPICS } from '../data/dsaData.js';

const QUESTIONS = {
  "two-sum": {
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    inputFormat: "nums = [2,7,11,15], target = 9",
    outputFormat: "[0,1]",
    explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    youtube: "https://youtu.be/KLlXCFG5jxg",
    blog: "https://www.geeksforgeeks.org/two-sum-problem-using-hashing/",
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your C++ code here
        
    }
};`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your Java code here
        
    }
}`,
    python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your Python code here
        `,
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your JavaScript code here
    
};`
  },
  "contains-duplicate": {
    title: "Contains Duplicate",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    description: "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
    inputFormat: "nums = [1,2,3,1]",
    outputFormat: "true",
    explanation: "The element 1 occurs at index 0 and index 3.",
    youtube: "https://youtu.be/3OamzN90ipg",
    blog: "https://www.geeksforgeeks.org/check-if-array-contains-duplicates-in-linear-time/",
    cpp: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        // Write your C++ code here
        
    }
};`,
    java: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        // Write your Java code here
        
    }
}`,
    python: `class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        # Write your Python code here
        `,
    javascript: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function(nums) {
    // Write your JavaScript code here
    
};`
  },
  "design-rate-limiter": {
    title: "Design a Rate Limiter",
    difficulty: "Medium",
    category: "System Design",
    description: "Design a software rate limiter to restrict incoming API request counts. Support standard sliding window, token bucket, or leaking bucket algorithms. Detail the implementation patterns, concurrency mechanisms, and cache layouts.",
    inputFormat: "Capacity = 5 requests, Window = 1 minute",
    outputFormat: "Structured design specifications and components diagram",
    explanation: "Requests above 5 requests per minute should be rejected with HTTP 429.",
    youtube: "https://youtu.be/mzwK4sN5Uoc",
    blog: "https://www.geeksforgeeks.org/design-api-rate-limiter/",
    cpp: `// Write your System Design Architecture & code here
// Detail key components: Memory Stores (Redis), Algorithms, Token Buckets
`,
    java: `// Write your System Design Architecture & code here
// Detail key components: Memory Stores (Redis), Algorithms, Token Buckets
`,
    python: `# Write your System Design Architecture & code here
# Detail key components: Memory Stores (Redis), Algorithms, Token Buckets
`,
    javascript: `// Write your System Design Architecture & code here
// Detail key components: Memory Stores (Redis), Algorithms, Token Buckets
`
  }
};

const STARTER_FALLBACKS = {
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write code\n    return 0;\n}`,
  java: `public class Main {\n    public static void main(String[] args) {\n        // Write code\n    }\n}`,
  python: `def main():\n    # Write code\n    pass\n\nif __name__ == '__main__':\n    main()`,
  javascript: `console.log("Write JavaScript code");`
};

export default function CodeEditorPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useSelector(state => state.auth);

  // Question metadata
  const questionId = searchParams.get('question') || 'two-sum';
  
  const formatTitle = (id) => {
    return id
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getDynamicMeta = (id) => {
    if (QUESTIONS[id]) return QUESTIONS[id];
    
    let matchedProblem = null;
    let matchedCategory = "General Algorithms";
    
    for (const phase of DSA_TOPICS) {
      const match = phase.problems.find(p => p.path === id || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id);
      if (match) {
        matchedProblem = match;
        matchedCategory = phase.title;
        break;
      }
    }
    
    if (matchedProblem) {
      return {
        title: matchedProblem.name,
        difficulty: matchedProblem.difficulty,
        category: matchedCategory,
        description: `Optimize your solution for "${matchedProblem.name}". Complete the starter code in the editor pane, run virtual test cases to verify logic correctness, or select 'Learn Mode' to view AI recommendations and official briefings.`,
        inputFormat: "Virtual automated problem input tests.",
        outputFormat: "Optimal return parameters.",
        explanation: `Requires optimal solution with linear/logarithmic complexities mapping to the patterns of ${matchedCategory}.`,
        youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(matchedProblem.name + ' SDE solution')}`,
        blog: matchedProblem.conceptUrl || `https://www.geeksforgeeks.org/search/${encodeURIComponent(matchedProblem.name)}`,
        cpp: `// Starter template for ${matchedProblem.name}\n#include <bits/stdc++.h>\nusing namespace std;\n\n// Write your solution here\n`,
        java: `// Starter template for ${matchedProblem.name}\nimport java.util.*;\n\n// Write your solution here\n`,
        python: `# Starter template for ${matchedProblem.name}\n# Write your solution here\n`,
        javascript: `// Starter template for ${matchedProblem.name}\n// Write your solution here\n`
      };
    }
    
    return QUESTIONS["two-sum"];
  };

  const qMeta = getDynamicMeta(questionId);

  // Workspace configuration
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [mode, setMode] = useState('practice'); // practice vs learn
  
  // Execution statuses
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const [passed, setPassed] = useState(null);
  
  // AI Concept explanation status
  const [explaining, setExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState(null);

  // Load starter code on changes
  useEffect(() => {
    if (qMeta) {
      setCode(qMeta[language] || STARTER_FALLBACKS[language] || '');
      setOutput(null);
      setPassed(null);
      setAiExplanation(null); // Reset explanation when question changes
    }
  }, [questionId, language]);

  // Load AI concept on mode switch
  useEffect(() => {
    if (mode === 'learn' && !aiExplanation) {
      fetchConcept();
    }
  }, [mode, questionId, aiExplanation]);

  const fetchConcept = async () => {
    setExplaining(true);
    try {
      const res = await QuestionAPI.explain(questionId);
      setAiExplanation(res.explanation);
    } catch (e) {
      console.error(e);
      setAiExplanation("AI explanation failed to load. Focus on using standard hash mappings or sorting boundaries.");
    } finally {
      setExplaining(false);
    }
  };

  const handleRunCode = async (e) => {
    e.preventDefault();
    if (!code.trim() || running) return;

    setRunning(true);
    setOutput("Compiling code and executing virtual test cases...");
    setPassed(null);

    try {
      const res = await QuestionAPI.submit(questionId, language, code);
      setPassed(res.passed);
      setOutput(res.stdout);
      
      if (res.passed) {
        confetti({
          particleCount: 50,
          spread: 45,
          origin: { y: 0.8 }
        });
        // Dispatch solved counts inside Redux & local storage
        dispatch(incrementSolvedCount());
      }
    } catch (err) {
      setPassed(false);
      setOutput(err.message || "Compilation failed.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title={`Coding Sandbox: ${qMeta.title}`} />

      {/* Grid container split layout */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Panel: Question specifications & Learn resource sheets (5 spans) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col overflow-hidden text-left min-h-[60vh] max-h-[75vh]">
            
            {/* Practice vs Learn tabs */}
            <div className="flex border-b border-white/5 pb-3 mb-4 justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-cyber-cyan tracking-wider bg-cyber-cyan/10 px-2.5 py-0.5 rounded border border-cyber-cyan/20">
                {qMeta.category}
              </span>
              <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl">
                <button
                  onClick={() => setMode('practice')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                    mode === 'practice' 
                      ? 'bg-gradient-to-r from-cyber-purple to-cyber-pink text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Practice Mode
                </button>
                <button
                  onClick={() => setMode('learn')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                    mode === 'learn' 
                      ? 'bg-gradient-to-r from-cyber-purple to-cyber-pink text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Learn Mode
                </button>
              </div>
            </div>

            {/* Panel details depending on active mode */}
            {mode === 'practice' ? (
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
                <div>
                  <h3 className="font-display font-extrabold text-base text-white">{qMeta.title}</h3>
                  <span className={`text-[9px] font-bold uppercase mt-1 inline-block ${
                    qMeta.difficulty === 'Easy' ? 'text-emerald-400' : qMeta.difficulty === 'Medium' ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {qMeta.difficulty}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {qMeta.description}
                </p>

                <div className="flex flex-col gap-3 mt-2 border-t border-white/5 pt-4">
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Example test case</h4>
                  <div className="p-3.5 bg-cyber-deep/80 border border-white/5 rounded-xl font-mono text-[10px] text-slate-300">
                    <p className="font-bold text-cyber-cyan">// Input</p>
                    <p className="mt-0.5">{qMeta.inputFormat}</p>
                    <p className="font-bold text-cyber-pink mt-2.5">// Output</p>
                    <p className="mt-0.5">{qMeta.outputFormat}</p>
                    {qMeta.explanation && (
                      <>
                        <p className="font-bold text-slate-500 mt-2.5">// Explanation</p>
                        <p className="mt-0.5 leading-relaxed text-slate-400">{qMeta.explanation}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-5">
                
                {/* Learn Mode: AI Concept understanding */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyber-pink" />
                    <span>AI Concept breakdown</span>
                  </h4>
                  {explaining ? (
                    <p className="text-xs text-slate-500 font-medium py-4">Querying TechSetu AI helper for learning assets...</p>
                  ) : (
                    <div className="p-4 bg-white/3 border border-white/5 rounded-xl text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {aiExplanation}
                    </div>
                  )}
                </div>

                {/* External resources for solving */}
                <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-cyber-cyan" />
                    <span>Reference resources</span>
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <a
                      href={qMeta.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-3 bg-red-500/5 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all group"
                    >
                      <Youtube className="w-4 h-4 text-red-500" />
                      <div className="text-[9px] font-bold text-slate-300 group-hover:text-red-400">
                        Video Solution
                      </div>
                    </a>
                    
                    <a
                      href={qMeta.blog}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-3 bg-cyber-pink/5 border border-cyber-pink/20 hover:border-cyber-pink/40 rounded-xl transition-all group"
                    >
                      <BookOpen className="w-4 h-4 text-cyber-pink" />
                      <div className="text-[9px] font-bold text-slate-300 group-hover:text-cyber-pink">
                        Articles / Blogs
                      </div>
                    </a>
                  </div>
                </div>

              </div>
            )}

            <button 
              onClick={() => navigate('/dsa')}
              className="mt-4 pt-4 border-t border-white/5 text-[10px] font-bold text-slate-500 hover:text-white flex items-center gap-1"
            >
              ← Back to DSA Curriculum
            </button>
          </div>
        </div>

        {/* Right Panel: Workspace code editor area (7 spans) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col gap-4">
            
            {/* Editor toolbar */}
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-cyber-purple" />
                <span className="text-xs font-bold text-white">Source Editor</span>
              </div>

              {/* Language selection dropdown */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-semibold text-white focus:outline-none"
              >
                <option value="cpp" className="bg-[#03001e] text-white">C++</option>
                <option value="java" className="bg-[#03001e] text-white">Java</option>
                <option value="python" className="bg-[#03001e] text-white">Python</option>
                <option value="javascript" className="bg-[#03001e] text-white">JavaScript</option>
              </select>
            </div>

            {/* Code Textarea editor */}
            <div className="flex-1 min-h-[30vh]">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full p-4 bg-cyber-deep/60 border border-white/5 rounded-xl font-mono text-[11px] text-slate-200 focus:outline-none resize-none leading-relaxed min-h-[35vh]"
                style={{ tabSize: 4 }}
              />
            </div>

            {/* Terminal output box */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" />
                  <span>Compiler console</span>
                </span>
                
                {passed !== null && (
                  <div className={`flex items-center gap-1 text-[10px] font-bold ${
                    passed ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {passed ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>All Cases Passed</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Compilation Failed</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <pre className={`p-4 rounded-xl font-mono text-[10px] overflow-x-auto text-left leading-normal max-h-32 border ${
                passed === null 
                  ? 'bg-cyber-deep/80 border-white/5 text-slate-400'
                  : passed 
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/5 border-red-500/20 text-red-400'
              }`}>
                <code>{output || "Console idle. Press Run Code to evaluate."}</code>
              </pre>
            </div>

            {/* Compile Run button */}
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={handleRunCode}
                disabled={running || !code.trim()}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-pink text-xs font-bold text-white shadow-glow-purple disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{running ? 'Running compiler sandbox...' : 'Run Code'}</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
