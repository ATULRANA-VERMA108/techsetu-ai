import React, { useState, useEffect } from 'react';
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
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

const DSA_SHEETS = [
  { name: "Striver's SDE Sheet", description: "Top 180+ interview questions curated for FAANG", url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/" },
  { name: "NeetCode 150", description: "Structured sequence from easy to hard topics", url: "https://neetcode.io/practice" },
  { name: "Love Babbar 450", description: "Comprehensive coverage of basic to advanced DSA", url: "https://www.geeksforgeeks.org/luthra-450-dsa-sheet-love-babbar/" }
];

const PLATFORMS = [
  { name: "LeetCode", url: "https://leetcode.com", desc: "Best for standard interview questions and study plans", color: "from-[#FFA116]/20 to-[#FFA116]/5", textColor: "text-[#FFA116]" },
  { name: "Codeforces", url: "https://codeforces.com", desc: "Excellent for speed, mathematical algorithms and contests", color: "from-[#3182CE]/20 to-[#3182CE]/5", textColor: "text-[#3182CE]" },
  { name: "CodeChef", url: "https://codechef.com", desc: "Monthly division-based contests and topic-wise practice", color: "from-[#5B4636]/20 to-[#5B4636]/5", textColor: "text-[#B97A57]" },
  { name: "GeeksforGeeks", url: "https://geeksforgeeks.org", desc: "Rich articles, topic-wise sheets and code explanations", color: "from-[#2F855A]/20 to-[#2F855A]/5", textColor: "text-[#48BB78]" },
  { name: "HackerRank", url: "https://hackerrank.com", desc: "Great for language proficiency tests and foundational practice", color: "from-[#00EA64]/20 to-[#00EA64]/5", textColor: "text-[#00EA64]" }
];

const DSA_TOPICS = [
  {
    id: "arrays",
    title: "Arrays & Hashing",
    problems: [
      { name: "Two Sum", difficulty: "Easy", url: "https://leetcode.com/problems/two-sum/", platform: "LeetCode" },
      { name: "Contains Duplicate", difficulty: "Easy", url: "https://leetcode.com/problems/contains-duplicate/", platform: "LeetCode" },
      { name: "Valid Anagram", difficulty: "Easy", url: "https://leetcode.com/problems/valid-anagram/", platform: "LeetCode" },
      { name: "Group Anagrams", difficulty: "Medium", url: "https://leetcode.com/problems/group-anagrams/", platform: "LeetCode" },
      { name: "Top K Frequent Elements", difficulty: "Medium", url: "https://leetcode.com/problems/top-k-frequent-elements/", platform: "LeetCode" }
    ]
  },
  {
    id: "two-pointers",
    title: "Two Pointers & Sliding Window",
    problems: [
      { name: "Valid Palindrome", difficulty: "Easy", url: "https://leetcode.com/problems/valid-palindrome/", platform: "LeetCode" },
      { name: "Container With Most Water", difficulty: "Medium", url: "https://leetcode.com/problems/container-with-most-water/", platform: "LeetCode" },
      { name: "Best Time to Buy and Sell Stock", difficulty: "Easy", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", platform: "LeetCode" },
      { name: "Longest Substring Without Repeating Characters", difficulty: "Medium", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", platform: "LeetCode" }
    ]
  },
  {
    id: "linked-lists",
    title: "Linked Lists",
    problems: [
      { name: "Reverse Linked List", difficulty: "Easy", url: "https://leetcode.com/problems/reverse-linked-list/", platform: "LeetCode" },
      { name: "Merge Two Sorted Lists", difficulty: "Easy", url: "https://leetcode.com/problems/merge-two-sorted-lists/", platform: "LeetCode" },
      { name: "Linked List Cycle", difficulty: "Easy", url: "https://leetcode.com/problems/linked-list-cycle/", platform: "LeetCode" },
      { name: "Remove Nth Node From End of List", difficulty: "Medium", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", platform: "LeetCode" }
    ]
  },
  {
    id: "trees-graphs",
    title: "Trees & Graphs",
    problems: [
      { name: "Invert Binary Tree", difficulty: "Easy", url: "https://leetcode.com/problems/invert-binary-tree/", platform: "LeetCode" },
      { name: "Maximum Depth of Binary Tree", difficulty: "Easy", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", platform: "LeetCode" },
      { name: "Number of Islands", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-islands/", platform: "LeetCode" },
      { name: "Clone Graph", difficulty: "Medium", url: "https://leetcode.com/problems/clone-graph/", platform: "LeetCode" }
    ]
  },
  {
    id: "dp-greedy",
    title: "Dynamic Programming & Greedy",
    problems: [
      { name: "Climbing Stairs", difficulty: "Easy", url: "https://leetcode.com/problems/climbing-stairs/", platform: "LeetCode" },
      { name: "Coin Change", difficulty: "Medium", url: "https://leetcode.com/problems/coin-change/", platform: "LeetCode" },
      { name: "Longest Common Subsequence", difficulty: "Medium", url: "https://leetcode.com/problems/longest-common-subsequence/", platform: "LeetCode" },
      { name: "Jump Game", difficulty: "Medium", url: "https://leetcode.com/problems/jump-game/", platform: "LeetCode" }
    ]
  }
];

const CHEAT_SHEETS = {
  cpp: `// C++ Fast I/O & Template
#include <bits/stdc++.h>
using namespace std;

void solve() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    // Write logic here
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int t = 1;
    cin >> t;
    while (t--) {
        solve();
    }
    return 0;
}`,
  java: `// Java Competitive Coding Template
import java.io.*;
import java.util.*;

public class Main {
    static class FastReader {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st;
        String next() {
            while (st == null || !st.hasMoreElements()) {
                try { st = new StringTokenizer(br.readLine()); }
                catch (IOException e) { e.printStackTrace(); }
            }
            return st.nextToken();
        }
        int nextInt() { return Integer.parseInt(next()); }
    }

    public static void main(String[] args) {
        FastReader fr = new FastReader();
        PrintWriter out = new PrintWriter(System.out);
        int t = fr.nextInt();
        while (t-- > 0) {
            int n = fr.nextInt();
            // Write logic here
            out.println(n);
        }
        out.flush();
    }
}`,
  python: `# Python Fast I/O & Boilerplate
import sys
input = sys.stdin.read

def solve():
    data = input().split()
    if not data:
        return
    t = int(data[0])
    idx = 1
    out = []
    for _ in range(t):
        n = int(data[idx])
        idx += 1
        # Write logic here
        out.append(str(n))
    print("\\n".join(out))

if __name__ == '__main__':
    solve()`,
  javascript: `// JavaScript template for LeetCode / Node.js
const fs = require('fs');

function solve() {
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
    if (input.length === 0 || input[0] === "") return;
    let t = parseInt(input[0]);
    let ptr = 1;
    for (let i = 0; i < t; i++) {
        let n = parseInt(input[ptr++]);
        // Write logic here
        console.log(n);
    }
}

// For LeetCode, write the class function directly:
// var twoSum = function(nums, target) { ... }`
};

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
  const [activeTopic, setActiveTopic] = useState('arrays');
  const [activeLang, setActiveLang] = useState('cpp');
  const [savedSuccess, setSavedSuccess] = useState(false);

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

    // Confetti celebration if checked
    if (!completedProblems[probName]) {
      confetti({
        particleCount: 40,
        spread: 30,
        origin: { y: 0.8 }
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="DSA & Competitive Coding Dashboard" />

      {/* Main Container */}
      <div className="mt-4 flex flex-col gap-6">
        
        {/* KPI section */}
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
                  <button onClick={() => setStreak(prev => Math.max(0, prev - 1))} className="text-[9px] bg-white/5 hover:bg-white/10 px-1 rounded">-</button>
                  <button onClick={() => setStreak(prev => prev + 1)} className="text-[9px] bg-white/5 hover:bg-white/10 px-1 rounded">+</button>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl flex items-center gap-4 relative overflow-hidden bg-gradient-to-tr from-cyber-cyan/10 to-transparent">
            <div className="p-3 bg-cyber-cyan/20 rounded-xl text-cyber-cyan">
              <CheckCircle2 className="w-6 h-6" />
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
                {solvedCount + completedCount < 50 ? 'Beginner Bridger' : solvedCount + completedCount < 200 ? 'Intermediate Coder' : 'Algorithms Master'}
              </h4>
              <span className="text-[9px] text-slate-500">Keep solving to unlock badges!</span>
            </div>
          </div>

        </div>

        {/* Middle content: Tracker and Platform profile inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Problem Tracker (2 spans) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            
            <div className="glass-panel p-6 rounded-2xl">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 mb-4 gap-3">
                <div>
                  <h3 className="font-display font-bold text-sm text-white">DSA Curriculum Sheet</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Track your topic-wise mastery of coding interview patterns</p>
                </div>
                
                {/* Topic selector */}
                <div className="flex flex-wrap gap-1">
                  {DSA_TOPICS.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setActiveTopic(topic.id)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                        activeTopic === topic.id 
                          ? 'bg-gradient-to-r from-cyber-purple to-cyber-pink text-white shadow-sm'
                          : 'text-slate-400 hover:text-white bg-white/5'
                      }`}
                    >
                      {topic.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Problems list */}
              <div className="flex flex-col gap-2.5">
                {DSA_TOPICS.find(t => t.id === activeTopic)?.problems.map((prob) => {
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
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                            isCompleted 
                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                              : 'border-white/20 hover:border-cyber-purple/50 bg-white/5'
                          }`}
                        >
                          {isCompleted && <span className="text-[10px] font-bold">✓</span>}
                        </button>
                        <div>
                          <span className={`text-xs font-semibold ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
                            {prob.name}
                          </span>
                          <div className="flex gap-2 items-center mt-0.5">
                            <span className="text-[8px] bg-white/5 border border-white/5 text-slate-400 px-1.5 py-0.2 rounded font-medium">
                              {prob.platform}
                            </span>
                            <span className={`text-[8px] font-semibold uppercase tracking-wider ${
                              prob.difficulty === 'Easy' ? 'text-emerald-400' : 'text-amber-400'
                            }`}>
                              {prob.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      <a 
                        href={prob.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[10px] text-cyber-cyan hover:underline font-semibold pr-1"
                      >
                        <span>Practice</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Interactive Coding Cheat Sheet */}
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyber-purple" />
                  <h3 className="font-display font-bold text-sm text-white">Algorithms Cheat Sheet</h3>
                </div>
                
                {/* Language tabs */}
                <div className="flex gap-1.5">
                  {Object.keys(CHEAT_SHEETS).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all ${
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
                <pre className="p-4 bg-cyber-deep/80 border border-white/5 rounded-xl text-[10px] text-slate-300 overflow-x-auto max-h-64 font-mono leading-relaxed">
                  <code>{CHEAT_SHEETS[activeLang]}</code>
                </pre>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(CHEAT_SHEETS[activeLang]);
                    confetti({ particleCount: 20, spread: 20, origin: { y: 0.8 } });
                  }}
                  className="absolute top-3 right-3 py-1 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[8px] font-bold text-white transition-all"
                >
                  Copy Template
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Profile Integrations & Sheets (1 span) */}
          <div className="flex flex-col gap-6">

            {/* Platform Profile Tracker */}
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <User className="w-4 h-4 text-cyber-cyan" />
                <h3 className="font-display font-bold text-white text-xs">Coding Platform Profiles</h3>
              </div>

              {savedSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg p-2 text-[10px] mb-4 text-center font-medium">
                  Profile data saved successfully!
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
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-pink font-bold text-xs text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow-purple"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile Stats</span>
                </button>

              </form>
            </div>

            {/* Quick Access Sheets */}
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <BookOpen className="w-4 h-4 text-cyber-pink" />
                <h3 className="font-display font-bold text-white text-xs">Standard DSA Study Sheets</h3>
              </div>

              <div className="flex flex-col gap-3">
                {DSA_SHEETS.map((sheet) => (
                  <a
                    key={sheet.name}
                    href={sheet.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col p-3 bg-white/3 border border-white/5 hover:border-cyber-pink/40 rounded-xl transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white group-hover:text-cyber-pink transition-colors">
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

            {/* Platform Shortcuts */}
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <Code2 className="w-4 h-4 text-cyber-purple" />
                <h3 className="font-display font-bold text-white text-xs">Competitive Platform Shortcuts</h3>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {PLATFORMS.map((plat) => (
                  <a
                    key={plat.name}
                    href={plat.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center justify-between p-3 rounded-xl bg-gradient-to-r border border-white/5 hover:border-white/10 transition-all ${plat.color}`}
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
    </div>
  );
}
