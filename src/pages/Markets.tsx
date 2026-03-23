import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown, Clock, Users, X, BarChart2, Newspaper, Search, Activity, Pin, MessageSquare, Star, ExternalLink, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { generateMarket } from '../services/marketService';
import { toast } from 'sonner';

const INITIAL_MARKETS = [
  { id: 'POLY-BTC-150K-2026', title: 'Bitcoin to hit $150k in 2026?', yes: 0.35, no: 0.65, volume: '$14.2M', end: 'Dec 31, 2026', category: 'Crypto', articleUrl: 'https://www.coindesk.com/price/bitcoin/' },
  { id: 'KAL-FED-RATE-DEC', title: 'Fed Funds Rate < 3.0% by Dec 2026?', yes: 0.22, no: 0.78, volume: '$5.1M', end: 'Dec 18, 2026', category: 'Macro', articleUrl: 'https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm' },
  { id: 'POLY-GPT5-Q3', title: 'OpenAI releases GPT-5 by Q3 2026?', yes: 0.68, no: 0.32, volume: '$8.5M', end: 'Sep 30, 2026', category: 'Tech', articleUrl: 'https://openai.com/news/' },
  { id: 'POLY-US-MIDTERM-26', title: 'GOP wins House in 2026 Midterms?', yes: 0.54, no: 0.46, volume: '$22.4M', end: 'Nov 3, 2026', category: 'Politics', articleUrl: 'https://www.reuters.com/politics/' },
  { id: 'KAL-CPI-MAY', title: 'May 2026 CPI YoY > 2.5%?', yes: 0.41, no: 0.59, volume: '$1.2M', end: 'Jun 12, 2026', category: 'Macro', articleUrl: 'https://www.bls.gov/cpi/' },
  { id: 'POLY-SPX-6500', title: 'S&P 500 hits 6500 in 2026?', yes: 0.62, no: 0.38, volume: '$4.3M', end: 'Dec 31, 2026', category: 'Macro', articleUrl: 'https://www.bloomberg.com/markets/stocks' },
  { id: 'POLY-ETH-10K-2026', title: 'Ethereum to hit $10k in 2026?', yes: 0.28, no: 0.72, volume: '$8.1M', end: 'Dec 31, 2026', category: 'Crypto', articleUrl: 'https://www.coindesk.com/price/ethereum/' },
  { id: 'KAL-UNEMP-Q2', title: 'US Unemployment > 4.5% by Q2 2026?', yes: 0.33, no: 0.67, volume: '$2.8M', end: 'Jun 30, 2026', category: 'Macro', articleUrl: 'https://www.bls.gov/cps/' },
  { id: 'POLY-AGI-2027', title: 'AGI achieved by 2027?', yes: 0.15, no: 0.85, volume: '$12.5M', end: 'Dec 31, 2027', category: 'Tech', articleUrl: 'https://en.wikipedia.org/wiki/Artificial_general_intelligence' },
];

const generateMockChartData = (currentYes: number) => {
  const data = [];
  let val = currentYes * 100 - 20;
  for (let i = 0; i < 30; i++) {
    val += (Math.random() - 0.45) * 5;
    if (val > 99) val = 99;
    if (val < 1) val = 1;
    data.push({ day: `D-${30 - i}`, price: Number(val.toFixed(1)) });
  }
  data.push({ day: 'Today', price: Number((currentYes * 100).toFixed(1)) });
  return data;
};

