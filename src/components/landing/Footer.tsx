'use client';

import React from 'react';
import Link from 'next/link';
import { useSettings } from '@/contexts/SettingsContext';

export function Footer() {
  const { t } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border-light)] bg-[var(--bg-secondary)]">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-[var(--primary)]">{t.appName}</span>
            </Link>
            <p className="text-[var(--text-secondary)] max-w-sm">
              {t.landing.footerDesc}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">{t.landing.footerLinks}</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><Link href="#tentang" className="hover:text-[var(--primary)]">{t.nav.about}</Link></li>
              <li><Link href="#layanan" className="hover:text-[var(--primary)]">{t.nav.services}</Link></li>
              <li><Link href="#kontak" className="hover:text-[var(--primary)]">{t.nav.contact}</Link></li>
              <li><Link href="/dashboard" className="hover:text-[var(--primary)]">{t.nav.dashboard}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">{t.landing.footerContact}</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>stmfarmoffice@gmail.com</li>
              <li>+62 899 7777 592</li>
              <li className="pt-2">IG: @stmfarm.co</li>
              <li>TikTok: @stmfarm.co</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-[var(--border-light)] flex flex-col md:flex-row items-center justify-between text-sm text-[var(--text-tertiary)]">
          <p>© {currentYear} {t.appName}. {t.landing.footerRights}</p>
        </div>
      </div>
    </footer>
  );
}
