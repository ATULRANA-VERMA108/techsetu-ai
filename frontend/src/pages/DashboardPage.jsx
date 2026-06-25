import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/common/Header.jsx';
import { BlogAPI, ProjectAPI, RoadmapAPI } from '../services/api';
import { 
  Trophy, 
  BookOpen, 
  Heart, 
  MessageSquare, 
  Send, 
  PlusCircle, 
  Compass, 
  ArrowRight,
  TrendingUp,
  UserPlus
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useSelector(state => state.auth);
  
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [commentInputs, setCommentInputs] = useState({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const blogData = await BlogAPI.getAll();
      setBlogs(blogData || []);
      const projData = await ProjectAPI.getAll();
      setProjects(projData || []);
      const roadmapData = await RoadmapAPI.getActive();
      if (roadmapData && !roadmapData.message) {
        setRoadmap(roadmapData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    if (!newBlogTitle.trim() || !newBlogContent.trim()) return;
    try {
      await BlogAPI.create(newBlogTitle, newBlogContent);
      setNewBlogTitle('');
      setNewBlogContent('');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (blogId) => {
    try {
      await BlogAPI.like(blogId);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (blogId, e) => {
    e.preventDefault();
    const commentText = commentInputs[blogId];
    if (!commentText || !commentText.trim()) return;

    try {
      await BlogAPI.addComment(blogId, commentText);
      setCommentInputs(prev => ({ ...prev, [blogId]: '' }));
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentChange = (blogId, val) => {
    setCommentInputs(prev => ({
      ...prev,
      [blogId]: val
    }));
  };

  const completedMilestones = roadmap?.milestones?.filter(m => m.completed)?.length || 0;
  const totalMilestones = roadmap?.milestones?.length || 0;
  const progressPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return (
    <div className="min-h-screen">
      <Header title="TechSetu Cockpit" />

      {/* Welcome Banner */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden bg-gradient-to-r from-cyber-purple/20 via-cyber-pink/5 to-transparent border-l-4 border-cyber-purple mt-4 mb-6">
        <h3 className="font-display font-bold text-xl text-white mb-2">
          Welcome back, {user?.username}! 🌉
        </h3>
        <p className="text-slate-300 text-xs max-w-lg leading-relaxed mb-4">
          Access your personal career bridge. Run skill gap analyses, check learning roadmaps, manage project tasks, or talk to the AI Sandbox.
        </p>
        {!user?.targetRole ? (
          <Link 
            to="/analyzer" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-pink font-bold text-xs text-white"
          >
            <span>Analyze Your Skill Gaps</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <div className="flex gap-4 text-xs font-semibold text-cyber-cyan hover:underline">
            <Link to="/roadmap" className="flex items-center gap-1">
              <span>View Learning Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Dev Blog Feed & Share Insights (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Post New Blog Form */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-display font-bold text-xs text-white mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-cyber-cyan" />
              <span>Share Insights (Publish Post)</span>
            </h3>
            <form onSubmit={handleCreateBlog} className="flex flex-col gap-3">
              <input
                type="text"
                value={newBlogTitle}
                onChange={(e) => setNewBlogTitle(e.target.value)}
                placeholder="Article title..."
                className="glass-input p-3 text-xs"
                required
              />
              <textarea
                value={newBlogContent}
                onChange={(e) => setNewBlogContent(e.target.value)}
                rows={3}
                placeholder="What did you learn or debug today? Share code snippets..."
                className="glass-input p-3 text-xs resize-none"
                required
              />
              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-pink text-xs font-bold text-white shadow-sm self-end"
              >
                Publish insights
              </button>
            </form>
          </div>

          {/* Dev Blog Feed List */}
          <div className="flex flex-col gap-6">
            <h3 className="font-display font-bold text-xs text-white border-b border-white/5 pb-2">
              TechSetu AI Feed
            </h3>
            {loading ? (
              <p className="text-xs text-slate-500">Loading feed updates...</p>
            ) : blogs.length === 0 ? (
              <p className="text-xs text-slate-500">No feed items found.</p>
            ) : (
              blogs.map((blog) => (
                <div key={blog.id} className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
                  <div>
                    <h4 className="font-display font-bold text-xs text-white">{blog.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Posted by <span className="text-cyber-cyan">@{blog.author}</span> • {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {blog.content}
                  </p>

                  <div className="flex items-center gap-6 border-t border-b border-white/5 py-2">
                    <button
                      onClick={() => handleLike(blog.id)}
                      className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>{blog.likes} Likes</span>
                    </button>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{blog.comments.length} Comments</span>
                    </span>
                  </div>

                  {blog.comments.length > 0 && (
                    <div className="flex flex-col gap-2 pl-4 border-l border-white/5">
                      {blog.comments.map((c) => (
                        <div key={c.id} className="text-[10px] text-slate-300">
                          <span className="text-cyber-purple font-semibold">@{c.author}: </span>
                          <span>{c.content}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={(e) => handleCommentSubmit(blog.id, e)} className="flex gap-2">
                    <input
                      type="text"
                      value={commentInputs[blog.id] || ''}
                      onChange={(e) => handleCommentChange(blog.id, e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 glass-input px-3 py-2 text-[10px]"
                      required
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </form>

                </div>
              ))
            )}
          </div>

        </div>

        {/* Right Side: KPIs, Roadmaps, and Connections (1 col) */}
        <div className="flex flex-col gap-6">
          
          {/* Target Role & Bridge Score Gauge */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
            <h4 className="font-display font-bold text-white text-xs mb-4">Goal Profile</h4>
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="50" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                <circle cx="64" cy="64" r="50" stroke="#7f00ff" strokeWidth="6" fill="transparent"
                  strokeDasharray={314}
                  strokeDashoffset={314 - (314 * (user?.bridgeScore || 0)) / 100}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-extrabold text-white">{user?.bridgeScore || 0}%</span>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">Bridge</span>
              </div>
            </div>
            <h5 className="text-xs font-semibold text-white truncate max-w-full">
              {user?.targetRole || 'Not Selected'}
            </h5>
            <p className="text-[10px] text-slate-400 mt-0.5">Target Job Goal</p>
          </div>

          {/* Active Roadmap Timeline Snippet */}
          {roadmap && (
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-display font-bold text-white text-xs">Roadmap Progress</h4>
                <span className="text-[10px] text-cyber-cyan font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 mb-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyber-purple to-cyber-cyan h-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="flex flex-col gap-2.5">
                {roadmap.milestones.slice(0, 2).map((m) => (
                  <div key={m.title} className="flex items-center justify-between p-2.5 bg-white/3 border border-white/5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${m.completed ? 'bg-emerald-500' : 'bg-slate-600 animate-pulse'}`}></span>
                      <span className="text-[10px] text-white truncate max-w-[120px]">{m.title}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-semibold">{m.durationHours} hrs</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User recommendations */}
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
              <TrendingUp className="w-4 h-4 text-cyber-cyan" />
              <h4 className="font-display font-bold text-white text-xs">Collaborators recommendation</h4>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-2.5 bg-white/3 border border-white/5 rounded-xl text-left">
                <div>
                  <p className="text-xs font-semibold text-white">Rohit Verma</p>
                  <p className="text-[9px] text-slate-400">Kubernetes Administrator</p>
                </div>
                <UserPlus className="w-4 h-4 text-cyber-cyan cursor-pointer" />
              </div>
              <div className="flex items-center justify-between p-2.5 bg-white/3 border border-white/5 rounded-xl text-left">
                <div>
                  <p className="text-xs font-semibold text-white">Aditi Sen</p>
                  <p className="text-[9px] text-slate-400">React Developer (62% Bridge)</p>
                </div>
                <UserPlus className="w-4 h-4 text-cyber-cyan cursor-pointer" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
