'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Upload, Clock, Trophy, ChevronRight, ChevronLeft, X, Star, Crown } from 'lucide-react';
import SlotMachine from '@/components/SlotMachine';
import { saveEntry, getEntries, getTodayEntries, type Entry } from '@/lib/supabase';

type Step = 'account' | 'amount' | 'upload' | 'wheel' | 'result';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('account');
  const [username, setUsername] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [currentTime, setCurrentTime] = useState('');
  const [prizeWon, setPrizeWon] = useState<number>(0);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'shared' | 'error'>('idle');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadEntries = async () => {
    try {
      const data = await getEntries();
      setEntries(data);
      console.log('Loaded entries on main page:', data.length);
    } catch (error) {
      console.error('Error loading entries on main page:', error);
      setEntries([]);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    if (currentStep === 'account') {
      loadEntries();
    }
  }, [currentStep]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${year}年${month}月${date}日 ${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerConfetti = (level: 'big' | 'medium') => {
    const base = { spread: 70, origin: { y: 0.6 } } as const;
    if (level === 'big') {
      confetti({ ...base, particleCount: 140, colors: ['#00f5ff', '#ff5ef8', '#7cff84', '#ffffff'] });
      setTimeout(() => confetti({ ...base, particleCount: 120, colors: ['#00f5ff', '#ff5ef8', '#7cff84'] }), 200);
      setTimeout(() => confetti({ ...base, particleCount: 100, colors: ['#00f5ff', '#ff5ef8'] }), 400);
    } else {
      confetti({ ...base, particleCount: 80, colors: ['#00f5ff', '#ff5ef8'] });
    }
  };

  const playWinSound = (level: 'big' | 'medium') => {
    try {
      const AudioCtx: typeof AudioContext =
        (window as unknown as { AudioContext: typeof AudioContext }).AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();

      const beep = (freq: number, startTime: number, duration = 0.15, volume = 0.2) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.value = volume;
        osc.connect(gain);
        gain.connect(ctx.destination);
        const t = ctx.currentTime + startTime;
        osc.start(t);
        osc.stop(t + duration);
      };

      if (level === 'big') {
        beep(440, 0);
        beep(660, 0.12);
        beep(880, 0.24, 0.25);
      } else {
        beep(440, 0);
        beep(660, 0.12);
      }
    } catch {}
  };

  const handleSaveEntry = async (prize: number) => {
    const entry = {
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      username: username,
      amount: selectedAmount,
      image: uploadedImage || '',
      prize: prize,
    };

    console.log('Saving new entry:', {
      username: entry.username,
      amount: entry.amount,
      prize: entry.prize,
      hasImage: !!entry.image,
      imageLength: entry.image?.length || 0
    });

    try {
      await saveEntry(entry);
      console.log('Entry saved successfully to Supabase');
      await loadEntries();
    } catch (error) {
      console.error('Failed to save entry:', error);
    }
  };

  const handleSlotWin = async (prizeNumber: number) => {
    setPrizeWon(prizeNumber);

    await handleSaveEntry(prizeNumber);

    const level = prizeNumber >= 666 ? 'big' : prizeNumber >= 168 ? 'medium' : undefined;
    if (level) {
      triggerConfetti(level);
      playWinSound(level);
    }

    setTimeout(() => setCurrentStep('result'), 2000);
  };

  const handleShare = async () => {
    try {
      const prizeText = prizeWon === 0 ? '馬逼簽名' : `${prizeWon}獎金`;
      const shareText = `我在「達特｜每日儲值輪盤」抽中了 ${prizeText}！你也來試試手氣～`;
      const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';

      if (navigator.share) {
        try {
          await navigator.share({ title: '達特｜每日儲值輪盤', text: shareText, url: shareUrl });
          setShareStatus('shared');
          setTimeout(() => setShareStatus('idle'), 3000);
          return;
        } catch (err: unknown) {
          // If user cancels, do nothing; otherwise fall back to clipboard
          if (err && typeof err === 'object' && 'name' in err && (err as { name?: string }).name === 'AbortError') {
            return;
          }
          // fall through to clipboard
        }
      }

      // Clipboard fallback
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 3000);
    } catch {
      setShareStatus('error');
      setTimeout(() => setShareStatus('idle'), 3000);
    }
  };

  const getPrizeDisplay = () => {
    if (selectedAmount === '1000') {
      return [
        { name: '58獎金', prob: '80%', color: 'cyan', emoji: '💰' },
        { name: '168獎金', prob: '10%', color: 'pink', emoji: '💎' },
        { name: '🏀 精準體育單', prob: '9%', color: 'purple', emoji: '🏀' },
        { name: '388獎金', prob: '1%', color: 'green', emoji: '🎰' },
      ];
    } else if (selectedAmount === '5000') {
      return [
        { name: '188獎金', prob: '80%', color: 'cyan', emoji: '💰' },
        { name: '388獎金', prob: '10%', color: 'pink', emoji: '💎' },
        { name: '🏀 精準體育單', prob: '9%', color: 'purple', emoji: '🏀' },
        { name: '888獎金', prob: '1%', color: 'green', emoji: '🎰' },
      ];
    } else {
      return [
        { name: '388獎金', prob: '80%', color: 'cyan', emoji: '💰' },
        { name: '666獎金', prob: '10%', color: 'pink', emoji: '💎' },
        { name: '🏀 精準體育單', prob: '9%', color: 'purple', emoji: '🏀' },
        { name: '1888獎金', prob: '1%', color: 'green', emoji: '🎰' },
      ];
    }
  };

  const getStepNumber = (step: Step): number => {
    switch(step) {
      case 'account': return 1;
      case 'amount': return 2;
      case 'upload': return 3;
      case 'wheel': return 4;
      case 'result': return 4;
      default: return 1;
    }
  };

  const isStepActive = (stepNum: number): boolean => {
    const currentStepNum = getStepNumber(currentStep);
    return stepNum <= currentStepNum;
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/crown-placeholder.png"
              alt="Crown"
              className="w-10 h-10 crown-icon"
              onError={(e) => {
                // Fallback to emoji if image not found
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <span className="text-4xl hidden">👑</span>
            <h1 className="text-4xl md:text-5xl font-bold gold-gradient">
              您的主治醫師達特喂
            </h1>
            <Crown className="w-10 h-10 text-yellow-500 crown-icon" style={{ animationDelay: '0.5s' }} />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-[#dedede]">
            每日儲值輪盤簽到活動 v2.84
          </h2>
          <p className="text-yellow-500/60">
            儲值 $1,000 以上當日即可享有幸運抽獎一次，保證有獎喔！
          </p>
        </div>

        <div className="luxury-card rounded-2xl p-6 md:p-8">
          {currentStep !== 'result' && (
            <div className="step-indicator mb-8">
              <div className={`step ${isStepActive(1) ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-text">帳號確認</div>
              </div>
              <div className={`step ${isStepActive(2) ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-text">選擇金額</div>
              </div>
              <div className={`step ${isStepActive(3) ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-text">上傳照片</div>
              </div>
              <div className={`step ${isStepActive(4) ? 'active' : ''}`}>
                <div className="step-number">4</div>
                <div className="step-text">開始抽獎</div>
              </div>
            </div>
          )}

          {currentStep === 'account' && (
            <div className="space-y-6">
              <div className="luxury-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">現在時間</span>
                </div>
                <div className="text-2xl font-bold gold-gradient">
                  {currentTime}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-yellow-500 font-semibold">
                  請輸入您的3A/朕天下帳號
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl luxury-input outline-none"
                  placeholder="請輸入帳號"
                />
              </div>

              <button
                onClick={() => username && setCurrentStep('amount')}
                disabled={!username}
                className="w-full luxury-button py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                確認帳號
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {currentStep === 'amount' && (
            <div className="space-y-6">
              <div className="luxury-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">選擇今日儲值金額</span>
                </div>
                <p className="text-yellow-500/70">
                  請選擇您今日的儲值金額以參加對應的抽獎活動
                </p>
              </div>

              <div className="amount-selection">
                <div
                  className={`amount-option ${selectedAmount === '1000' ? 'selected' : ''}`}
                  onClick={() => setSelectedAmount('1000')}
                >
                  <div className="amount-title">今日$1,000</div>
                  <div className="amount-subtitle">基礎獎池</div>
                </div>
                <div
                  className={`amount-option ${selectedAmount === '5000' ? 'selected' : ''}`}
                  onClick={() => setSelectedAmount('5000')}
                >
                  <div className="amount-title">今日$5,000</div>
                  <div className="amount-subtitle">高級獎池</div>
                </div>
                <div
                  className={`amount-option ${selectedAmount === '10000' ? 'selected' : ''}`}
                  onClick={() => setSelectedAmount('10000')}
                >
                  <div className="amount-title">今日$10,000</div>
                  <div className="amount-subtitle">豪華獎池</div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep('account')}
                  className="flex-1 py-3 rounded-xl bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 transition flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  上一步
                </button>
                <button
                  onClick={() => selectedAmount && setCurrentStep('upload')}
                  disabled={!selectedAmount}
                  className="flex-1 luxury-button py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  下一步
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 'upload' && (
            <div className="space-y-6">
              <div className="luxury-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                  <Star className="w-5 h-5" />
                  <span className="font-semibold">重要說明</span>
                </div>
                <p className="text-yellow-500/70">
                  請上傳當日儲值1000元以上的證明照片，未上傳儲值證明不派彩。
                </p>
              </div>

              {!uploadedImage ? (
                <div
                  className="upload-area"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="w-16 h-16 mx-auto mb-4 text-yellow-500/50" />
                  <p className="text-yellow-500 font-semibold mb-2">上傳儲值證明照片</p>
                  <p className="text-yellow-500/50 text-sm">點擊或拖拽照片到此處</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full h-64 object-cover"
                    />
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition"
                    >
                      <X className="w-5 h-5 text-yellow-500" />
                    </button>
                  </div>
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="w-full py-2 rounded-xl bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 transition"
                  >
                    重新上傳
                  </button>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep('amount')}
                  className="flex-1 py-3 rounded-xl bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 transition flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  上一步
                </button>
                <button
                  onClick={() => uploadedImage && setCurrentStep('wheel')}
                  disabled={!uploadedImage}
                  className="flex-1 luxury-button py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  下一步
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 'wheel' && (
            <div className="space-y-6">
              {/* Selected Tier Display */}
              <div className="luxury-card rounded-xl p-4 border-2 border-yellow-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="w-6 h-6 text-yellow-500" />
                    <div>
                      <div className="text-sm text-white/60">已選擇方案</div>
                      <div className="text-2xl font-bold text-yellow-500">
                        今日${selectedAmount === '1000' ? '1,000' : selectedAmount === '5000' ? '5,000' : '10,000'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white/60">儲值金額</div>
                    <div className="text-xl font-bold text-white">
                      ${selectedAmount === '1000' ? '1,000' : selectedAmount === '5000' ? '5,000' : '10,000'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Prize Information */}
              <div className="luxury-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">獎項說明</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {getPrizeDisplay().map((prize, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        prize.color === 'cyan'
                          ? 'bg-cyan-500/10 border-cyan-500/30'
                          : prize.color === 'pink'
                          ? 'bg-pink-500/10 border-pink-500/30'
                          : prize.color === 'purple'
                          ? 'bg-purple-500/10 border-purple-500/30'
                          : 'bg-green-400/10 border-green-400/30'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{prize.emoji}</div>
                        <div
                          className={`font-bold text-sm mb-1 ${
                            prize.color === 'cyan'
                              ? 'text-cyan-400'
                              : prize.color === 'pink'
                              ? 'text-pink-400'
                              : prize.color === 'purple'
                              ? 'text-purple-400'
                              : 'text-green-400'
                          }`}
                        >
                          {prize.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <SlotMachine selectedAmount={selectedAmount} onWin={handleSlotWin} />

              <button
                onClick={() => setCurrentStep('upload')}
                className="w-full py-3 rounded-xl bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 transition flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                上一步
              </button>
            </div>
          )}

          {currentStep === 'result' && (
            <div className="text-center space-y-6">
              <div className="py-8">
                <Trophy className="w-24 h-24 mx-auto mb-4 text-yellow-500" />
                <h2 className="text-3xl font-bold gold-gradient mb-4">恭喜中獎！</h2>
                <div className="text-5xl font-bold gold-gradient mb-2">
                  {prizeWon === 0 ? '馬逼簽名' : `${prizeWon}獎金`}
                </div>
                <p className="text-yellow-500/70">隔天統一派彩喔~</p>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/"
                  onClick={() => setCurrentStep('account')}
                  className="flex-1 py-3 rounded-xl bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 transition text-center"
                >
                  回到首頁
                </Link>
                <button onClick={handleShare} className="flex-1 luxury-button py-3 rounded-xl">分享</button>
              </div>
              {shareStatus !== 'idle' && (
                <div className="text-yellow-500/70 text-sm mt-2">
                  {shareStatus === 'copied' && '已複製分享內容到剪貼簿！'}
                  {shareStatus === 'shared' && '已開啟系統分享面板'}
                  {shareStatus === 'error' && '分享失敗，請手動複製內容'}
                </div>
              )}
            </div>
          )}

          <div className="mt-8 luxury-card rounded-xl p-4">
            <div className="flex items-center gap-2 text-yellow-500 mb-4">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">今日抽獎紀錄</span>
            </div>
            <div className="space-y-3">
              {entries.filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString()).length === 0 ? (
                <div className="py-4 text-center text-yellow-500/50">今日尚無紀錄</div>
              ) : (
                entries
                  .filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString())
                  .map((record) => {
                    // Mask username for privacy
                    const maskedUsername = record.username && record.username.length > 0
                      ? record.username.charAt(0) + '***'
                      : '***';

                    return (
                      <div key={record.id} className="flex justify-between items-center py-2 border-b border-yellow-500/20 last:border-0">
                        <span className="text-yellow-500/70 font-semibold">{maskedUsername}</span>
                        <span className="font-bold gold-gradient">
                          {record.prize === 0 ? '馬逼簽名' : `${record.prize} 獎金`}
                        </span>
                        <span className="text-yellow-500/50 text-sm">
                          {new Date(record.timestamp).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/admin"
            className="text-yellow-500/20 hover:text-yellow-500/40 text-xs transition"
          >
            Admin
          </Link>
        </div>
      </div>
    </main>
  );
}
