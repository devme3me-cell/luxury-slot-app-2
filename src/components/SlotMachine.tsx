'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

type Prize =
  | '58獎金'
  | '168獎金'
  | '🏀 精準體育單'
  | '388獎金'
  | '188獎金'
  | '888獎金'
  | '666獎金'
  | '1888獎金';

interface PrizeConfig {
  name: Prize;
  probability: number;
  emoji: string;
  color: string;
}

interface PrizeHistory {
  prize: Prize;
  timestamp: Date;
  id: number;
}

interface Confetti {
  id: number;
  left: number;
  color: string;
  delay: number;
  duration: number;
}

interface SlotMachineProps {
  selectedAmount: string;
  onWin?: (prize: number) => void;
}

export default function SlotMachine({ selectedAmount, onWin }: SlotMachineProps) {
  const getPrizes = (): PrizeConfig[] => {
    if (selectedAmount === '1000') {
      return [
        { name: '58獎金', probability: 0.80, emoji: '💰', color: '#00f5ff' },
        { name: '168獎金', probability: 0.10, emoji: '💎', color: '#ff5ef8' },
        { name: '🏀 精準體育單', probability: 0.09, emoji: '🏀', color: '#a78bfa' },
        { name: '388獎金', probability: 0.01, emoji: '🎰', color: '#7cff84' },
      ];
    } else if (selectedAmount === '5000') {
      return [
        { name: '188獎金', probability: 0.80, emoji: '💰', color: '#00f5ff' },
        { name: '388獎金', probability: 0.10, emoji: '💎', color: '#ff5ef8' },
        { name: '🏀 精準體育單', probability: 0.09, emoji: '🏀', color: '#a78bfa' },
        { name: '888獎金', probability: 0.01, emoji: '🎰', color: '#7cff84' },
      ];
    } else {
      // 10000
      return [
        { name: '388獎金', probability: 0.80, emoji: '💰', color: '#00f5ff' },
        { name: '666獎金', probability: 0.10, emoji: '💎', color: '#ff5ef8' },
        { name: '🏀 精準體育單', probability: 0.09, emoji: '🏀', color: '#a78bfa' },
        { name: '1888獎金', probability: 0.01, emoji: '🎰', color: '#7cff84' },
      ];
    }
  };

  const [prizes, setPrizes] = useState<PrizeConfig[]>(getPrizes());
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);
  const [displayPrizes, setDisplayPrizes] = useState<Prize[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<Confetti[]>([]);
  const [glassTint, setGlassTint] = useState<'light' | 'dark' | 'winning'>('light');
  const [history, setHistory] = useState<PrizeHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const slotRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  useEffect(() => {
    setPrizes(getPrizes());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAmount]);

  useEffect(() => {
    setDisplayPrizes(prizes.map(p => p.name).slice(0, 3));
    setMounted(true);
  }, [prizes]);

  const selectPrize = (): Prize => {
    const random = Math.random();
    let cumulative = 0;

    for (const prize of prizes) {
      cumulative += prize.probability;
      if (random <= cumulative) {
        return prize.name;
      }
    }

    return prizes[0].name;
  };

  // Disable confetti
  const createConfetti = (prize: Prize) => {
    setConfettiParticles([]);
  };

  const spin = async () => {
    if (spinning) return;

    setHasStarted(true);
    setSpinning(true);
    setShowResult(false);
    setResult(null);
    setSpinCount(prev => prev + 1);
    setGlassTint('dark');

    const finalPrize = selectPrize();

    // Animate each slot with blur effect (animation will be static)
    slotRefs.forEach((ref) => {
      if (ref.current) {
        ref.current.style.animation = 'none';
        void ref.current.offsetHeight;
        ref.current.style.animation = `spin 0.08s linear infinite`;
      }
    });

    // Randomize display during spin
    const spinInterval = setInterval(() => {
      setDisplayPrizes([
        prizes[Math.floor(Math.random() * prizes.length)].name,
        prizes[Math.floor(Math.random() * prizes.length)].name,
        prizes[Math.floor(Math.random() * prizes.length)].name,
      ]);
    }, 80);

    // Stop slots one by one
    await new Promise(resolve => setTimeout(resolve, 2000));
    setDisplayPrizes([
      finalPrize,
      prizes[Math.floor(Math.random() * prizes.length)].name,
      prizes[Math.floor(Math.random() * prizes.length)].name,
    ]);
    if (slotRefs[0].current) {
      slotRefs[0].current.style.animation = 'slotStop 0.3s ease-out';
      setTimeout(() => {
        if (slotRefs[0].current) slotRefs[0].current.style.animation = 'none';
      }, 300);
    }

    await new Promise(resolve => setTimeout(resolve, 600));
    setDisplayPrizes([
      finalPrize,
      finalPrize,
      prizes[Math.floor(Math.random() * prizes.length)].name,
    ]);
    if (slotRefs[1].current) {
      slotRefs[1].current.style.animation = 'slotStop 0.3s ease-out';
      setTimeout(() => {
        if (slotRefs[1].current) slotRefs[1].current.style.animation = 'none';
      }, 300);
    }

    await new Promise(resolve => setTimeout(resolve, 600));
    setDisplayPrizes([finalPrize, finalPrize, finalPrize]);
    if (slotRefs[2].current) {
      slotRefs[2].current.style.animation = 'slotStop 0.3s ease-out';
      setTimeout(() => {
        if (slotRefs[2].current) slotRefs[2].current.style.animation = 'none';
      }, 300);
    }

    clearInterval(spinInterval);

    setTimeout(() => {
      setResult(finalPrize);
      setShowResult(true);
      setSpinning(false);
      setGlassTint('winning');

      // Add to history
      setHistory(prev => [{
        prize: finalPrize,
        timestamp: new Date(),
        id: Date.now(),
      }, ...prev].slice(0, 10)); // Keep only last 10

      // Notify parent component of win
      const prizeNumber =
        finalPrize === '🏀 精準體育單'
          ? 0
          : parseInt(finalPrize.replace('獎金', ''), 10);
      if (onWin) {
        onWin(prizeNumber);
      }

      // Create confetti (disabled)
      createConfetti(finalPrize);

      setTimeout(() => setGlassTint('light'), 2000);
    }, 400);
  };

  const getPrizeConfig = (prizeName: Prize) => {
    return prizes.find(p => p.name === prizeName) || prizes[0];
  };

  const getGlassStyle = () => {
    switch (glassTint) {
      case 'dark':
        return 'bg-white/5 border-white/10';
      case 'winning':
        return 'bg-white/20 border-white/30';
      default:
        return 'bg-white/10 border-white/20';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Glass Container - no haptic feedback */}
      <div className={`glass-container relative overflow-hidden rounded-[32px] shadow-2xl backdrop-blur-2xl ${getGlassStyle()} border transition-all duration-500`}>
        {/* Light reflection effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none transition-opacity duration-500"></div>
        <div className={`absolute inset-0 bg-gradient-to-tl from-red-500/10 via-transparent to-transparent pointer-events-none transition-opacity duration-500 ${glassTint === 'winning' ? 'opacity-100' : 'opacity-50'}`}></div>

        {/* Header */}
        <div className="relative py-8 px-6 text-center backdrop-blur-xl bg-gradient-to-br from-red-500/30 via-red-600/20 to-red-700/30 border-b border-white/20 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
          <h1 className="text-4xl font-bold text-white mb-2 relative z-10 drop-shadow-lg tracking-tight">🎰 達特好幸運 🎰</h1>
          <p className="text-white/90 text-sm relative z-10 font-medium">來！讓我看看你有多好運！</p>
        </div>

        {/* Slot Display */}
        <div className="py-8 px-6 relative">
          {/* Glass slot container */}
          <div className="glass-panel rounded-3xl p-6 mb-6 backdrop-blur-xl bg-black/20 border border-white/10 shadow-xl relative overflow-hidden transition-all duration-500">
            {/* Inner glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent pointer-events-none"></div>

            <div className="flex justify-center gap-3">
              {displayPrizes.map((prize, index) => {
                const config = getPrizeConfig(prize);
                return (
                  <div
                    key={index}
                    ref={slotRefs[index]}
                    className={`glass-slot w-24 h-32 backdrop-blur-xl rounded-2xl border ${
                      spinning
                        ? 'border-white/40 bg-white/15 shadow-lg shadow-white/20'
                        : 'border-white/20 bg-white/5'
                    } flex flex-col items-center justify-center shadow-lg relative overflow-hidden transition-all duration-300`}
                  >
                    {/* Slot glass effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
                    {spinning && (
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                    )}
                    <div className={`text-4xl mb-2 transition-all duration-300 ${spinning ? 'blur-sm scale-110' : ''} drop-shadow-lg`}>
                      {config.emoji}
                    </div>
                    <div className={`text-white font-bold text-sm text-center px-1 break-words transition-all duration-300 ${spinning ? 'blur-sm' : ''} drop-shadow-md`}>
                      {prize}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Result Display */}
          {showResult && result && (
            <div className="mb-6">
              <div className="glass-result backdrop-blur-2xl bg-gradient-to-br from-white/30 via-white/20 to-white/10 rounded-2xl p-5 text-center shadow-2xl border border-white/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent"></div>
                <p className="text-lg font-bold text-white mb-1 relative z-10 drop-shadow-lg">🎉 恭喜獲得 🎉</p>
                <p className="text-3xl font-black text-white relative z-10 drop-shadow-xl">{result}</p>
              </div>
            </div>
          )}

          {/* Spin Button */}
          {!showResult && !hasStarted && (
            <Button
              onClick={spin}
              disabled={spinning}
              className="glass-button w-full h-16 text-2xl font-bold backdrop-blur-xl bg-gradient-to-br from-red-500/60 via-red-600/50 to-red-700/60 hover:from-red-500/70 hover:via-red-600/60 hover:to-red-700/70 text-white rounded-2xl shadow-xl border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all active:scale-95 hover:shadow-2xl hover:shadow-red-500/30 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000"></div>
              <span className="relative z-10 drop-shadow-lg font-semibold">{spinning ? '抽獎中...' : '開始抽獎'}</span>
            </Button>
          )}

          {/* Spin counter and History toggle */}
          <div className="flex justify-between items-center mt-4">
            {spinCount > 0 && (
              <div className="text-white/80 text-sm font-medium drop-shadow-md">
                已抽獎 {spinCount} 次
              </div>
            )}
            {history.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-white/80 text-sm font-medium drop-shadow-md hover:text-white transition-colors backdrop-blur-sm bg-white/10 px-3 py-1 rounded-lg border border-white/20"
              >
                {showHistory ? '隱藏紀錄' : '查看紀錄'}
              </button>
            )}
          </div>
        </div>

        {/* Prize History Panel */}
        {showHistory && history.length > 0 && (
          <div className="px-6 pb-6">
            <div className="glass-panel backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 max-h-64 overflow-y-auto">
              <h3 className="text-white font-bold mb-3 text-center drop-shadow-md">抽獎紀錄</h3>
              <div className="space-y-2">
                {history.map((item, index) => {
                  const config = getPrizeConfig(item.prize);
                  return (
                    <div
                      key={item.id}
                      className="glass-history-card backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-3 flex items-center gap-3 hover:bg-white/15 transition-all duration-300"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="text-2xl">{config.emoji}</div>
                      <div className="flex-1">
                        <div className="text-white font-semibold text-sm drop-shadow-md">{item.prize}</div>
                        <div className="text-white/60 text-xs">
                          {item.timestamp.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                      </div>
                      <div className="text-white/40 text-xs">#{history.length - index}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* Disable all animations */
        @keyframes confettiFall {
          0%, 100% { opacity: 0; }
        }

        @keyframes slideInFromLeft {
          0%, 100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes haptic-shake {
          0%, 100% { transform: translateX(0); }
        }

        .haptic-shake {
          animation: none;
        }

        .haptic-pulse {
          animation: none;
        }

        @keyframes haptic-pulse {
          0%, 100% { transform: scale(1); }
        }

        .sparkle-red, .sparkle-black {
          display: none;
        }

        @keyframes spin {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.05); }
        }

        @keyframes slotStop {
          0%, 100% { transform: scale(1); }
        }

        @keyframes shimmer {
          0%, 100% { transform: translateX(0); }
        }

        /* Keep glass styling, remove animations */
        .glass-container {
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15);
        }

        .glass-panel {
          box-shadow:
            inset 0 2px 4px 0 rgba(0, 0, 0, 0.2),
            0 4px 12px 0 rgba(0, 0, 0, 0.3);
        }

        .glass-slot {
          box-shadow:
            inset 0 1px 2px 0 rgba(255, 255, 255, 0.1),
            0 4px 12px 0 rgba(0, 0, 0, 0.2);
        }

        .glass-result {
          box-shadow:
            0 8px 32px 0 rgba(255, 255, 255, 0.1),
            inset 0 1px 2px 0 rgba(255, 255, 255, 0.2);
        }

        .glass-button {
          box-shadow:
            0 8px 24px 0 rgba(239, 68, 68, 0.3),
            inset 0 1px 1px 0 rgba(255, 255, 255, 0.2);
        }

        .glass-button:hover {
          box-shadow:
            0 12px 32px 0 rgba(239, 68, 68, 0.4),
            inset 0 1px 1px 0 rgba(255, 255, 255, 0.3);
        }

        .glass-history-card {
          animation: none;
          box-shadow:
            inset 0 1px 1px 0 rgba(255, 255, 255, 0.1),
            0 2px 8px 0 rgba(0, 0, 0, 0.15);
        }

        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          top: 50%;
          pointer-events: none;
          opacity: 0;
          animation: none;
          border-radius: 50%;
          z-index: 100;
        }
      `}</style>
    </div>
  );
}
