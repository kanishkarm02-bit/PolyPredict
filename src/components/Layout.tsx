import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Activity, PieChart, Settings, Zap, GraduationCap, Shield, LogOut, Rocket } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppContext } from '../context/AppContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { bankroll, positions, logout } = useAppContext();
  
  const totalValue = bankroll + positions.reduce((acc, pos) => acc + (pos.shares * pos.currentPrice), 0);
  
  const navItems = [
    { icon: Rocket, label: 'Get Started', path: '/get-started' },
    { icon: Terminal, label: 'Execution Terminal', path: '/' },
    { icon: Activity, label: 'Live Markets', path: '/markets' },
    { icon: PieChart, label: 'Portfolio & PnL', path: '/portfolio' },
    { icon: GraduationCap, label: 'Quant Academy', path: '/academy' },
  ];

  return (
    <div className="flex h-screen bg-[#0B0F19] text-slate-300 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/60 bg-[#0B0F19] flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800/60 flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-md border border-indigo-500/20">
            <Zap className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight">PolyPredict</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5 font-mono">Market smarter, not harder.</p>
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm shadow-indigo-500/5" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800/60 space-y-2">
          <Link to="/privacy" className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
            location.pathname === '/privacy' ? "text-slate-200 bg-slate-800/50" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
          )}>
            <Shield className="w-4 h-4" />
            Privacy Policy
          </Link>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#0B0F19]">
        {/* Topbar */}
        <header className="h-16 border-b border-slate-800/60 bg-[#0B0F19]/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-10">
          <div className="text-xs text-slate-500 uppercase tracking-widest font-mono">
            {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
              <span className="text-slate-400">Net Liq:</span>
              <span className="text-emerald-400 font-bold">${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
              <span className="text-slate-400">Cash:</span>
              <span className="text-slate-200 font-bold">${bankroll.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-medium">SYSTEM ONLINE</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
