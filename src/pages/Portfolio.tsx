import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import { ArrowUpRight, DollarSign, Percent, Activity, X, Lock } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppContext } from '../context/AppContext';

export default function Portfolio() {
  const { bankroll, stakedBalance, positions, portfolioHistory, tradeHistory, closePosition, stake, unstake } = useAppContext();
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  // Calculate Portfolio Metrics
  const totalPositionValue = positions.reduce((acc, pos) => acc + (pos.shares * pos.currentPrice), 0);
  const totalValue = bankroll + stakedBalance + totalPositionValue;
  
  const totalInvested = positions.reduce((acc, pos) => acc + pos.sizeUsdc, 0);
  const openRiskPercent = totalValue > 0 ? ((totalInvested / totalValue) * 100).toFixed(1) : '0.0';
  
  // Calculate total PnL
  const startingBankroll = 10000;
  const totalPnL = totalValue - startingBankroll;
  const totalPnLPercent = ((totalPnL / startingBankroll) * 100).toFixed(2);
  const isPositivePnL = totalPnL >= 0;

  // Win rate (mocked for now since we don't track resolved trades yet)
  const winRate = positions.length > 0 ? "N/A" : "0.0%";

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Portfolio Performance</h2>
        <p className="text-sm text-slate-500 mt-1">Real-time PnL and active positions tracking.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-2 text-slate-500 mb-3 text-sm uppercase tracking-wider font-medium">
            <DollarSign className="w-4 h-4" /> Total Value
          </div>
          <div className="text-3xl font-bold text-slate-100 tracking-tight">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className={cn("text-xs mt-3 flex items-center gap-1 font-medium w-fit px-2 py-1 rounded-md border", 
            isPositivePnL ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-rose-400 bg-rose-500/10 border-rose-500/20"
          )}>
            <ArrowUpRight className={cn("w-3 h-3", !isPositivePnL && "rotate-180")} /> 
            {isPositivePnL ? '+' : '-'}${Math.abs(totalPnL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({totalPnLPercent}%) All Time
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-2 text-slate-500 mb-3 text-sm uppercase tracking-wider font-medium">
            <Percent className="w-4 h-4" /> Win Rate
          </div>
          <div className="text-3xl font-bold text-slate-100 tracking-tight">{winRate}</div>
          <div className="text-slate-500 text-xs mt-3 font-medium">Based on resolved trades</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-2 text-slate-500 mb-3 text-sm uppercase tracking-wider font-medium">
            <Activity className="w-4 h-4" /> Open Risk
          </div>
          <div className="text-3xl font-bold text-slate-100 tracking-tight">${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-slate-500 text-xs mt-3 font-medium">{openRiskPercent}% of Portfolio</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-2 text-slate-500 mb-3 text-sm uppercase tracking-wider font-medium">
            <Lock className="w-4 h-4" /> Staked
          </div>
          <div className="text-3xl font-bold text-indigo-400 tracking-tight">${stakedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-slate-500 text-xs mt-3 font-medium">Earning 8.5% APY</div>
        </motion.div>
      </div>

      {/* Staking Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 shadow-xl shadow-black/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">USDC Staking</h3>
            <p className="text-xs text-slate-500 mt-1">Stake your unused USDC to earn a portion of platform trading fees.</p>
          </div>
          <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 font-bold text-sm">
            8.5% APY
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-xs text-slate-500 uppercase font-medium flex justify-between">
              <span>Stake USDC</span>
              <span>Available: ${bankroll.toFixed(2)}</span>
            </label>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors text-slate-200"
              />
              <button 
                onClick={() => {
                  const amt = parseFloat(stakeAmount);
                  if (!isNaN(amt)) {
                    stake(amt);
                    setStakeAmount('');
                  }
                }}
                disabled={!stakeAmount || isNaN(parseFloat(stakeAmount)) || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > bankroll}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-lg transition-colors text-sm"
              >
                Stake
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs text-slate-500 uppercase font-medium flex justify-between">
              <span>Unstake USDC</span>
              <span>Staked: ${stakedBalance.toFixed(2)}</span>
            </label>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors text-slate-200"
              />
              <button 
                onClick={() => {
                  const amt = parseFloat(unstakeAmount);
                  if (!isNaN(amt)) {
                    unstake(amt);
                    setUnstakeAmount('');
                  }
                }}
                disabled={!unstakeAmount || isNaN(parseFloat(unstakeAmount)) || parseFloat(unstakeAmount) <= 0 || parseFloat(unstakeAmount) > stakedBalance}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-lg transition-colors text-sm"
              >
                Unstake
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 h-[450px] shadow-xl shadow-black/20 flex flex-col">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-6">Equity Curve (Intraday)</h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={portfolioHistory} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="time" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} domain={['dataMin - 100', 'dataMax + 100']} dx={-10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid #1E293B', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
              />
              <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Active Positions Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-slate-900/40 border border-slate-800/60 rounded-xl overflow-hidden shadow-xl shadow-black/20">
        <div className="px-6 py-5 border-b border-slate-800/60 bg-slate-950/50">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Active Positions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-900/50 border-b border-slate-800/60">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Market ID</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Side</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Size (USDC)</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Avg Price</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Current Price</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Unrealized PnL</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {positions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 font-medium">
                    No active positions. Execute a trade in the Terminal to get started.
                  </td>
                </tr>
              ) : (
                positions.map((pos) => {
                  const pnlValue = (pos.currentPrice - pos.avgPrice) * pos.shares;
                  const pnlPercent = ((pos.currentPrice - pos.avgPrice) / pos.avgPrice) * 100;
                  const isPosPnL = pnlValue >= 0;
                  const pnlString = `${isPosPnL ? '+' : '-'}$${Math.abs(pnlValue).toFixed(2)} (${isPosPnL ? '+' : ''}${pnlPercent.toFixed(1)}%)`;
                  
                  return (
                    <tr key={pos.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-5 font-medium text-slate-200">{pos.marketId}</td>
                      <td className="px-6 py-5">
                        <span className={cn("px-2.5 py-1 rounded text-[10px] font-bold tracking-wider border", pos.side === 'YES' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20')}>
                          {pos.side}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-slate-300 font-medium">${pos.sizeUsdc.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-6 py-5 text-slate-400">{pos.avgPrice.toFixed(2)}</td>
                      <td className="px-6 py-5 text-slate-300">{pos.currentPrice.toFixed(2)}</td>
                      <td className={cn("px-6 py-5 text-right font-bold", isPosPnL ? 'text-emerald-400' : 'text-rose-400')}>
                        {pnlString}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => closePosition(pos.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                          title="Close Position"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Trade History Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-slate-900/40 border border-slate-800/60 rounded-xl overflow-hidden shadow-xl shadow-black/20">
        <div className="px-6 py-5 border-b border-slate-800/60 bg-slate-950/50">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Trade History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-900/50 border-b border-slate-800/60">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Time</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Market ID</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Action</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Side</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Size (USDC)</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Shares</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {tradeHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 font-medium">
                    No trade history available.
                  </td>
                </tr>
              ) : (
                tradeHistory.map((trade) => (
                  <tr key={trade.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-5 text-slate-400">{trade.time}</td>
                    <td className="px-6 py-5 font-medium text-slate-200">{trade.marketId}</td>
                    <td className="px-6 py-5">
                      <span className={cn("px-2.5 py-1 rounded text-[10px] font-bold tracking-wider border", trade.action === 'BUY' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20')}>
                        {trade.action}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn("px-2.5 py-1 rounded text-[10px] font-bold tracking-wider border", trade.side === 'YES' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20')}>
                        {trade.side}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-300 font-medium">${trade.sizeUsdc.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-6 py-5 text-slate-400">{trade.shares.toFixed(2)}</td>
                    <td className="px-6 py-5 text-right text-slate-300 font-medium">{trade.price.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
