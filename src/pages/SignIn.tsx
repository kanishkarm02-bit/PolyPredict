import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Zap, TrendingUp, TrendingDown, Activity, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [humanVerified, setHumanVerified] = useState(false);
  const [captchaFailed, setCaptchaFailed] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleCaptcha = (type: string) => {
    setSelectedIcon(type);
    if (type === 'up') {
      setHumanVerified(true);
      setCaptchaFailed(false);
    } else {
      setHumanVerified(false);
      setCaptchaFailed(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanVerified) {
       setCaptchaFailed(true);
       return;
    }
    login(email);
    navigate('/get-started');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 font-sans text-slate-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/60 border border-slate-800/60 rounded-2xl p-8 shadow-2xl shadow-black/40 backdrop-blur-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 mb-4">
            <Zap className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Create Account</h1>
          <p className="text-sm text-slate-500 uppercase tracking-widest mt-1 font-mono">Market smarter, not harder.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-medium">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors text-slate-200"
              placeholder="quant@polypredict.io"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-medium">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors text-slate-200"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-4 border-t border-slate-800/60">
            <label className="text-xs text-slate-500 uppercase font-medium mb-3 block flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Human Verification
            </label>
            <p className="text-sm text-slate-400 mb-3">Please select the <strong className="text-emerald-400">Bullish (Upward)</strong> chart icon to verify you are human.</p>
            
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleCaptcha('activity')}
                className={cn(
                  "p-4 rounded-xl border flex items-center justify-center transition-all",
                  selectedIcon === 'activity' ? "bg-slate-800 border-slate-600" : "bg-slate-950/50 border-slate-800 hover:border-slate-700"
                )}
              >
                <Activity className="w-6 h-6 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => handleCaptcha('up')}
                className={cn(
                  "p-4 rounded-xl border flex items-center justify-center transition-all",
                  selectedIcon === 'up' ? "bg-emerald-500/10 border-emerald-500/50" : "bg-slate-950/50 border-slate-800 hover:border-slate-700"
                )}
              >
                <TrendingUp className={cn("w-6 h-6", selectedIcon === 'up' ? "text-emerald-400" : "text-slate-400")} />
              </button>
              <button
                type="button"
                onClick={() => handleCaptcha('down')}
                className={cn(
                  "p-4 rounded-xl border flex items-center justify-center transition-all",
                  selectedIcon === 'down' ? "bg-rose-500/10 border-rose-500/50" : "bg-slate-950/50 border-slate-800 hover:border-slate-700"
                )}
              >
                <TrendingDown className={cn("w-6 h-6", selectedIcon === 'down' ? "text-rose-400" : "text-slate-400")} />
              </button>
            </div>
            
            {captchaFailed && (
              <div className="mt-3 flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20">
                <ShieldAlert className="w-4 h-4" /> Verification failed. Please select the correct icon.
              </div>
            )}
            {humanVerified && (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" /> Verification successful.
              </div>
            )}
          </div>

          <button 
            type="submit"
            className="w-full mt-6 bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 rounded-lg transition-colors text-sm uppercase tracking-wider shadow-lg shadow-indigo-500/20"
          >
            Create Account
          </button>
        </form>
      </motion.div>
    </div>
  );
}
