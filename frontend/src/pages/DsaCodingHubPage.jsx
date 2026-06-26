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
  Compass
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

const LECTURES = [
  { title: "Striver's A2Z DSA Playlist", channel: "take U forward", desc: "Best comprehensive multi-language DSA course from scratch", url: "https://youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz", tags: ["C++", "Java"] },
  { title: "C++ DSA Bootcamp", channel: "Love Babbar", desc: "Supreme batch C++ and algorithms playlist", url: "https://youtube.com/playlist?list=PLDzeHZWIZsTrytAR3ltFITkK5VMh5ODNh", tags: ["C++"] },
  { title: "Java DSA & Interview Prep", channel: "Kunal Kushwaha", desc: "Detailed explanations of recursion, trees, and system parameters", url: "https://youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsPZu1wMGeA7xGrk9g", tags: ["Java"] },
  { title: "Python Algorithm Walks", channel: "NeetCode", desc: "Visual whiteboarding and optimal Python code details", url: "https://youtube.com/@NeetCode", tags: ["Python"] }
];

const INFLUENCERS = [
  { name: "Raj Vikramaditya (Striver)", role: "Software Engineer @ Google", desc: "Daily DSA problems, sheets, and placement tips", url: "https://linkedin.com/in/raj-vikramaditya" },
  { name: "Arsh Goyal", role: "Senior Engineer @ Samsung", desc: "#6Companies30Days challenge guides and interview sheets", url: "https://linkedin.com/in/arshgoyal" },
  { name: "Love Babbar", role: "Ex-Amazon SDE", desc: "Software placements, resume builder sessions, and tech roadmaps", url: "https://linkedin.com/in/love-babbar-38ab85187" }
];

