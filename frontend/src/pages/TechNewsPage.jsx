import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header.jsx';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Bookmark, 
  ExternalLink, 
  Sparkles, 
  Filter, 
  Clock, 
  Globe,
  Database,
  Code
} from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_NEWS = [
  {
    id: 'news-1',
    category: 'AI & ML',
    tag: 'AI/ML',
    title: 'OpenAI Unveils GPT-5 with Advanced Multi-Agent Collaboration Loops',
    summary: 'OpenAI has officially released GPT-5. The model introduces native multi-agent orchestration, enabling multiple sub-instances to divide tasks, self-correct bugs, and run parallel executions. Early benchmarks demonstrate a 99.4% logic accuracy score on standard coding evaluations.',
    author: 'Taha Jaffri',
    time: '2 hours ago',
    source: 'TechCrunch',
    url: 'https://techcrunch.com'
  },
  {
    id: 'news-2',
    category: 'Databases',
    tag: 'MongoDB',
    title: 'MongoDB 8.0 Launches with 3x Faster Query Engines & Vector Indexes',
    summary: 'MongoDB has announced version 8.0 with massive performance upgrades. It features 300% faster concurrent aggregation processing and deep Mongoose schema support. Crucially, native vector search algorithms have been integrated directly into the database engine for low-latency AI queries.',
    author: 'Sarah Jenkins',
    time: '5 hours ago',
    source: 'Hacker News',
    url: 'https://news.ycombinator.com'
  },
  {
    id: 'news-3',
    category: 'Google',
    tag: 'Google Developers',
    title: 'Google I/O 2026: Gemini 2.5 Pro Debuts with 2M Token Context Support',
    summary: 'Google announced Gemini 2.5 Pro at its developer keynote. The upgraded foundation model offers an unprecedented 2-million token context window. Developers can now feed entire codebases directly into the API for instant refactoring, optimization, and system architecture mapping.',
    author: 'Amit Sharma',
    time: '1 day ago',
    source: 'VentureBeat',
    url: 'https://venturebeat.com'
  },
  {
    id: 'news-4',
    category: 'Hackathons',
    tag: 'AI Hackathons',
    title: 'GitHub Universe AI-Agent Hackathon 2026 Announced with $100k Pool',
    summary: 'GitHub has launched its global Universe Hackathon with a $100,000 prize pool. This year, the focus is entirely on AI-agent workflows, autonomous coding loops, and developer productivity tools. Teams have 3 weeks to deploy functional, sandbox-secured coding assistants.',
    author: 'Developer Portal',
    time: '1 day ago',
    source: 'GitHub Blog',
    url: 'https://github.blog'
  },
  {
    id: 'news-5',
    category: 'Global AI',
    tag: 'Regulation',
    title: 'EU AI Act Enters Full Enforcement Stage for Foundation Models',
    summary: 'The European Union AI Act has reached its active enforcement phase. All foundation model providers must now undergo strict compliance audits covering training data transparency, energy efficiency metrics, and red-team safety verification protocols before launching products in the EU.',
    author: 'Helena Vance',
    time: '2 days ago',
    source: 'Reuters',
    url: 'https://reuters.com'
  },
  {
    id: 'news-6',
    category: 'AI & ML',
    tag: 'DeepMind',
    title: 'Google DeepMind Open-Sources AlphaFold 3 Weights for Research',
    summary: 'In a major win for computational biology, DeepMind has open-sourced the model parameters and weights of AlphaFold 3. Researchers worldwide can now run local instances to predict molecular complexes, protein-DNA bindings, and design custom enzymes for therapeutics.',
    author: 'Dr. Evelyn Cole',
    time: '2 days ago',
    source: 'Nature Portfolio',
    url: 'https://nature.com'
  },
  {
    id: 'news-7',
    category: 'Databases',
    tag: 'Mongoose ORM',
    title: 'Mongoose Adds Native Vector Schema Types & Search Index Integrations',
    summary: 'The developers behind Mongoose ORM have released version 8.4, introducing native support for vector fields. Node.js applications can now declare mongoose schemas with vector types and run similarity searches using standard mongo queries without external client drivers.',
    author: 'Ryan Dahl',
    time: '3 days ago',
    source: 'Dev.to',
    url: 'https://dev.to'
  },
  {
    id: 'news-8',
    category: 'Hackathons',
    tag: 'Microsoft Cup',
    title: 'Microsoft Imagine Cup 2026 Highlights Social Impact AI Projects',
    summary: 'Microsoft kicked off the 2026 Imagine Cup startup competition. This iteration prioritizes AI applications targeting global sustainability, accessibility, and clean energy. Winning student developers will receive mentorship from Azure engineers and seed grants to scale projects.',
    author: 'Satya Nadella',
    time: '4 days ago',
    source: 'Microsoft Press',
    url: 'https://microsoft.com'
  }
];

