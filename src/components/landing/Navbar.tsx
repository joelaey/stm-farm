'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSettings } from '@/contexts/SettingsContext';
import { Sun, Moon, Languages } from 'lucide-react';

export function Navbar() {
  const { t, theme, locale, setTheme, setLocale } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Add shadow/background if scrolled past 20px
      setScrolled(currentScrollY > 20);

      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`fixed top-4 left-0 right-0 z-50 flex justify-center px-4 transition-transform duration-500 ease-in-out ${hidden ? '-translate-y-24' : 'translate-y-0'}`}>
      <nav className={`w-full max-w-5xl rounded-full transition-all duration-500 ease-out ${
        scrolled 
          ? 'bg-[var(--bg-primary)]/80 backdrop-blur-xl shadow-lg border border-[var(--border-light)] py-2 px-4' 
          : 'bg-[var(--bg-primary)]/40 backdrop-blur-md border border-[var(--border-light)]/50 py-3 px-6'
      }`}>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
          </Link>

          <div className="hidden md:flex gap-8 items-center px-6">
            <Link href="/#tentang" className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--primary)] hover:-translate-y-0.5 transition-all">
              {t.nav.about}
            </Link>
            <Link href="/#layanan" className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--primary)] hover:-translate-y-0.5 transition-all">
              {t.nav.services}
            </Link>
            <Link href="/produk" className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--primary)] hover:-translate-y-0.5 transition-all">
              {locale === 'id' ? 'Produk' : 'Products'}
            </Link>
            <Link href="/#kontak" className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--primary)] hover:-translate-y-0.5 transition-all">
              {t.nav.contact}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--primary)] transition-all duration-300 hover:rotate-12"
              title={t.settings.theme}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
              className="p-2.5 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--primary)] transition-all duration-300 flex items-center gap-1.5"
              title={t.settings.language}
            >
              <Languages className="h-5 w-5" />
              <span className="text-xs font-bold uppercase">{locale}</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
