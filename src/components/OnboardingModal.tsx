import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Activity, PieChart, GraduationCap, X, Rocket } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function OnboardingModal() {
  const { hasSeenOnboarding, completeOnboarding, isAuthenticated } = useAppContext();

  if (hasSeenOnboarding || !isAuthenticated) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-indigo-500/10"
        >
          <div className="p-6 border-b border-slate-800/60 bg-slate-900/50 flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                <Rocket className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">Welcome to EdgeTrade</h2>
                <p className="text-sm text-slate-500">Your high-frequency strategic quant terminal.</p>
              </div>
            </div>
            <button onClick={completeOnboarding} className="text-slate-500 hover:text-slate-300 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <p className="text-slate-300 leading-relaxed">
              EdgeTrade is designed to give you a statistical advantage in on-chain prediction markets. Here is a quick guide to what you can do:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl flex gap-4">
                <Activity className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-200 mb-1">Live Markets</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Scan real-time order book data from Polymarket and Kalshi. Click any market to view historical performance and sentiment.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl flex gap-4">
                <Terminal className="w-6 h-6 text-indigo-400 shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-200 mb-1">Execution Terminal</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Use our AI-powered engine to calculate your edge, determine Kelly criterion sizing, and execute trades with precision.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl flex gap-4">
                <PieChart className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-200 mb-1">Portfolio & PnL</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Track your active positions, view your equity curve, and analyze your trade history in real-time.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl flex gap-4">
                <GraduationCap className="w-6 h-6 text-rose-400 shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-200 mb-1">Quant Academy</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Learn the math behind the trades. Read articles on Expected Value, Kelly Criterion, and take quizzes to test your knowledge.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-800/60 bg-slate-900/20 flex justify-end">
            <button 
              onClick={completeOnboarding}
              className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
            >
              Get Started
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
