import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Wallet, LineChart, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GetStarted() {
  const steps = [
    {
      icon: <Wallet className="w-6 h-6 text-indigo-400" />,
      title: '1. Fund Your Account',
      description: 'Connect your wallet or deposit USDC to start trading. EdgeTrade supports instant deposits via major networks.',
      color: 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
      icon: <LineChart className="w-6 h-6 text-emerald-400" />,
      title: '2. Analyze Markets',
      description: 'Browse live prediction markets. Use our AI-powered terminal to analyze context, calculate your edge, and determine Kelly criterion sizing.',
      color: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: '3. Execute Trades',
      description: 'Deploy capital with precision. Our execution payload system ensures you enter at the optimal probability threshold.',
      color: 'bg-amber-500/10 border-amber-500/20'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12">
      <div className="text-center space-y-4 mt-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mb-4"
        >
          <Rocket className="w-12 h-12 text-indigo-400" />
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-slate-100 tracking-tight"
        >
          Welcome to EdgeTrade
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-400 max-w-2xl mx-auto"
        >
          The premier high-frequency strategic quant terminal for on-chain prediction markets.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + (i * 0.1) }}
            className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8 relative overflow-hidden group hover:border-slate-700 transition-colors"
          >
            <div className={`inline-flex p-3 rounded-xl border mb-6 ${step.color}`}>
              {step.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-3">{step.title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 md:p-12 text-center mt-12 flex flex-col items-center"
      >
        <ShieldCheck className="w-12 h-12 text-emerald-400 mb-6" />
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Ready to find your edge?</h2>
        <p className="text-slate-400 mb-8 max-w-xl">
          Your account is verified and ready. Head over to the Live Markets to start scanning for opportunities, or jump straight into the Terminal.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/markets"
            className="px-8 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            View Live Markets <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/"
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-700"
          >
            Open Terminal
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