const DSA_TOPICS = [
  {
    id: "arrays",
    title: "Arrays & Hashing",
    problems: [
      { name: "Two Sum", difficulty: "Beginner", path: "two-sum", platform: "LeetCode", tier: "Tier 1", companyType: "Product-Based" },
      { name: "Contains Duplicate", difficulty: "Beginner", path: "contains-duplicate", platform: "LeetCode", tier: "Tier 3", companyType: "Service-Based" },
      { name: "Valid Anagram", difficulty: "Beginner", path: "valid-anagram", platform: "LeetCode", tier: "Tier 3", companyType: "Service-Based" },
      { name: "Group Anagrams", difficulty: "Intermediate", path: "group-anagrams", platform: "LeetCode", tier: "Tier 2", companyType: "SaaS-Based" },
      { name: "Top K Frequent Elements", difficulty: "Intermediate", path: "top-k-frequent-elements", platform: "LeetCode", tier: "Tier 1", companyType: "Product-Based" }
    ]
  },
  {
    id: "two-pointers",
    title: "Two Pointers & Sliding Window",
    problems: [
      { name: "Valid Palindrome", difficulty: "Beginner", path: "valid-palindrome", platform: "LeetCode", tier: "Tier 3", companyType: "Service-Based" },
      { name: "Container With Most Water", difficulty: "Intermediate", path: "container-with-most-water", platform: "LeetCode", tier: "Tier 1", companyType: "Product-Based" },
      { name: "Best Time to Buy and Sell Stock", difficulty: "Beginner", path: "best-time-to-buy-and-sell-stock", platform: "LeetCode", tier: "Tier 1", companyType: "Product-Based" },
      { name: "Longest Substring Without Repeating Characters", difficulty: "Intermediate", path: "longest-substring-without-repeating-characters", platform: "LeetCode", tier: "Tier 2", companyType: "SaaS-Based" }
    ]
  },
  {
    id: "linked-lists",
    title: "Linked Lists",
    problems: [
      { name: "Reverse Linked List", difficulty: "Beginner", path: "reverse-linked-list", platform: "LeetCode", tier: "Tier 3", companyType: "Service-Based" },
      { name: "Merge Two Sorted Lists", difficulty: "Beginner", path: "merge-two-sorted-lists", platform: "LeetCode", tier: "Tier 1", companyType: "Product-Based" },
      { name: "Linked List Cycle", difficulty: "Beginner", path: "linked-list-cycle", platform: "LeetCode", tier: "Tier 2", companyType: "SaaS-Based" },
      { name: "Remove Nth Node From End of List", difficulty: "Intermediate", path: "remove-nth-node-from-end-of-list", platform: "LeetCode", tier: "Tier 1", companyType: "Product-Based" }
    ]
  },
  {
    id: "trees-graphs",
    title: "Trees & Graphs",
    problems: [
      { name: "Invert Binary Tree", difficulty: "Beginner", path: "invert-binary-tree", platform: "LeetCode", tier: "Tier 1", companyType: "Product-Based" },
      { name: "Maximum Depth of Binary Tree", difficulty: "Beginner", path: "maximum-depth-of-binary-tree", platform: "LeetCode", tier: "Tier 3", companyType: "Service-Based" },
      { name: "Number of Islands", difficulty: "Intermediate", path: "number-of-islands", platform: "LeetCode", tier: "Tier 1", companyType: "Product-Based" },
      { name: "Clone Graph", difficulty: "Intermediate", path: "clone-graph", platform: "LeetCode", tier: "Tier 2", companyType: "SaaS-Based" }
    ]
  },
  {
    id: "dp-greedy",
    title: "Dynamic Programming & Greedy",
    problems: [
      { name: "Climbing Stairs", difficulty: "Beginner", path: "climbing-stairs", platform: "LeetCode", tier: "Tier 3", companyType: "Service-Based" },
      { name: "Coin Change", difficulty: "Intermediate", path: "coin-change", platform: "LeetCode", tier: "Tier 1", companyType: "Product-Based" },
      { name: "Longest Common Subsequence", difficulty: "Intermediate", path: "longest-common-subsequence", platform: "LeetCode", tier: "Tier 2", companyType: "SaaS-Based" },
      { name: "Jump Game", difficulty: "Intermediate", path: "jump-game", platform: "LeetCode", tier: "Tier 1", companyType: "Product-Based" }
    ]
  },
  {
    id: "system-design",
    title: "System Design Patterns",
    problems: [
      { name: "Design a Rate Limiter", difficulty: "Intermediate", path: "design-rate-limiter", platform: "SystemDesign", tier: "Tier 1", companyType: "Product-Based" },
      { name: "Design Twitter / X Feed", difficulty: "Hard", path: "design-twitter", platform: "SystemDesign", tier: "Tier 2", companyType: "SaaS-Based" },
      { name: "Design a URL Shortener", difficulty: "Beginner", path: "design-url-shortener", platform: "SystemDesign", tier: "Tier 3", companyType: "Service-Based" },
      { name: "Design a Chat System", difficulty: "Hard", path: "design-chat-system", platform: "SystemDesign", tier: "Tier 2", companyType: "SaaS-Based" }
    ]
  },
  {
    id: "codeforces",
    title: "Codeforces (Hard)",
    problems: [
      { name: "Maximum Segment Sum", difficulty: "Hard", path: "max-segment-sum", platform: "Codeforces", tier: "Tier 1", companyType: "Product-Based" },
      { name: "Shortest Path in Weighted Tree", difficulty: "Hard", path: "shortest-path-tree", platform: "Codeforces", tier: "Tier 1", companyType: "Product-Based" },
      { name: "Maximum XOR Subarray", difficulty: "Hard", path: "max-xor-subarray", platform: "Codeforces", tier: "Tier 2", companyType: "SaaS-Based" },
      { name: "Graph Connectivity Cycles", difficulty: "Hard", path: "graph-connectivity", platform: "Codeforces", tier: "Tier 2", companyType: "SaaS-Based" }
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
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [prepFilter, setPrepFilter] = useState('All');

  const activeTopicProblems = DSA_TOPICS.find(t => t.id === activeTopic)?.problems || [];
  const filteredProblems = activeTopicProblems.filter(prob => {
    const matchesDiff = difficultyFilter === 'All' || prob.difficulty === difficultyFilter;
    const matchesPrep = prepFilter === 'All' || prob.tier === prepFilter || prob.companyType === prepFilter;
    return matchesDiff && matchesPrep;
  });

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
          <div className="lg:col-span-2 flex flex-col gap-6">
            
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

              {/* Filter controls inside panel */}
              <div className="bg-white/2 p-3 rounded-xl border border-white/5 mb-4 flex flex-col gap-2.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-2">Level:</span>
                  {['All', 'Beginner', 'Intermediate', 'Hard'].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficultyFilter(diff)}
                      className={`px-2 py-0.5 rounded text-[9px] font-semibold border transition-all ${
                        difficultyFilter === diff
                          ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan'
                          : 'bg-white/5 border-transparent text-slate-400 hover:text-white'
                      }`}
                    >
                      {diff === 'Hard' ? 'Hard (Codeforces)' : diff}
                    </button>
                  ))}
                </div>
                
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-2">Prep Mode:</span>
                  {['All', 'Tier 1', 'Tier 2', 'Tier 3', 'Product-Based', 'Service-Based', 'SaaS-Based'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setPrepFilter(mode)}
                      className={`px-2 py-0.5 rounded text-[9px] font-semibold border transition-all ${
                        prepFilter === mode
                          ? 'bg-cyber-purple/20 border-cyber-purple text-cyber-purple'
                          : 'bg-white/5 border-transparent text-slate-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Problems list */}
              <div className="flex flex-col gap-2.5">
                {filteredProblems.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs bg-white/2 border border-white/5 rounded-xl">
                    No problems match your active filter settings.
                  </div>
                ) : (
                  filteredProblems.map((prob) => {
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
                            <div className="flex gap-2 items-center mt-0.5 flex-wrap">
                              <span className="text-[8px] bg-white/5 border border-white/5 text-slate-400 px-1.5 py-0.2 rounded font-medium">
                                {prob.platform}
                              </span>
                              <span className={`text-[8px] font-semibold uppercase tracking-wider ${
                                prob.difficulty === 'Beginner' ? 'text-emerald-400' : prob.difficulty === 'Intermediate' ? 'text-amber-400' : 'text-red-400'
                              }`}>
                                {prob.difficulty}
                              </span>
                              <span className="text-[8px] bg-cyber-purple/15 border border-cyber-purple/20 text-cyber-cyan px-1.5 py-0.2 rounded font-medium">
                                {prob.tier}
                              </span>
                              <span className="text-[8px] bg-cyber-pink/15 border border-cyber-pink/20 text-cyber-pink px-1.5 py-0.2 rounded font-medium">
                                {prob.companyType}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Link 
                            to={`/editor?question=${prob.path}`}
                            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-cyber-purple/20 to-cyber-pink/20 hover:from-cyber-purple/35 hover:to-cyber-pink/35 border border-cyber-purple/30 rounded-lg text-[9px] text-white font-bold transition-all"
                          >
                            <Code2 className="w-3 h-3 text-cyber-pink" />
                            <span>Solve in Editor</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>

            {/* Placements & Video Coding Resources */}
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <Youtube className="w-5 h-5 text-red-500" />
                <h3 className="font-display font-bold text-sm text-white">Curated Lectures & Placements preparation</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LECTURES.map((lec) => (
                  <a
                    key={lec.title}
                    href={lec.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col p-4 bg-white/3 border border-white/5 hover:border-red-500/30 rounded-xl transition-all group text-left"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                        {lec.title}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-[9px] text-red-400 font-semibold mb-1">Channel: {lec.channel}</span>
                    <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
                      {lec.desc}
                    </p>
                    <div className="flex gap-1.5 mt-auto">
                      {lec.tags.map(t => (
                        <span key={t} className="text-[8px] bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold">
                          {t}
                        </span>
                      ))}
                    </div>
                  </a>
                ))}
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

            {/* LinkedIn Tech Influencers */}
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <Linkedin className="w-4 h-4 text-cyber-blue" />
                <h3 className="font-display font-bold text-white text-xs">LinkedIn Placements Guides</h3>
              </div>

              <div className="flex flex-col gap-3">
                {INFLUENCERS.map((inf) => (
                  <a
                    key={inf.name}
                    href={inf.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col p-3 bg-white/3 border border-white/5 hover:border-cyber-blue/40 rounded-xl transition-all group text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-cyber-blue transition-colors">
                        {inf.name}
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-[9px] text-cyber-blue font-medium mt-0.5">{inf.role}</span>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                      {inf.desc}
                    </p>
                  </a>
                ))}
              </div>
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
                    className="flex flex-col p-3 bg-white/3 border border-white/5 hover:border-cyber-pink/40 rounded-xl transition-all group text-left"
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
    </div>
  );
}
