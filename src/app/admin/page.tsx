'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User, Shield } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (isAuthenticated === 'true') {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check credentials
    if (username === 'chitu2025' && password === '1234567890') {
      localStorage.setItem('adminAuthenticated', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid username or password');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold gold-gradient mb-2">
            管理員登入
          </h1>
          <p className="text-yellow-500/60">
            請輸入管理員帳號密碼
          </p>
        </div>

        {/* Login Form */}
        <div className="luxury-card rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-yellow-500 font-semibold">
                <User className="w-4 h-4" />
                管理員帳號
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl luxury-input outline-none"
                placeholder="請輸入帳號"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-yellow-500 font-semibold">
                <Lock className="w-4 h-4" />
                管理員密碼
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl luxury-input outline-none"
                placeholder="請輸入密碼"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full luxury-button py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {isLoading ? '登入中...' : '登入'}
            </button>
          </form>

          {/* Back to Home */}
          <div className="mt-6 pt-6 border-t border-yellow-500/20">
            <Link
              href="/"
              className="block text-center text-yellow-500/70 hover:text-yellow-500 transition"
            >
              返回首頁
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
