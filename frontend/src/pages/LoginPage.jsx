import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, clearError } from '../redux/slices/authSlice';
import { AuthAPI } from '../services/api';
import { Waypoints, Key, User, ArrowRight, AlertCircle, X } from 'lucide-react';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;

    dispatch(loginStart());
    try {
      const data = await AuthAPI.login(username, password);
      dispatch(loginSuccess({ token: data.token, user: data.user }));
      navigate('/dashboard');
    } catch (err) {
      dispatch(loginFailure(err.message || 'Login failed.'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6">
      
      {/* Background ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyber-purple/10 rounded-full blur-[80px] animate-glow"></div>

      <div className="max-w-md w-full glass-panel p-8 rounded-2xl relative z-10">
        
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <Link to="/" className="p-3 bg-gradient-to-tr from-cyber-purple to-cyber-pink rounded-2xl shadow-glow-purple">
            <Waypoints className="w-8 h-8 text-white" />
          </Link>
          <h2 className="font-display font-bold text-2xl text-white">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-xs">
            Sign in to continue your career bridging path
          </p>
        </div>

        {/* Error Popup Modal */}
        {error && (
          <div className="fixed inset-0 bg-[#03001e]/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
            <div className="max-w-sm w-full glass-panel border-l-4 border-red-500 rounded-2xl p-6 relative flex flex-col items-center text-center shadow-glow-purple animate-float">
              
              <button 
                onClick={() => dispatch(clearError())}
                type="button"
                className="absolute top-3 right-3 text-slate-400 hover:text-white hover:bg-white/5 p-1.5 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-3 bg-red-500/10 rounded-full text-red-500 mb-4 border border-red-500/20">
                <AlertCircle className="w-8 h-8 animate-pulse" />
              </div>

              <h3 className="font-display font-bold text-base text-white mb-2">
                Authentication Failed
              </h3>
              
              <p className="text-slate-300 text-xs leading-relaxed mb-6">
                {error}
              </p>

              <button
                onClick={() => dispatch(clearError())}
                type="button"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 font-bold text-xs text-white shadow-glow-purple hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass-input text-sm"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <Key className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass-input text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 mt-4 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-pink font-bold text-sm text-white hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all shadow-glow-purple"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          <span>Don't have an account? </span>
          <Link to="/signup" className="text-cyber-cyan hover:underline font-semibold">
            Sign Up
          </Link>
        </div>

      </div>
    </div>
  );
}