export default function Markets() {
  const navigate = useNavigate();
  const { executeTrade, bankroll } = useAppContext();
  const [markets, setMarkets] = useState(INITIAL_MARKETS);
  const [selectedMarket, setSelectedMarket] = useState<typeof INITIAL_MARKETS[0] | null>(null);
  const [quickBet, setQuickBet] = useState<{ market: typeof INITIAL_MARKETS[0], side: 'YES' | 'NO' } | null>(null);
  const [betAmount, setBetAmount] = useState<string>('100');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeVolumeFilter, setActiveVolumeFilter] = useState('All');
  const [activeExpiryFilter, setActiveExpiryFilter] = useState('All');
  const [activeProbFilter, setActiveProbFilter] = useState('All');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [flashRows, setFlashRows] = useState<Record<string, 'up' | 'down' | null>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets(currentMarkets => {
        const newFlashRows: Record<string, 'up' | 'down' | null> = {};
        const updated = currentMarkets.map(m => {
          // 30% chance to update a market
          if (Math.random() > 0.3) return m;
          
          const change = (Math.random() - 0.5) * 0.04;
          let newYes = m.yes + change;
          if (newYes > 0.99) newYes = 0.99;
          if (newYes < 0.01) newYes = 0.01;
          
          newFlashRows[m.id] = change > 0 ? 'up' : 'down';
          return { ...m, yes: newYes, no: 1 - newYes };
        });
        
        setFlashRows(newFlashRows);
        setLastUpdate(new Date());
        
        // Clear flashes after 1s
        setTimeout(() => setFlashRows({}), 1000);
        
        return updated;
      });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = (market: typeof INITIAL_MARKETS[0]) => {
    navigate('/', { state: { marketId: market.id, pMkt: market.yes } });
  };

  const handleQuickBet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickBet) return;
    
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0 || amount > bankroll) return;

    const price = quickBet.side === 'YES' ? quickBet.market.yes : quickBet.market.no;
    executeTrade(quickBet.market.id, quickBet.market.title, quickBet.side, amount, price);
    setQuickBet(null);
    setBetAmount('100');
  };

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearchingAI(true);
    const toastId = toast.loading(`Researching "${searchQuery}"...`);
    try {
      const newMarketData = await generateMarket(searchQuery);
      
      const newMarket = {
        ...newMarketData,
        yes: newMarketData.yes,
        no: newMarketData.no,
      };
      
      setMarkets(prev => [newMarket, ...prev]);
      setSelectedMarket(newMarket);
      setSearchQuery('');
      toast.success('Market generated successfully!', { id: toastId });
    } catch (error) {
      console.error("Failed to generate market:", error);
      toast.error('Failed to research market. Please try again.', { id: toastId });
    } finally {
      setIsSearchingAI(false);
    }
  };

  const filteredMarkets = useMemo(() => {
    return markets.filter(market => {
      const matchesSearch = market.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            market.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || market.category === activeCategory;
      
      let matchesVolume = true;
      const volNum = parseFloat(market.volume.replace(/[^0-9.]/g, ''));
      if (activeVolumeFilter === '< $5M') matchesVolume = volNum < 5;
      else if (activeVolumeFilter === '$5M - $10M') matchesVolume = volNum >= 5 && volNum <= 10;
      else if (activeVolumeFilter === '> $10M') matchesVolume = volNum > 10;

      let matchesExpiry = true;
      const expiryDate = new Date(market.end);
      const now = new Date();
      const diffTime = Math.abs(expiryDate.getTime() - now.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (activeExpiryFilter === '< 30 Days') matchesExpiry = diffDays < 30;
      else if (activeExpiryFilter === '30-90 Days') matchesExpiry = diffDays >= 30 && diffDays <= 90;
      else if (activeExpiryFilter === '> 90 Days') matchesExpiry = diffDays > 90;

      let matchesProb = true;
      const yesProb = market.yes * 100;
      if (activeProbFilter === '< 25%') matchesProb = yesProb < 25;
      else if (activeProbFilter === '25% - 75%') matchesProb = yesProb >= 25 && yesProb <= 75;
      else if (activeProbFilter === '> 75%') matchesProb = yesProb > 75;

      return matchesSearch && matchesCategory && matchesVolume && matchesExpiry && matchesProb;
    });
  }, [markets, searchQuery, activeCategory, activeVolumeFilter, activeExpiryFilter, activeProbFilter]);

  const categories = ['All', 'Crypto', 'Macro', 'Politics', 'Tech'];
  const volumeFilters = ['All', '< $5M', '$5M - $10M', '> $10M'];
  const expiryFilters = ['All', '< 30 Days', '30-90 Days', '> 90 Days'];
  const probFilters = ['All', '< 25%', '25% - 75%', '> 75%'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Ticker Tape */}
      <div className="w-full overflow-hidden bg-slate-900/80 border-y border-slate-800/60 py-2 flex items-center -mx-4 px-4 md:mx-0 md:px-0 md:rounded-lg">
        <div className="flex animate-marquee whitespace-nowrap">
          {markets.map((m, i) => (
            <div key={i} className="flex items-center gap-3 mx-6 text-sm font-mono">
              <span className="text-slate-400">{m.id}</span>
              <span className={m.yes > 0.5 ? 'text-emerald-400' : 'text-rose-400'}>
                {(m.yes * 100).toFixed(1)}%
              </span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {markets.map((m, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-3 mx-6 text-sm font-mono">
              <span className="text-slate-400">{m.id}</span>
              <span className={m.yes > 0.5 ? 'text-emerald-400' : 'text-rose-400'}>
                {(m.yes * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-100">Live Markets</h2>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs text-emerald-400 font-mono">
              <Activity className="w-3 h-3 animate-pulse" />
              LIVE
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
            Real-time order book data from Polymarket & Kalshi. 
            <span className="text-xs font-mono text-slate-600">Last update: {lastUpdate.toLocaleTimeString()}</span>
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Search or generate market..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filteredMarkets.length === 0) {
                    handleAISearch();
                  }
                }}
                className="pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors w-full sm:w-64"
              />
            </div>
            <button
              onClick={handleAISearch}
              disabled={isSearchingAI || !searchQuery.trim()}
              className="px-3 py-2 bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-800 disabled:text-slate-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              {isSearchingAI ? (
                <Activity className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Deep Search</span>
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/20' 
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-slate-900/30 p-4 rounded-xl border border-slate-800/40">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Volume:</span>
          <select 
            value={activeVolumeFilter} 
            onChange={(e) => setActiveVolumeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
          >
            {volumeFilters.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Expiry:</span>
          <select 
            value={activeExpiryFilter} 
            onChange={(e) => setActiveExpiryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
          >
            {expiryFilters.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Prob (YES):</span>
          <select 
            value={activeProbFilter} 
            onChange={(e) => setActiveProbFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
          >
            {probFilters.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-2 md:mx-0">
        {filteredMarkets.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/40 border border-slate-800/60 rounded-xl">
            No markets found matching your criteria.
          </div>
        ) : (
          filteredMarkets.map((market, i) => {
            const flash = flashRows[market.id];
            const flashClass = flash === 'up' ? 'ring-1 ring-emerald-500/50 bg-emerald-500/5' : flash === 'down' ? 'ring-1 ring-rose-500/50 bg-rose-500/5' : '';
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                key={market.id} 
                onClick={() => setSelectedMarket(market)}
                className={`bg-slate-900/60 border border-slate-800/60 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all cursor-pointer shadow-lg shadow-black/20 ${flashClass}`}
              >
                <div className="flex justify-between items-start mb-6 gap-4">
                  <div className="flex items-start gap-3">
                    <img 
                      src={`https://picsum.photos/seed/${market.id}/64/64`} 
                      alt={market.title}
                      className="w-10 h-10 rounded-full object-cover border border-slate-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <h3 className="text-sm font-bold text-slate-200 line-clamp-3 leading-snug">{market.title}</h3>
                  </div>
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full border-2 border-slate-800 shrink-0 relative overflow-hidden">
                    {/* Fake progress ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={market.yes > 0.5 ? "text-emerald-500" : "text-rose-500"}
                        strokeDasharray={`${market.yes * 100}, 100`}
                        strokeWidth="3"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="text-xs font-bold text-slate-200 z-10">{(market.yes * 100).toFixed(0)}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setQuickBet({ market, side: 'YES' }); }}
                    className="py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 text-sm border border-emerald-500/20 hover:border-emerald-500/40"
                  >
                    Bet Yes <TrendingUp className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setQuickBet({ market, side: 'NO' }); }}
                    className="py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 text-sm border border-rose-500/20 hover:border-rose-500/40"
                  >
                    Bet No <TrendingDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/60 pt-3 mt-auto">
                  <div className="flex items-center gap-1.5">
                    <Pin className="w-3.5 h-3.5" /> {market.volume} Bet
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 hover:text-slate-300 transition-colors"><MessageSquare className="w-3.5 h-3.5" /> {Math.floor(market.yes * 1000)}</div>
                    <Star className="w-3.5 h-3.5 hover:text-amber-400 transition-colors" />
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Quick Bet Modal */}
      <AnimatePresence>
        {quickBet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setQuickBet(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-black"
            >
              <div className="flex items-start justify-between p-5 border-b border-slate-800/60 bg-slate-900/50">
                <div>
                  <h2 className="text-lg font-bold text-slate-100 line-clamp-1">{quickBet.market.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Buy <strong className={quickBet.side === 'YES' ? 'text-emerald-400' : 'text-rose-400'}>{quickBet.side}</strong> shares @ ${(quickBet.side === 'YES' ? quickBet.market.yes : quickBet.market.no).toFixed(2)}
                  </p>
                </div>
                <button onClick={() => setQuickBet(null)} className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleQuickBet} className="p-5 space-y-5">
                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Amount (USDC)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
                    <input 
                      type="number" 
                      min="1"
                      step="1"
                      max={bankroll}
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-slate-200 font-mono focus:outline-none focus:border-indigo-500/50 transition-colors"
                      placeholder="0.00"
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs">
                    <span className="text-slate-500">Available: <span className="text-slate-300 font-mono">${bankroll.toFixed(2)}</span></span>
                    <button type="button" onClick={() => setBetAmount(bankroll.toString())} className="text-indigo-400 hover:text-indigo-300 font-medium">Max</button>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Est. Shares</span>
                    <span className="text-slate-200 font-mono font-bold">
                      {betAmount && !isNaN(parseFloat(betAmount)) 
                        ? (parseFloat(betAmount) / (quickBet.side === 'YES' ? quickBet.market.yes : quickBet.market.no)).toFixed(2) 
                        : '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Potential Return</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {betAmount && !isNaN(parseFloat(betAmount)) 
                        ? '$' + (parseFloat(betAmount) / (quickBet.side === 'YES' ? quickBet.market.yes : quickBet.market.no)).toFixed(2) 
                        : '$0.00'}
                    </span>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={!betAmount || isNaN(parseFloat(betAmount)) || parseFloat(betAmount) <= 0 || parseFloat(betAmount) > bankroll}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg ${
                    quickBet.side === 'YES' 
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-emerald-500/20 disabled:bg-emerald-500/20 disabled:text-emerald-500/50' 
                      : 'bg-rose-500 hover:bg-rose-400 text-rose-950 shadow-rose-500/20 disabled:bg-rose-500/20 disabled:text-rose-500/50'
                  }`}
                >
                  Confirm Bet
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedMarket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedMarket(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-slate-800/60 bg-slate-900/50">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded text-slate-400 font-medium tracking-wider border border-slate-700">{selectedMarket.id}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-indigo-500/10 rounded text-indigo-400 font-medium tracking-wider border border-indigo-500/20">{selectedMarket.category}</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3"/> {selectedMarket.end}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-100">{selectedMarket.title}</h2>
                </div>
                <button onClick={() => setSelectedMarket(null)} className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-900 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Chart & Stats */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xl">
                      <TrendingUp className="w-5 h-5" /> YES {(selectedMarket.yes * 100).toFixed(1)}%
                    </div>
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xl">
                      <TrendingDown className="w-5 h-5" /> NO {(selectedMarket.no * 100).toFixed(1)}%
                    </div>
                  </div>

                  <div className="h-64 w-full bg-slate-900/40 border border-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-4 font-medium">
                      <BarChart2 className="w-4 h-4" /> Historical Performance (30D)
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={generateMockChartData(selectedMarket.yes)}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                        <XAxis dataKey="day" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1E293B', borderRadius: '8px', fontSize: '12px' }}
                          itemStyle={{ color: '#10b981' }}
                        />
                        <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right Col: News Sentiment */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400 font-medium border-b border-slate-800/60 pb-2">
                    <Newspaper className="w-4 h-4" /> Related News Sentiment
                  </div>
                  <div className="space-y-3">
                    {(selectedMarket as any).news ? (selectedMarket as any).news.map((news: any, idx: number) => (
                      <div key={idx} className="bg-slate-900/50 border border-slate-800/50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1.5">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                            news.sentiment === 'Bullish' ? 'bg-emerald-500/20 text-emerald-400' :
                            news.sentiment === 'Bearish' ? 'bg-rose-500/20 text-rose-400' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {news.sentiment}
                          </span>
                          <span className="text-[10px] text-slate-600">{news.time}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-snug">{news.title}</p>
                      </div>
                    )) : [
                      { title: "Institutional inflows surge in recent quarter", sentiment: "Bullish", time: "2h ago" },
                      { title: "Regulatory concerns raised by SEC chair", sentiment: "Bearish", time: "5h ago" },
                      { title: "Major whale executes $2.5M block trade", sentiment: "Bullish", time: "1d ago" },
                      { title: "Macro environment shows signs of cooling", sentiment: "Neutral", time: "2d ago" },
                    ].map((news, idx) => (
                      <div key={idx} className="bg-slate-900/50 border border-slate-800/50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1.5">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                            news.sentiment === 'Bullish' ? 'bg-emerald-500/20 text-emerald-400' :
                            news.sentiment === 'Bearish' ? 'bg-rose-500/20 text-rose-400' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {news.sentiment}
                          </span>
                          <span className="text-[10px] text-slate-600">{news.time}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-snug">{news.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-800/60 bg-slate-900/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Users className="w-4 h-4" /> Volume: <span className="text-slate-200 font-medium">{selectedMarket.volume}</span>
                  </div>
                  {selectedMarket.articleUrl && (
                    <a 
                      href={selectedMarket.articleUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg border border-indigo-500/20"
                    >
                      <ExternalLink className="w-4 h-4" /> Read Context Article
                    </a>
                  )}
                </div>
                <button 
                  onClick={() => handleAnalyze(selectedMarket)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-wider shadow-lg shadow-indigo-500/20"
                >
                  Analyze in Terminal &rarr;
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