export default function TechNewsPage() {
  const [newsList, setNewsList] = useState(INITIAL_NEWS);
  const [filterCategory, setFilterCategory] = useState('All');
  
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
  const sortedAndFilteredNews = INITIAL_NEWS
    .filter(news => {
      // Banish disliked articles to hide them or put them at the bottom
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
    // Sort by recommendation weight first, then keep original order
    .sort((a, b) => b.weight - a.weight);

  const categories = ['All', 'AI & ML', 'Google', 'Databases', 'Hackathons', 'Global AI'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-cyber-cyan text-xs font-bold uppercase tracking-wider">
          <Globe className="w-4 h-4" />
          <span>Inshorts-Style Tech News</span>
        </div>
        <h2 className="text-3xl font-display font-bold text-white leading-tight">
          Tech Industry <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyber-purple to-cyber-pink">Briefings</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
          Stay ahead of the curve. Concise 60-word updates covering AI/ML advancements, MongoDB developments, hackathons, and Google releases, prioritized based on your interests.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Filter className="w-4 h-4 text-cyber-purple" />
          <span>Category Filter:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                filterCategory === cat
                  ? 'bg-gradient-to-r from-cyber-purple to-cyber-pink text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Stream of Inshorts cards */}
      <div className="space-y-6 max-w-2xl mx-auto">
        {sortedAndFilteredNews.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center border border-white/5">
            <p className="text-slate-400 text-xs">No articles matching your criteria are available.</p>
          </div>
        ) : (
          sortedAndFilteredNews.map((news) => {
            const isLiked = likedIds.includes(news.id);
            const isBookmarked = bookmarkedIds.includes(news.id);
            
            return (
              <div 
                key={news.id} 
                className="glass-panel rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden flex flex-col justify-between p-5 relative shadow-lg"
              >
                {/* Recommended Tag */}
                {news.isRecommended && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-cyber-purple/20 border border-cyber-purple/40 text-[9px] font-bold text-cyber-cyan px-2 py-0.5 rounded-full select-none shadow-sm animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    <span>RECOMMENDED</span>
                  </div>
                )}

                {/* Card Content */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-bold text-cyber-pink uppercase tracking-wider">
                      #{news.tag}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {news.time}
                    </span>
                  </div>

                  <h3 className="text-base font-display font-bold text-white leading-snug">
                    {news.title}
                  </h3>

                  <p className="text-[12.5px] text-slate-300 leading-relaxed font-sans font-medium">
                    {news.summary}
                  </p>
                </div>

                {/* Card Footer actions */}
                <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between flex-wrap gap-2 text-[10px] text-slate-500">
                  <div className="flex items-center gap-1 font-medium">
                    <span>By <span className="text-slate-300">@{news.author}</span></span>
                    <span>•</span>
                    <span>via <span className="text-cyber-cyan font-bold">{news.source}</span></span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Thumbs Up (Like) */}
                    <button 
                      onClick={() => handleLike(news.id)}
                      className={`flex items-center gap-1 hover:text-green-400 transition-colors ${
                        isLiked ? 'text-green-400 font-bold' : ''
                      }`}
                      title="Like and recommend similar categories"
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-green-400/25' : ''}`} />
                      <span>{isLiked ? 'Liked' : 'Like'}</span>
                    </button>

                    {/* Thumbs Down (Dislike/Hide) */}
                    <button 
                      onClick={() => handleDislike(news.id)}
                      className="flex items-center gap-1 hover:text-red-400 transition-colors"
                      title="Dislike and filter from feed"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </button>

                    {/* Bookmark */}
                    <button 
                      onClick={() => handleBookmark(news.id)}
                      className={`flex items-center gap-1 hover:text-cyber-cyan transition-colors ${
                        isBookmarked ? 'text-cyber-cyan font-bold' : ''
                      }`}
                      title="Bookmark article"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-cyber-cyan/25 text-cyber-cyan' : ''}`} />
                      <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                    </button>

                    {/* External source Link */}
                    <a 
                      href={news.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span>Visit</span>
                    </a>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
