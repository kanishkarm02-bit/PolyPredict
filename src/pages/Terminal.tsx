import React, { useState, useEffect } from 'react';
import { Activity, Zap, ShieldAlert, Cpu, Database, Play, X, Check } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Terminal() {
  const { bankroll, executeTrade } = useAppContext();
  const location = useLocation();
  
  const [marketId, setMarketId] = useState('POLY-BTC-150K-2026');
  const [pMkt, setPMkt] = useState<number>(0.45);
  const [pFair, setPFair] = useState<number>(0.55);
  const [rationale, setRationale] = useState('Historical volatility suggests underpricing of tail events.');
  const [riskFactors, setRiskFactors] = useState('Macroeconomic shifts, regulatory news');
  
  const [context, setContext] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisFormat, setAnalysisFormat] = useState('Standard');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Initialize from navigation state if available
  useEffect(() => {
    if (location.state) {
      if (location.state.marketId) setMarketId(location.state.marketId);
      if (location.state.pMkt !== undefined) setPMkt(location.state.pMkt);
    }
  }, [location.state]);

  // --- Calculation Logic ---
  const edge = pFair - pMkt;
  const absEdge = Math.abs(edge);
  const isTradeable = absEdge > 0.05;

  let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  let kellyFraction = 0;

  if (isTradeable) {
    if (edge > 0) {
      signal = 'BUY'; // Buy YES
      kellyFraction = (pFair - pMkt) / (1 - pMkt);
    } else {
      signal = 'SELL'; // Buy NO (Short YES)
      kellyFraction = (pMkt - pFair) / pMkt;
    }
  }

  // Conservative Kelly (0.1x multiplier)
  const consKelly = kellyFraction * 0.1;
  const suggestedSize = bankroll * consKelly;

  const outputJson = {
    signal,
    market_id: marketId,
    confidence_score: Number(pFair.toFixed(3)),
    suggested_size_usdc: Number(suggestedSize.toFixed(2)),
    rationale_short: rationale,
    risk_factors: riskFactors.split(',').map(s => s.trim()).filter(Boolean)
  };

  // --- AI Analysis Logic ---
  const handleAnalyze = async () => {
    if (!context.trim()) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
        You are a High-Frequency Strategic Quant (HFSQ).
        Analyze the following market context and determine the Fair Probability (0.0 to 1.0) of the event occurring.
        Also provide a rationale and a comma-separated list of risk factors.
        
        Requested Output Format: ${analysisFormat}. 
        ${analysisFormat === 'Detailed Rationale' ? 'Provide an in-depth, multi-paragraph rationale.' : 
          analysisFormat === 'Data-Heavy' ? 'Focus heavily on statistics, numbers, and quantitative data in the rationale.' : 
          'Keep the rationale concise and to the point.'}

        Market Context:
        ${context}

        Respond strictly in JSON format:
        {
          "p_fair": 0.65,
          "rationale": "Strong momentum in recent data.",
          "risk_factors": "Data error, late-breaking news"
        }
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      if (response.text) {
        const result = JSON.parse(response.text);
        if (result.p_fair !== undefined) setPFair(result.p_fair);
        if (result.rationale) setRationale(result.rationale);
        if (result.risk_factors) setRiskFactors(result.risk_factors);
      }
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExecuteClick = () => {
    if (!isTradeable || suggestedSize <= 0) return;
    setShowConfirmModal(true);
  };

  const confirmTrade = () => {
    const side = signal === 'BUY' ? 'YES' : 'NO';
    const price = side === 'YES' ? pMkt : (1 - pMkt);
    executeTrade(marketId, `Market: ${marketId}`, side, suggestedSize, price);
    setShowConfirmModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* Left Column: Inputs */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="xl:col-span-7 space-y-6"
      >
        {/* Market Parameters */}
        <section className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-2 mb-6">
            <Database className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Market Parameters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase font-medium">Market ID</label>
              <input 
                type="text" 
                value={marketId}
                onChange={(e) => setMarketId(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase font-medium">Bankroll (USDC)</label>
              <input 
                type="number" 
                value={bankroll.toFixed(2)}
                readOnly
                className="w-full bg-slate-950/20 border border-slate-800/50 rounded-lg px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase font-medium">Market Price (P_mkt)</label>
              <input 
                type="number" 
                step="0.01"
                min="0" max="1"
                value={pMkt}
                onChange={(e) => setPMkt(Number(e.target.value))}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase font-medium">Fair Probability (P_fair)</label>
              <input 
                type="number" 
                step="0.01"
                min="0" max="1"
                value={pFair}
                onChange={(e) => setPFair(Number(e.target.value))}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
          </div>
        </section>

        {/* AI Context Analysis */}
        <section className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 shadow-xl shadow-black/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Context Ingestion</h2>
            </div>
            <span className="text-[10px] text-slate-500 border border-slate-800 px-2 py-1 rounded bg-slate-950/50">Up to 2M Tokens</span>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase font-medium">Analysis Format</label>
              <select 
                value={analysisFormat}
                onChange={(e) => setAnalysisFormat(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors text-slate-200"
              >
                <option value="Standard">Standard (Concise)</option>
                <option value="Detailed Rationale">Detailed Rationale</option>
                <option value="Data-Heavy">Data-Heavy (Quantitative)</option>
              </select>
            </div>
            <textarea 
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Paste news feeds, order book data, or historical regime context here for AI analysis..."
              className="w-full h-32 bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
            />
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !context.trim()}
              className="w-full flex items-center justify-center gap-2 bg-indigo-500 text-white hover:bg-indigo-400 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed font-bold py-2.5 rounded-lg transition-colors text-sm uppercase tracking-wider shadow-lg shadow-indigo-500/20 disabled:shadow-none"
            >
              {isAnalyzing ? (
                <span className="animate-pulse">Processing Data...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Analyze Context
                </>
              )}
            </button>
          </div>
        </section>

        {/* Manual Rationale Overrides */}
        <section className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 shadow-xl shadow-black/20">
           <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase font-medium">Rationale</label>
              <input 
                type="text" 
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase font-medium">Risk Factors (Comma separated)</label>
              <input 
                type="text" 
                value={riskFactors}
                onChange={(e) => setRiskFactors(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
          </div>
        </section>

      </motion.div>

      {/* Right Column: Output & Execution */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="xl:col-span-5 space-y-6"
      >
        
        {/* Metrics Dashboard */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`bg-slate-900/40 border rounded-xl p-5 shadow-xl shadow-black/20 transition-colors ${absEdge > 0.05 ? 'border-emerald-500/50' : 'border-slate-800/60'}`}>
            <div className="text-xs text-slate-500 uppercase mb-1 font-medium">Calculated Edge</div>
            <div className={`text-3xl font-bold ${absEdge > 0.05 ? 'text-emerald-400' : 'text-slate-400'}`}>
              {(edge * 100).toFixed(1)}%
            </div>
            <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden relative">
              {/* 5% Threshold Marker */}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-600 z-10" />
              <div 
                className={`h-full rounded-full transition-all duration-500 ${absEdge > 0.05 ? 'bg-emerald-500' : 'bg-slate-500'}`} 
                style={{ width: `${Math.min((absEdge / 0.1) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="text-[10px] text-slate-600">0%</div>
              <div className="text-[10px] text-slate-500 font-medium">Threshold: 5.0%</div>
              <div className="text-[10px] text-slate-600">10%+</div>
            </div>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 shadow-xl shadow-black/20">
            <div className="text-xs text-slate-500 uppercase mb-1 font-medium">Cons. Kelly (0.1x)</div>
            <div className="text-3xl font-bold text-slate-100">
              {(consKelly * 100).toFixed(2)}%
            </div>
            <div className="text-[10px] text-slate-600 mt-2">Position Sizing</div>
          </div>
        </div>

        {/* Execution Signal */}
        <section className={`bg-slate-950/80 border rounded-xl overflow-hidden flex flex-col h-[calc(100%-130px)] min-h-[450px] shadow-xl shadow-black/20 relative transition-colors duration-300 ${
          signal === 'BUY' ? 'border-emerald-500/30' : 
          signal === 'SELL' ? 'border-rose-500/30' : 
          'border-slate-800/60'
        }`}>
          {/* Subtle glow effect behind the terminal */}
          <div className={`absolute inset-0 blur-[100px] pointer-events-none transition-colors duration-500 ${
            signal === 'BUY' ? 'bg-emerald-500/5' : 
            signal === 'SELL' ? 'bg-rose-500/5' : 
            'bg-slate-500/5'
          }`} />
          
          <div className="bg-slate-900/80 border-b border-slate-800/60 px-5 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Execution Payload</h2>
            </div>
            <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
              signal === 'BUY' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
              signal === 'SELL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 
              'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {signal} SIGNAL
            </div>
          </div>
          
          <div className="p-5 flex-1 overflow-auto z-10">
            {!isTradeable && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-5 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3"
              >
                <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-500/90 leading-relaxed">
                  Edge (|{edge.toFixed(3)}|) is below the 0.05 threshold. Trade execution is not recommended. Signal set to HOLD.
                </p>
              </motion.div>
            )}
            
            <div className="space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/50 border border-slate-800/60 rounded-lg p-4">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Confidence Score</div>
                  <div className="text-2xl font-bold text-slate-200">{(pFair * 100).toFixed(1)}%</div>
                </div>
                <div className="bg-slate-950/50 border border-slate-800/60 rounded-lg p-4">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Suggested Size</div>
                  <div className="text-2xl font-bold text-slate-200">${suggestedSize.toFixed(2)}</div>
                </div>
              </div>

              {/* Rationale & Risks */}
              <div className="space-y-4">
                <div className="bg-slate-950/50 border border-slate-800/60 rounded-lg p-4">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Rationale</div>
                  <p className="text-sm text-slate-300 leading-relaxed">{rationale}</p>
                </div>
                
                <div className="bg-slate-950/50 border border-slate-800/60 rounded-lg p-4">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Risk Factors</div>
                  <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                    {riskFactors.split(',').map((risk, i) => risk.trim() ? (
                      <li key={i}>{risk.trim()}</li>
                    ) : null)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-5 border-t border-slate-800/60 bg-slate-900/50 z-10">
            <button 
              onClick={handleExecuteClick}
              disabled={!isTradeable || suggestedSize <= 0}
              className={`w-full flex items-center justify-center gap-2 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3.5 rounded-lg transition-colors text-sm uppercase tracking-wider shadow-lg disabled:shadow-none ${
                signal === 'BUY' ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20 text-black' : 
                signal === 'SELL' ? 'bg-rose-500 hover:bg-rose-400 shadow-rose-500/20 text-black' : 
                'bg-slate-700 hover:bg-slate-600 shadow-slate-500/20'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              Execute Trade
            </button>
          </div>
        </section>

      </motion.div>

      {/* Trade Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                Confirm Execution
              </h3>
              <button onClick={() => setShowConfirmModal(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Market</span>
                  <span className="text-sm font-bold text-slate-200">{marketId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Side</span>
                  <span className={`text-sm font-bold px-2 py-0.5 rounded ${signal === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {signal === 'BUY' ? 'YES' : 'NO'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Size (USDC)</span>
                  <span className="text-sm font-bold text-slate-200">${suggestedSize.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Execution Price</span>
                  <span className="text-sm font-bold text-slate-200">${(signal === 'BUY' ? pMkt : (1 - pMkt)).toFixed(2)}</span>
                </div>
              </div>
              
              <p className="text-xs text-slate-400 text-center">
                Please review the trade details carefully. This action cannot be undone.
              </p>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg font-bold text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmTrade}
                className="flex-1 px-4 py-2.5 rounded-lg font-bold text-sm text-black bg-emerald-500 hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Confirm Trade
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
