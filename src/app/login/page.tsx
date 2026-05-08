'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useSettings } from '@/contexts/SettingsContext';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useSettings();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Username atau password salah.');
        return;
      }

      const user = await res.json();
      localStorage.setItem('user_role', user.role);
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      if (user.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/pembelian');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi server.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--primary)]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[var(--accent)]/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-[var(--bg-secondary)] rounded-3xl shadow-2xl border border-[var(--border-light)] p-8 relative z-10">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-md">
              <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">Selamat Datang</h1>
          <p className="text-[var(--text-secondary)] mt-2">Silakan masuk ke akun Anda</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--text-secondary)]">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border-light)] bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text-primary)] transition-all"
              placeholder="Masukkan username"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--text-secondary)]">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border-light)] bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text-primary)] transition-all"
              placeholder="Masukkan password"
              required
            />
          </div>

          <Button type="submit" size="lg" className="w-full h-14 rounded-xl text-lg shadow-lg hover:-translate-y-1 transition-transform">
            Masuk
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-[var(--text-secondary)]">
          &copy; {new Date().getFullYear()} {t.appName}. All rights reserved.
        </div>
      </div>
    </div>
  );
}
