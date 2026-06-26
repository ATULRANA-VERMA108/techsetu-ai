import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Bookmark, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_NEWS = [
  {
    id: 'news-1',
    category: 'Company Update',
    tag: 'Google',
    title: 'Google Launches Gemini 2.5 Ultra: Advanced Multi-Agent Planning & 3M Context',
    summary: 'Google officially released Gemini 2.5 Ultra, showcasing a 3-million token context window. In addition, Google integrates autonomous planning agents directly within Android studio for compiling, debugging, and deploying modules natively. Under the hood, Google utilizes TPU v6 clusters to accelerate inference speeds by 4x.',
    author: 'Sundar Pichai',
    time: '2 hours ago',
    source: 'Google Blog',
    url: 'https://blog.google/technology/ai/gemini-2-5-ultra/',
    techStack: ['Java', 'Kotlin', 'Python', 'C++', 'Go', 'Angular', 'TensorFlow', 'TPU'],
    techDeals: 'Google Cloud signs massive $2B deal with Stripe for AI compute nodes integration.',
    activeJobs: [
      { role: 'Staff Software Engineer - Android AI', location: 'Mountain View, CA', targetDsa: 'Invert Binary Tree (Tier 1)' },
      { role: 'Cloud Solutions Architect - TPU Specialist', location: 'Seattle, WA', targetDsa: 'Number of Islands (Tier 1)' }
    ]
  },
  {
    id: 'news-2',
    category: 'Tech Deals',
    tag: 'Stripe',
    title: 'Stripe Partners with Google Cloud to Power Next-Gen Billing Orchestration',
    summary: 'Stripe announced a strategic partnership with Google Cloud to move its core billing orchestration and ledger database services to GCP. This partnership allows Stripe to process over 150,000 transactions per second during peak holiday seasons without latency spikes. Stripe\'s backend uses Ruby, Go, and React.',
    author: 'Patrick Collison',
    time: '5 hours ago',
    source: 'Stripe Engineering',
    url: 'https://stripe.com/newsroom',
    techStack: ['Ruby on Rails', 'Go', 'React', 'Scala', 'PostgreSQL', 'AWS', 'GCP'],
    techDeals: '$2B strategic partnership contract with Google Cloud for infra scale.',
    activeJobs: [
      { role: 'Frontend Engineer - Billing UI', location: 'San Francisco, CA', targetDsa: 'Group Anagrams (Tier 2)' },
      { role: 'Senior Infrastructure Engineer - Go Platform', location: 'Remote', targetDsa: 'Top K Frequent Elements (Tier 1)' }
    ]
  },
  {
    id: 'news-3',
    category: 'Tech Jobs',
    tag: 'Microsoft',
    title: 'Microsoft Copilot Dev Division Hires Over 500 Engineers for Azure Scaling',
    summary: 'Microsoft is expanding its Copilot Dev Division, opening 500+ remote vacancies for Azure and AI integration. The engineering team is focusing on migrating legacy services to dynamic TypeScript and Python pipelines. The roles are mapped to Tier 1 SDE guidelines with competitive packages.',
    author: 'Satya Nadella',
    time: '1 day ago',
    source: 'Microsoft Press',
    url: 'https://blogs.microsoft.com',
    techStack: ['C#', 'TypeScript', 'Python', 'C++', 'React', 'Azure Cosmos DB', 'Azure OpenAI'],
    techDeals: 'Copilot integration contract with Office 365 Enterprise suite globally.',
    activeJobs: [
      { role: 'Azure AI Platform Engineer', location: 'Redmond, WA', targetDsa: 'Valid Palindrome (Tier 1)' },
      { role: 'Copilot Senior Frontend Developer', location: 'Remote', targetDsa: 'Two Sum (Tier 1)' }
    ]
  },
  {
    id: 'news-4',
    category: 'Technology Stack',
    tag: 'Netflix',
    title: 'How Netflix Re-engineered its Video Streaming Pipeline using Rust and WebAssembly',
    summary: 'Netflix engineering published a detailed Medium article describing how they replaced their legacy JavaScript video players with custom Rust compiled to WebAssembly. This migration reduced CPU overhead on Smart TVs by 42% and minimized buffering times globally, running on their custom CDN network.',
    author: 'Greg Peters',
    time: '2 days ago',
    source: 'Netflix TechBlog',
    url: 'https://netflixtechblog.com',
    techStack: ['Java', 'Rust', 'Node.js', 'React', 'WebAssembly', 'AWS', 'Cassandra'],
    techDeals: 'CDN hardware supply contract with Intel for custom encoding chips.',
    activeJobs: [
      { role: 'Senior Player Platform Engineer', location: 'Los Gatos, CA', targetDsa: 'Container With Most Water (Tier 1)' },
      { role: 'Cloud Infrastructure Architect', location: 'Los Gatos, CA', targetDsa: 'Longest Substring Without Repeating Characters (Tier 2)' }
    ]
  },
  {
    id: 'news-5',
    category: 'AI Research',
    tag: 'Meta',
    title: 'Meta Open-Sources Llama 4.5: PyTorch Native Environments & Self-Debugging Code',
    summary: 'Meta has open-sourced Llama 4.5. The model is built natively to interface with PyTorch execution loops. It can write code, run self-tests, verify output correctness, and automatically debug compile errors. Developers can integrate this directly into local development setups.',
    author: 'Mark Zuckerberg',
    time: '2 days ago',
    source: 'Meta AI Blog',
    url: 'https://ai.meta.com',
    techStack: ['React', 'React Native', 'PyTorch', 'C++', 'PHP/Hack', 'PostgreSQL'],
    techDeals: 'Open-source AI distribution partnership with Hugging Face and AWS Bedrock.',
    activeJobs: [
      { role: 'PyTorch Core Contributor SDE', location: 'New York, NY', targetDsa: 'Group Anagrams (Tier 1)' },
      { role: 'AI Safety Red Team Lead', location: 'Menlo Park, CA', targetDsa: 'Two Sum (Tier 1)' }
    ]
  },
  {
    id: 'news-6',
    category: 'Article Insight',
    tag: 'Medium',
    title: 'Medium Migrates Core Feed Algorithm to Real-Time Collaborative Filtering',
    summary: 'Medium SDEs detailed their migration from Batch Spark jobs to real-time collaborative filtering using Redis Enterprise and Go. Readers now receive content updates in under 200ms of publish. They also discussed their stack: Node.js, Go, React, and serverless AWS.',
    author: 'Tony Stubblebine',
    time: '3 days ago',
    source: 'Medium Engineering',
    url: 'https://medium.com/engineering',
    techStack: ['Node.js', 'Go', 'React', 'Redis', 'AWS', 'Aurora PostgreSQL'],
    techDeals: 'Redis Enterprise partnership for global cache clustering scale.',
    activeJobs: [
      { role: 'Senior Backend Engineer - Feed & Discovery', location: 'Remote', targetDsa: 'Valid Anagram (Tier 3)' },
      { role: 'Fullstack Developer', location: 'New York, NY', targetDsa: 'Contains Duplicate (Tier 3)' }
    ]
  },
  {
    id: 'news-7',
    category: 'Company Update',
    tag: 'Amazon',
    title: 'Amazon Web Services Launches Bedrock Agents for Autonomous App Compilation',
    summary: 'Amazon Web Services unveiled Bedrock Agents, enabling users to orchestrate complex multi-step workflows. AWS engineers utilize Java and Python to build secure sandbox environments where agents compile, run, and host serverless applications. AWS is actively hiring Solutions Architects.',
    author: 'Andy Jassy',
    time: '3 days ago',
    source: 'AWS News',
    url: 'https://aws.amazon.com',
    techStack: ['Java', 'Python', 'C++', 'AWS Services (DynamoDB, Lambda, EC2)', 'React'],
    techDeals: '$4B investment expansion in Anthropic AI models hosting contract.',
    activeJobs: [
      { role: 'AWS Bedrock SDE II', location: 'Boston, MA', targetDsa: 'Jump Game (Tier 1)' },
      { role: 'Senior Solutions Architect - Generative AI', location: 'Dallas, TX', targetDsa: 'Maximum Segment Sum (Tier 1)' }
    ]
  },
  {
    id: 'news-8',
    category: 'Technology Stack',
    tag: 'Airbnb',
    title: 'Airbnb Redesigns Search Backend to Support Real-Time Vector Similarity Search',
    summary: 'Airbnb engineering shared how they upgraded their search queries to support vector-based property similarity. By integrating Elasticsearch vector databases and PyTorch embeddings, Airbnb matches users to stays with 85% higher satisfaction metrics. The stack uses React and Java.',
    author: 'Brian Chesky',
    time: '4 days ago',
    source: 'Airbnb Engineering',
    url: 'https://medium.com/airbnb-engineering',
    techStack: ['Ruby', 'Java', 'React', 'TypeScript', 'Elasticsearch Vector Search', 'AWS'],
    techDeals: 'Strategic API integration with local eco-tourism databases.',
    activeJobs: [
      { role: 'Senior Search SDE', location: 'San Francisco, CA', targetDsa: 'Design a Rate Limiter (Tier 1)' },
      { role: 'UI Platform Engineer - React Core', location: 'San Francisco, CA', targetDsa: 'Linked List Cycle (Tier 2)' }
    ]
  },
  {
    id: 'news-9',
    category: 'Tech Deals',
    tag: 'Uber',
    title: 'Uber signs Cloud Migration Contract with Oracle Cloud Infrastructure (OCI)',
    summary: 'Uber has selected OCI to handle its high-throughput real-time routing algorithms. Uber utilizes Go and Java on OCI Kubernetes to calculate optimal travel pricing and driver matching within 100ms. This contract will save Uber over $120M in hosting costs over 3 years.',
    author: 'Dara Khosrowshahi',
    time: '5 days ago',
    source: 'Uber Engineering',
    url: 'https://uber.com/newsroom',
    techStack: ['Go', 'Java', 'Python', 'React', 'Oracle Cloud', 'Kubernetes', 'PostgreSQL'],
    techDeals: '$120M cloud migration deal with Oracle for real-time compute scaling.',
    activeJobs: [
      { role: 'Real-Time Routing SDE II', location: 'San Francisco, CA', targetDsa: 'Number of Islands (Tier 1)' },
      { role: 'Lead Infrastructure Engineer', location: 'Seattle, WA', targetDsa: 'Design a Chat System (Tier 2)' }
    ]
  }
];

