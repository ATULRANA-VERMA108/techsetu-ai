import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
import { AuthAPI } from '../services/api';
import { Waypoints, User, Mail, Key, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) return;

    setLoading(true);
    setError(null);
    try {
      await AuthAPI.signup(username, email, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    dispatch(loginStart());
    try {
      const suffix = Math.floor(100 + Math.random() * 900);
      const email = `${provider.toLowerCase()}_user_${suffix}@techsetu.com`;
      const name = `${provider} User ${suffix}`;
      
      const data = await AuthAPI.socialLogin(provider, email, name);
      dispatch(loginSuccess({ token: data.token, user: data.user }));
      navigate('/dashboard');
    } catch (err) {
      dispatch(loginFailure(err.message || 'Social login failed.'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6">
      
      {/* Background ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyber-cyan/10 rounded-full blur-[80px] animate-glow"></div>

      <div className="max-w-md w-full glass-panel p-8 rounded-2xl relative z-10">
        
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <Link to="/" className="p-3 bg-gradient-to-tr from-cyber-purple to-cyber-pink rounded-2xl shadow-glow-purple">
            <Waypoints className="w-8 h-8 text-white" />
          </Link>
          <h2 className="font-display font-bold text-2xl text-white">
            Create Account
          </h2>
          <p className="text-slate-400 text-xs">
            Start building your career bridge to tech
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 text-xs mb-4 text-center font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg p-3 text-xs mb-4 text-center font-medium">
            Signup successful! Redirecting to login page...
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
                placeholder="Choose a username"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass-input text-sm"
                placeholder="Enter your email"
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
            disabled={loading || success}
            className="w-full flex items-center justify-center gap-2 py-3 mt-4 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-pink font-bold text-sm text-white hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all shadow-glow-purple"
          >
            <span>{loading ? 'Registering...' : 'Register'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Social Registration Options */}
        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-white/10"></div>
          <span className="px-3 text-slate-500 text-[9px] uppercase font-bold tracking-wider">Or Register With</span>
          <div className="flex-1 border-t border-white/10"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSocialLogin('Google')}
            type="button"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span className="text-red-400 font-extrabold text-xs">G</span>
            <span>Google</span>
          </button>
          <button
            onClick={() => handleSocialLogin('GitHub')}
            type="button"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span className="text-slate-300 font-extrabold text-xs">Git</span>
            <span>GitHub</span>
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          <span>Already have an account? </span>
          <Link to="/login" className="text-cyber-cyan hover:underline font-semibold">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
