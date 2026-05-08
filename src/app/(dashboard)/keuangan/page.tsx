'use client';

import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useData } from '@/contexts/DataContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function KeuanganPage() {
  const { t } = useSettings();
  const { keuangan } = useData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{t.dash.finance}</h1>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title={t.dash.totalIncome}
          value={formatRupiah(keuangan.totalPemasukan)}
          icon={TrendingUp}
          className="border-[var(--success)] border-l-4"
        />
        <StatCard
          title={t.dash.totalExpense}
          value={formatRupiah(keuangan.totalPengeluaran)}
          icon={TrendingDown}
          className="border-[var(--danger)] border-l-4"
        />
        <StatCard
          title={t.dash.netProfit}
          value={formatRupiah(keuangan.profit)}
          icon={DollarSign}
          className="border-[var(--primary)] border-l-4"
        />
      </div>

      {/* Piutang & Hutang */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-[var(--warning)] border-t-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">{t.dash.receivables} (Piutang)</CardTitle>
            <AlertCircle className="h-5 w-5 text-[var(--warning)]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[var(--text-primary)]">{formatRupiah(keuangan.piutang)}</div>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Total tagihan ke pelanggan yang belum dibayar lunas.</p>
          </CardContent>
        </Card>

        <Card className="border-[var(--danger)] border-t-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">{t.dash.payables} (Hutang)</CardTitle>
            <AlertCircle className="h-5 w-5 text-[var(--danger)]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[var(--text-primary)]">{formatRupiah(keuangan.hutang)}</div>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Total tagihan ke pemasok yang belum kita bayar lunas.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