export default function TechNewsPage() {
  const [newsList] = useState(INITIAL_NEWS);
  const [filterCategory, setFilterCategory] = useState('All');
  
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id');
  const [selectedId, setSelectedId] = useState(queryId || INITIAL_NEWS[0].id);

  // Sync selected article when URL search params change
  useEffect(() => {
    if (queryId) {
      setSelectedId(queryId);
    }
  }, [queryId]);

  // Interaction states stored locally
  const [likedIds, setLikedIds] = useState(() => JSON.parse(localStorage.getItem('news_likes') || '[]'));
  const [dislikedIds, setDislikedIds] = useState(() => JSON.parse(localStorage.getItem('news_dislikes') || '[]'));
  const [bookmarkedIds, setBookmarkedIds] = useState(() => JSON.parse(localStorage.getItem('news_bookmarks') || '[]'));

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('news_likes', JSON.stringify(likedIds));
  }, [likedIds]);

  useEffect(() => {
    localStorage.setItem('news_dislikes', JSON.stringify(dislikedIds));
  }, [dislikedIds]);

  useEffect(() => {
    localStorage.setItem('news_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  // Compute category weights based on user likes/bookmarks to recommend articles
  const getCategoryWeights = () => {
    const weights = {};
    INITIAL_NEWS.forEach(news => {
      const isLiked = likedIds.includes(news.id);
      const isBookmarked = bookmarkedIds.includes(news.id);
      const isDisliked = dislikedIds.includes(news.id);
      
      let score = 0;
      if (isLiked) score += 3;
      if (isBookmarked) score += 2;
      if (isDisliked) score -= 3;

      if (score !== 0) {
        weights[news.category] = (weights[news.category] || 0) + score;
      }
    });
    return weights;
  };

  const weights = getCategoryWeights();

  const handleLike = (id) => {
    if (likedIds.includes(id)) {
      setLikedIds(prev => prev.filter(item => item !== id));
    } else {
      setLikedIds(prev => [...prev, id]);
      setDislikedIds(prev => prev.filter(item => item !== id));
      confetti({ particleCount: 15, spread: 20, origin: { y: 0.8 } });
    }
  };

  const handleDislike = (id) => {
    if (dislikedIds.includes(id)) {
      setDislikedIds(prev => prev.filter(item => item !== id));
    } else {
      setDislikedIds(prev => [...prev, id]);
      setLikedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleBookmark = (id) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(prev => prev.filter(item => item !== id));
    } else {
      setBookmarkedIds(prev => [...prev, id]);
    }
  };

  // Sort and filter articles
  const sortedAndFilteredNews = newsList
    .filter(news => {
      // Hide disliked articles
      if (dislikedIds.includes(news.id)) return false;
      if (filterCategory === 'All') return true;
      return news.category === filterCategory;
    })
    .map(news => {
      const categoryWeight = weights[news.category] || 0;
      // Mark as recommended if category has positive interest
      const isRecommended = categoryWeight > 0;
      return { ...news, weight: categoryWeight, isRecommended };
    })
    .sort((a, b) => b.weight - a.weight);

  const activeArticle = newsList.find(news => news.id === selectedId) || newsList[0];

  const categories = ['All', 'Company Update', 'Tech Deals', 'Tech Jobs', 'AI Research', 'Technology Stack', 'Article Insight'];

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-cyber-cyan text-xs font-bold uppercase tracking-wider">
          <Globe className="w-4 h-4" />
          <span>News & Insights Center</span>
        </div>
        <h2 className="text-3xl font-display font-bold text-white leading-tight">
          Tech Industry <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyber-purple to-cyber-pink">Briefings</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
          Stay ahead of the curve. Scannable updates from Medium, tech blogs, and corporate engineering divisions, outlining their tech stacks, job openings, and tech deals.
        </p>
      </div>

      {/* Main split-screen container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Headlines list (1/3 width) */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Categories Selector */}
          <div className="glass-panel p-3 rounded-xl flex flex-col gap-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Filter News</span>
            <div className="flex flex-wrap gap-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setFilterCategory(cat);
                    // auto-select first matching news in this category
                    const matching = newsList.filter(news => {
                      if (dislikedIds.includes(news.id)) return false;
                      return cat === 'All' || news.category === cat;
                    });
                    if (matching.length > 0) {
                      setSelectedId(matching[0].id);
                    }
                  }}
                  className={`px-2 py-1 rounded text-[9.5px] font-bold transition-all cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-gradient-to-r from-cyber-purple to-cyber-pink text-white shadow-glow-purple'
                      : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {cat.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Headlines Stream */}
          <div className="glass-panel rounded-2xl p-3 flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAndFilteredNews.length === 0 ? (
              <p className="text-slate-500 text-[11px] text-center py-8">No articles available.</p>
            ) : (
              sortedAndFilteredNews.map(news => {
                const isSelected = selectedId === news.id;
                return (
                  <div
                    key={news.id}
                    onClick={() => setSelectedId(news.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 relative ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyber-purple/15 to-cyber-pink/5 border-cyber-purple'
                        : 'bg-white/5 hover:bg-white/10 border-transparent border-l-4'
                    }`}
                  >
                    {news.isRecommended && (
                      <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" title="Recommended for you" />
                    )}
                    <div className="flex items-center gap-1.5 text-[8.5px] font-extrabold uppercase text-slate-500">
                      <span className="text-cyber-pink">#{news.tag}</span>
                      <span>•</span>
                      <span>{news.time}</span>
                    </div>
                    <h4 className={`text-[12px] font-bold leading-snug transition-colors ${
                      isSelected ? 'text-white font-semibold' : 'text-slate-300 font-medium'
                    }`}>
                      {news.title}
                    </h4>
                    <span className="text-[9.5px] text-slate-500 font-medium">via {activeArticle.id === news.id ? activeArticle.source : news.source}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Pane (2/3 width) */}
        <div className="lg:col-span-2">
          {activeArticle ? (
            <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-6 relative shadow-2xl">
              
              {/* Top Meta info */}
              <div className="flex items-center justify-between border-b border-cyber-border pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-cyber-purple/20 border border-cyber-purple/30 text-[9.5px] font-extrabold text-cyber-pink uppercase tracking-wide">
                    {activeArticle.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {activeArticle.time}
                  </span>
                </div>

                {activeArticle.isRecommended && (
                  <div className="flex items-center gap-1 bg-cyber-cyan/10 border border-cyber-cyan/30 text-[9px] font-extrabold text-cyber-cyan px-2.5 py-0.5 rounded-full select-none shadow-sm animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    <span>RECOMMENDED</span>
                  </div>
                )}
              </div>

              {/* Title & Concise Summary */}
              <div className="space-y-3">
                <h3 className="text-xl font-display font-extrabold leading-snug">
                  {activeArticle.title}
                </h3>
                <p className="text-[13.5px] text-slate-300 leading-relaxed font-sans font-medium">
                  {activeArticle.summary}
                </p>
                <div className="text-[10.5px] text-slate-400 font-semibold">
                  Published by <span className="text-slate-200">@{activeArticle.author}</span> via <span className="text-cyber-cyan font-bold">{activeArticle.source}</span>
                </div>
              </div>

              {/* Deep Company Insights widget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-cyber-border pt-5">
                
                {/* Tech Stack used by Company */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-cyber-cyan uppercase tracking-wider">Company Tech Stack</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {activeArticle.techStack?.map(tech => (
                      <span key={tech} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9.5px] text-slate-300 font-medium uppercase tracking-wide">
                        {tech}
                      </span>
                    )) || <span className="text-slate-500 text-[10px]">No stack details available.</span>}
                  </div>
                </div>

                {/* Tech Deals & Acquisitions */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-cyber-pink uppercase tracking-wider">Latest Deals & Scaling</span>
                  <p className="text-[11.5px] text-slate-300 leading-relaxed font-medium mt-1">
                    {activeArticle.techDeals || "No active tech deals reported recently."}
                  </p>
                </div>
              </div>

              {/* Active Jobs & DSA Target openings */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">Target Job Openings & DSA Preparation</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                  {activeArticle.activeJobs?.map((job, idx) => (
                    <div key={idx} className="p-3 bg-black/20 border border-white/5 rounded-lg flex flex-col gap-2 justify-between">
                      <div>
                        <h5 className="text-[11.5px] font-bold text-slate-200 leading-tight">{job.role}</h5>
                        <span className="text-[9.5px] text-slate-500 font-semibold">{job.location}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
                        <span className="text-[9.5px] text-cyber-cyan font-bold italic">{job.targetDsa}</span>
                        <Link 
                          to="/dsa" 
                          className="flex items-center gap-1 text-[9.5px] font-extrabold bg-gradient-to-r from-cyber-purple to-cyber-pink hover:scale-105 transition-all text-white px-2.5 py-1 rounded-lg"
                        >
                          <span>Practice</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    </div>
                  )) || <span className="text-slate-500 text-[10px]">No active vacancies listed currently.</span>}
                </div>
              </div>

              {/* Engagement Controls & Article Link */}
              <div className="border-t border-cyber-border pt-4 flex items-center justify-between flex-wrap gap-3">
                
                {/* Visit source */}
                <a
                  href={activeArticle.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-cyber-cyan border border-cyber-cyan/20 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Read Official Article</span>
                </a>

                {/* Likes/Hide/Bookmark */}
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleLike(activeArticle.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-all hover:text-green-400 cursor-pointer ${
                      likedIds.includes(activeArticle.id) ? 'text-green-400' : 'text-slate-400'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Like</span>
                  </button>

                  <button 
                    onClick={() => handleDislike(activeArticle.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>Hide</span>
                  </button>

                  <button 
                    onClick={() => handleBookmark(activeArticle.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-all hover:text-cyber-cyan cursor-pointer ${
                      bookmarkedIds.includes(activeArticle.id) ? 'text-cyber-cyan' : 'text-slate-400'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>

              </div>

            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl text-center border border-white/5">
              <p className="text-slate-400 text-xs">No article selected.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
