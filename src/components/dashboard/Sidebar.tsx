'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSettings } from '@/contexts/SettingsContext';
import { 
  LayoutDashboard, ShoppingCart, ShoppingBag, 
  Package, DollarSign, Settings, LogOut,
  ClipboardList, Receipt, Users
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useSettings();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Read role from local storage on mount
    const savedRole = localStorage.getItem('user_role');
    setRole(savedRole || 'admin'); // default to admin if not set (for safety in mock)
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('user_role');
    router.push('/login');
  };

  const adminNavigation = [
    { name: t.dash.overview, href: '/dashboard', icon: LayoutDashboard },
    { name: t.dash.purchases, href: '/pembelian', icon: ShoppingBag },
    { name: t.dash.sales, href: '/penjualan', icon: ShoppingCart },
    { name: t.dash.stock, href: '/stok', icon: Package },
    { name: t.dash.finance, href: '/keuangan', icon: DollarSign },
    { name: t.dash.operational, href: '/operasional', icon: ClipboardList },
    { name: t.dash.expenses, href: '/pengeluaran', icon: Receipt },
    { name: 'Manajemen User', href: '/users', icon: Users },
  ];

  const pekerjaNavigation = [
    { name: t.dash.purchases, href: '/pembelian', icon: ShoppingBag },
  ];

  const navigation = role === 'pekerja_lapangan' ? pekerjaNavigation : adminNavigation;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border-light)] transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-[var(--border-light)] shrink-0">
          <Link href="/" className="flex items-center justify-center">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm hover:scale-105 transition-transform">
              <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-[var(--primary-light)] text-[var(--primary)]" 
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-[var(--primary)]" : "text-[var(--text-tertiary)]")} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[var(--border-light)]">
          <a
            href="#"
            onClick={handleLogout}
            className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors w-full cursor-pointer"
          >
            <LogOut className="mr-3 h-5 w-5" />
            {t.dash.logout}
          </a>
        </div>
      </div>
    </>
  );
}
