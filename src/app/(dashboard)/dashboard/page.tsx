'use client';

import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useData } from '@/contexts/DataContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { ShoppingBag, ShoppingCart, TrendingUp, TrendingDown, Package } from 'lucide-react';
import { formatRupiah, formatTanggal, getToday } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { UBI_CATEGORIES } from '@/lib/types';

export default function DashboardOverview() {
  const { t, locale } = useSettings();
  const { pembelian, penjualan, stokSummary, keuangan } = useData();

  const today = getToday().split('T')[0];

  const todayPurchases = pembelian
    .filter(p => p.tanggal.startsWith(today))
    .reduce((acc, curr) => acc + curr.jumlah, 0);
  const todaySales = penjualan
    .filter(p => p.tanggal.startsWith(today))
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  const totalStok = stokSummary.reduce((acc, curr) => acc + curr.stokSaatIni, 0);

  // Prepare chart data (last 7 days)
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const chartData = last7Days.map(date => {
    const p = pembelian.filter(x => x.tanggal.startsWith(date)).reduce((sum, item) => sum + item.jumlah, 0);
    const s = penjualan.filter(x => x.tanggal.startsWith(date)).reduce((sum, item) => sum + item.jumlah, 0);
    return {
      name: formatTanggal(date, locale).split(' ')[0] + ' ' + formatTanggal(date, locale).split(' ')[1],
      Pembelian: p,
      Penjualan: s,
      Profit: s - p
    };
  });

  // Recent transactions (combine and sort)
  const recentTransactions = [
    ...pembelian.map(p => ({ ...p, type: 'Beli' as const })),
    ...penjualan.map(p => ({ ...p, type: 'Jual' as const }))
  ].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{t.dash.overview}</h1>
        <p className="text-[var(--text-secondary)]">{t.dash.welcome}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t.dash.todayPurchases}
          value={formatRupiah(todayPurchases)}
          icon={ShoppingBag}
        />
        <StatCard
          title={t.dash.todaySales}
          value={formatRupiah(todaySales)}
          icon={ShoppingCart}
        />
        <StatCard
          title={t.dash.totalProfit}
          value={formatRupiah(keuangan.profit)}
          icon={keuangan.profit >= 0 ? TrendingUp : TrendingDown}
          trend={{ value: 12, isPositive: keuangan.profit >= 0 }}
        />
        <StatCard
          title={t.dash.totalStock}
          value={`${totalStok} Kg`}
          icon={Package}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard
          title={t.dash.profitTrend}
          data={chartData}
          xKey="name"
          yKey1="Penjualan"
          yKey2="Pembelian"
          color1="var(--primary)"
          color2="var(--accent)"
        />

        {/* Stok Overview */}
        <Card>
          <CardHeader>
            <CardTitle>{t.dash.stock}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stokSummary.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-[var(--text-primary)]">{item.jenisUbi}</p>
                    <p className="text-xs text-[var(--text-secondary)]">In: {item.totalMasuk}kg | Out: {item.totalKeluar}kg</p>
                  </div>
                  <div className="font-medium text-[var(--text-primary)]">{item.stokSaatIni} Kg</div>
                </div>
              ))}
              {stokSummary.length === 0 && (
                <p className="text-sm text-[var(--text-secondary)] text-center py-4">{t.noData}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t.dash.recentTransactions}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.form.date}</TableHead>
                <TableHead>{t.form.type}</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead className="text-right">{t.form.totalPrice}</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Kredit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((trx, idx) => (
                <TableRow key={idx}>
                  <TableCell>{formatTanggal(trx.tanggal, locale)}</TableCell>
                  <TableCell>
                    <Badge variant={trx.type === 'Jual' ? 'success' : 'warning'}>
                      {trx.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{trx.keterangan}</TableCell>
                  <TableCell className="text-right font-medium">{formatRupiah(trx.jumlah)}</TableCell>
                  <TableCell className="text-right">{formatRupiah(trx.debit)}</TableCell>
                  <TableCell className="text-right">{formatRupiah(trx.kredit)}</TableCell>
                </TableRow>
              ))}
              {recentTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-[var(--text-secondary)]">
                    {t.noData}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
