'use client';

import React from 'react';
import { Menu, Bell, Sun, Moon, Languages } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { t, theme, locale, setTheme, setLocale } = useSettings();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-[var(--border-light)] bg-[var(--bg-secondary)] px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-[var(--text-secondary)] lg:hidden hover:bg-[var(--bg-tertiary)] rounded-md"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-[var(--border-light)] lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 items-center justify-end gap-x-4 lg:gap-x-6">
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            title={t.settings.theme}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
            className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors flex items-center gap-1"
            title={t.settings.language}
          >
            <Languages className="h-5 w-5" />
            <span className="text-xs font-bold uppercase">{locale}</span>
          </button>

          {/* Notifications */}
          <button type="button" className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors relative">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--danger)]"></span>
          </button>
        </div>

        {/* Separator */}
        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-[var(--border-light)]" aria-hidden="true" />

        {/* User profile dropdown - static for now */}
        <div className="flex items-center gap-x-4">
          <div className="h-8 w-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm">
            AD
          </div>
          <span className="hidden lg:flex lg:items-center">
            <span className="text-sm font-semibold leading-6 text-[var(--text-primary)]" aria-hidden="true">
              Admin
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}
