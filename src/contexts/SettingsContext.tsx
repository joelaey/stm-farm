'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Locale, Theme } from '@/lib/types';
import { translations, TranslationKeys } from '@/lib/i18n';

interface SettingsContextType {
  theme: Theme;
  locale: Locale;
  setTheme: (theme: Theme) => void;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [locale, setLocaleState] = useState<Locale>('id');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const savedTheme = localStorage.getItem('fafarm_theme') as Theme;
    const savedLocale = localStorage.getItem('fafarm_locale') as Locale;
    
    if (savedTheme) {
      setThemeState(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('dark');
      document.documentElement.classList.add('dark');
    }

    if (savedLocale) {
      setLocaleState(savedLocale);
    }
    
    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('fafarm_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('fafarm_locale', newLocale);
  };

  // Remove the block that prevents rendering context on SSR
  // Just render with default values on server to avoid context error

  const t = translations[locale];

  return (
    <SettingsContext.Provider value={{ theme, locale, setTheme, setLocale, t }}>
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
