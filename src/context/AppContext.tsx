import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type Position = {
  id: string;
  marketId: string;
  title: string;
  side: 'YES' | 'NO';
  sizeUsdc: number;
  shares: number;
  avgPrice: number;
  currentPrice: number;
};

export type Trade = {
  id: string;
  time: string;
  marketId: string;
  title: string;
  action: 'BUY' | 'SELL';
  side: 'YES' | 'NO';
  sizeUsdc: number;
  shares: number;
  price: number;
};

type AppContextType = {
  bankroll: number;
  stakedBalance: number;
  positions: Position[];
  portfolioHistory: { time: string; value: number }[];
  tradeHistory: Trade[];
  executeTrade: (marketId: string, title: string, side: 'YES' | 'NO', sizeUsdc: number, price: number) => void;
  closePosition: (id: string) => void;
  stake: (amount: number) => void;
  unstake: (amount: number) => void;
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (email: string) => void;
  logout: () => void;
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [bankroll, setBankroll] = useState(10000);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [positions, setPositions] = useState<Position[]>([]);
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  
  // Start with a single data point for the chart
  const [portfolioHistory, setPortfolioHistory] = useState([
    { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), value: 10000 }
  ]);

  // Simulate price movements every 5 seconds
  useEffect(() => {
    if (positions.length === 0) return;

    const interval = setInterval(() => {
      setPositions(prevPositions => {
        let hasChanges = false;
        const newPositions = prevPositions.map(pos => {
          // Random price movement between -5% and +5%
          const changePercent = (Math.random() - 0.5) * 0.1;
          let newPrice = pos.currentPrice * (1 + changePercent);
          
          // Clamp price between 0.01 and 0.99
          if (newPrice > 0.99) newPrice = 0.99;
          if (newPrice < 0.01) newPrice = 0.01;

          if (newPrice !== pos.currentPrice) {
            hasChanges = true;
          }

          return { ...pos, currentPrice: newPrice };
        });

        if (hasChanges) {
          // Update portfolio history
          const totalPositionValue = newPositions.reduce((acc, pos) => acc + (pos.shares * pos.currentPrice), 0);
          const newTotalValue = bankroll + stakedBalance + totalPositionValue;
          
          setPortfolioHistory(hist => {
            const newHist = [...hist, { 
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
              value: Number(newTotalValue.toFixed(2))
            }];
            // Keep only the last 20 data points
            if (newHist.length > 20) return newHist.slice(newHist.length - 20);
            return newHist;
          });
        }

        return newPositions;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [bankroll, positions.length]); // Re-run effect if number of positions changes

  const executeTrade = (marketId: string, title: string, side: 'YES' | 'NO', sizeUsdc: number, price: number) => {
    if (sizeUsdc > bankroll || sizeUsdc <= 0) return;

    const shares = sizeUsdc / price;
    const newPosition: Position = {
      id: Math.random().toString(36).substr(2, 9),
      marketId,
      title,
      side,
      sizeUsdc,
      shares,
      avgPrice: price,
      currentPrice: price, // Starts at break-even
    };

    setBankroll(prev => prev - sizeUsdc);
    setPositions(prev => {
      const newPositions = [...prev, newPosition];
      
      // Calculate new total value
      const totalPositionValue = newPositions.reduce((acc, pos) => acc + (pos.shares * pos.currentPrice), 0);
      const newTotalValue = (bankroll - sizeUsdc) + stakedBalance + totalPositionValue;
      
      setPortfolioHistory(hist => [
        ...hist, 
        { 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
          value: Number(newTotalValue.toFixed(2))
        }
      ]);
      
      return newPositions;
    });

    setTradeHistory(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      marketId,
      title,
      action: 'BUY',
      side,
      sizeUsdc,
      shares,
      price
    }, ...prev]);

    toast.success(`Purchased ${shares.toFixed(2)} shares of ${side}`, {
      description: `Market: ${title} @ $${price.toFixed(2)}`,
    });
  };

  const closePosition = (id: string) => {
    setPositions(prev => {
      const positionToClose = prev.find(p => p.id === id);
      if (!positionToClose) return prev;

      const valueToReturn = positionToClose.shares * positionToClose.currentPrice;
      setBankroll(b => b + valueToReturn);

      const newPositions = prev.filter(p => p.id !== id);
      
      // Update portfolio history
      const totalPositionValue = newPositions.reduce((acc, pos) => acc + (pos.shares * pos.currentPrice), 0);
      const newTotalValue = (bankroll + valueToReturn) + stakedBalance + totalPositionValue;
      
      setPortfolioHistory(hist => {
        const newHist = [...hist, { 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
          value: Number(newTotalValue.toFixed(2))
        }];
        if (newHist.length > 20) return newHist.slice(newHist.length - 20);
        return newHist;
      });

      setTradeHistory(th => [{
        id: Math.random().toString(36).substr(2, 9),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        marketId: positionToClose.marketId,
        title: positionToClose.title,
        action: 'SELL',
        side: positionToClose.side,
        sizeUsdc: valueToReturn,
        shares: positionToClose.shares,
        price: positionToClose.currentPrice
      }, ...th]);

      toast.success(`Sold ${positionToClose.shares.toFixed(2)} shares of ${positionToClose.side}`, {
        description: `Market: ${positionToClose.title} @ $${positionToClose.currentPrice.toFixed(2)}`,
      });

      return newPositions;
    });
  };

  const stake = (amount: number) => {
    if (amount > 0 && amount <= bankroll) {
      setBankroll(prev => prev - amount);
      setStakedBalance(prev => prev + amount);
      toast.success(`Staked $${amount.toFixed(2)} USDC`);
    }
  };

  const unstake = (amount: number) => {
    if (amount > 0 && amount <= stakedBalance) {
      setStakedBalance(prev => prev - amount);
      setBankroll(prev => prev + amount);
      toast.success(`Unstaked $${amount.toFixed(2)} USDC`);
    }
  };

  const login = (email: string) => {
    setIsAuthenticated(true);
    setUser({ email });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const completeOnboarding = () => {
    setHasSeenOnboarding(true);
  };

  return (
    <AppContext.Provider value={{ 
      bankroll, stakedBalance, positions, portfolioHistory, tradeHistory, executeTrade, closePosition, stake, unstake,
      isAuthenticated, user, login, logout, hasSeenOnboarding, completeOnboarding
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
