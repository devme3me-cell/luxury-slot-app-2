'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LogOut,
  User,
  Calendar,
  DollarSign,
  Image as ImageIcon,
  Trophy,
  Eye,
  X,
  Download,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { getEntries, deleteEntry as deleteEntryFromDB, clearAllEntries, type Entry } from '@/lib/supabase';

export default function AdminDashboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAmount, setFilterAmount] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (isAuthenticated !== 'true') {
      router.push('/admin');
      return;
    }

    // Load entries from localStorage
    loadEntries();

    // Set up interval to check for new entries every 5 seconds
    const interval = setInterval(loadEntries, 5000);
    return () => clearInterval(interval);
  }, [router]);

  const loadEntries = async () => {
    try {
      setError(null);
      const data = await getEntries();
      setEntries(data);
      setIsLoading(false);
      console.log('Loaded entries:', data.length);
    } catch (error) {
      console.error('Error loading entries:', error);
      setError('無法載入資料，請檢查 Supabase 連線設定');
      setEntries([]);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    router.push('/admin');
  };

  const handleImageClick = (image: string) => {
    console.log('Opening image preview:', image ? 'Image exists' : 'No image');
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleDownloadImage = (image: string, username: string) => {
    const link = document.createElement('a');
    link.href = image;
    link.download = `${username}_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteEntry = async (id: string) => {
    if (confirm('確定要刪除這筆記錄嗎？')) {
      try {
        await deleteEntryFromDB(id);
        await loadEntries();
      } catch (error) {
        console.error('Error deleting entry:', error);
        alert('刪除失敗，請稍後再試');
      }
    }
  };

  const handleClearAll = async () => {
    if (confirm('確定要清除所有記錄嗎？此操作無法復原。')) {
      try {
        await clearAllEntries();
        setEntries([]);
      } catch (error) {
        console.error('Error clearing entries:', error);
        alert('清除失敗，請稍後再試');
      }
    }
  };



  // Filter entries based on search and amount filter
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAmount = filterAmount === 'all' || entry.amount === filterAmount;
    return matchesSearch && matchesAmount;
  });

  // Calculate statistics
  const totalEntries = entries.length;
  const todayEntries = entries.filter(entry => {
    const entryDate = new Date(entry.timestamp).toDateString();
    const today = new Date().toDateString();
    return entryDate === today;
  }).length;
  const totalAmount = entries.reduce((sum, entry) => sum + parseInt(entry.amount), 0);

  // Add ESC key listener for modal close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedImage]);

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Shield className="w-10 h-10 text-yellow-500" />
            <h1 className="text-3xl font-bold gold-gradient">
              管理員控制台
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
          >
            <LogOut className="w-4 h-4" />
            登出
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="luxury-card rounded-xl p-4 mb-6 bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <div className="flex-1">
                <p className="text-red-400 font-semibold mb-1">連線錯誤</p>
                <p className="text-red-300/80 text-sm">{error}</p>
                <p className="text-red-300/60 text-xs mt-2">
                  請確認 Supabase 專案狀態：<br />
                  1. 檢查專案是否暫停<br />
                  2. 確認資料庫 entries 資料表是否存在<br />
                  3. 檢查環境變數設定
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading Display */}
        {isLoading && !error && (
          <div className="luxury-card rounded-xl p-8 mb-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
              <p className="text-yellow-500">載入資料中...</p>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="luxury-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-500/60 text-sm">總參與人數</p>
                <p className="text-2xl font-bold gold-gradient">{totalEntries}</p>
              </div>
              <User className="w-8 h-8 text-yellow-500/40" />
            </div>
          </div>
          <div className="luxury-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-500/60 text-sm">今日參與</p>
                <p className="text-2xl font-bold gold-gradient">{todayEntries}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500/40" />
            </div>
          </div>
          <div className="luxury-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-500/60 text-sm">總儲值金額</p>
                <p className="text-2xl font-bold gold-gradient">${totalAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500/40" />
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="luxury-card rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="搜尋用戶名..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg luxury-input outline-none"
            />
            <select
              value={filterAmount}
              onChange={(e) => setFilterAmount(e.target.value)}
              className="px-4 py-2 rounded-lg luxury-input outline-none"
            >
              <option value="all">所有金額</option>
              <option value="1000">$1,000</option>
              <option value="5000">$5,000</option>
              <option value="10000">$10,000</option>
            </select>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
            >
              清除所有記錄
            </button>
          </div>
        </div>

        {/* Entries Table */}
        <div className="luxury-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-yellow-500/20">
                  <th className="text-left p-4 text-yellow-500 font-semibold">時間戳記</th>
                  <th className="text-left p-4 text-yellow-500 font-semibold">用戶名</th>
                  <th className="text-left p-4 text-yellow-500 font-semibold">儲值金額</th>
                  <th className="text-left p-4 text-yellow-500 font-semibold">中獎金額</th>
                  <th className="text-left p-4 text-yellow-500 font-semibold">上傳圖片</th>
                  <th className="text-left p-4 text-yellow-500 font-semibold">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-yellow-500/50">
                      暫無記錄
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry) => (
                    <tr key={entry.id} className="border-b border-yellow-500/10 hover:bg-yellow-500/5 transition">
                      <td className="p-4 text-yellow-500/70">
                        {new Date(entry.timestamp).toLocaleString('zh-TW')}
                      </td>
                      <td className="p-4 text-yellow-500/90 font-medium">
                        {entry.username}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-lg bg-yellow-500/20 text-yellow-500">
                          ${entry.amount}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 flex items-center gap-1 w-fit">
                          <Trophy className="w-3 h-3" />
                          {entry.prize === 0 ? '馬逼簽名' : `${entry.prize}獎金`}
                        </span>
                      </td>
                      <td className="p-4">
                        {entry.image ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleImageClick(entry.image)}
                              className="p-2 rounded-lg bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 transition"
                              title="預覽圖片"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownloadImage(entry.image, entry.username)}
                              className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
                              title="下載圖片"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-yellow-500/30">無圖片</span>
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                          title="刪除記錄"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Image Preview Modal - Enhanced */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            onClick={handleCloseModal}
          >
            <div
              className="relative max-w-6xl max-h-[95vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleCloseModal}
                className="absolute -top-12 right-0 p-3 rounded-full bg-red-500/80 text-white hover:bg-red-500 transition z-10 shadow-lg"
                title="關閉預覽"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Download button */}
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = selectedImage;
                  link.download = `image_${Date.now()}.jpg`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="absolute -top-12 right-16 p-3 rounded-full bg-blue-500/80 text-white hover:bg-blue-500 transition z-10 shadow-lg"
                title="下載圖片"
              >
                <Download className="w-6 h-6" />
              </button>

              {/* Image container */}
              <div className="luxury-card rounded-xl p-4 bg-black/50 border-2 border-yellow-500/30">
                <img
                  src={selectedImage}
                  alt="上傳證明預覽"
                  className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                  onError={(e) => {
                    console.error('Image failed to load');
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSIxNiI+5ZyW54mH6KyA5Y+W5aSx5pWXPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
              </div>

              {/* Image info */}
              <div className="mt-2 text-center text-yellow-500/70 text-sm">
                點擊外部區域或按 ESC 鍵關閉
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
