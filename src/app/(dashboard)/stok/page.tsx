'use client';

import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useSettings } from '@/contexts/SettingsContext';
import { UBI_LABELS_STOK, StokEntry, UBI_CATEGORIES } from '@/lib/types';
import { generateId, formatRupiah } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Plus, RefreshCcw, Package, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import SpreadsheetTable from '@/components/dashboard/SpreadsheetTable';
import EntryFormModal from '@/components/dashboard/EntryFormModal';

export default function StokPage() {
  const { t, theme } = useSettings();
  const { stokEntries, stokSummary, addStok, deleteStok, recomputeStok } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (data: {
    bulan: string;
    tanggalNum: number;
    keterangan: string;
    items: StokEntry['items'];
    jumlah: number;
    debit: number;
    kredit: number;
    tanggal: string;
  }) => {
    addStok({
      id: generateId(),
      tanggal: data.tanggal,
      bulan: data.bulan,
      tanggalNum: data.tanggalNum,
      keterangan: data.keterangan,
      items: data.items,
      jumlah: data.jumlah,
      debit: data.debit,
      kredit: data.kredit,
      isManualOverride: true,
      createdAt: new Date().toISOString()
    });
  };

  const handleExportCSV = () => {
    const ubiKeys = Object.keys(UBI_LABELS_STOK);
    const headers = [
      'Tanggal', 'Keterangan',
      ...ubiKeys.map(k => `${UBI_LABELS_STOK[k as keyof typeof UBI_LABELS_STOK]} (Kg)`),
      ...ubiKeys.map(k => `${UBI_LABELS_STOK[k as keyof typeof UBI_LABELS_STOK]} (Rp)`),
      'Total (Rp)', 'Debit', 'Kredit'
    ];
    const rows = stokEntries.map(p => {
      const ubiDataKg = ubiKeys.map(k => (p.items as any)[k]?.kg || 0);
      const ubiDataRp = ubiKeys.map(k => (p.items as any)[k]?.rpPerKg || 0);
      return [
        p.tanggal.split('T')[0],
        `"${p.keterangan.replace(/"/g, '""')}"`,
        ...ubiDataKg,
        ...ubiDataRp,
        p.jumlah,
        p.debit,
        p.kredit
      ].join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Stok_Data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{t.dash.stock}</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Stok otomatis dari pembelian-penjualan, bisa diedit manual
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline" className="gap-2 hidden sm:flex border-[var(--border-medium)] hover:bg-[var(--bg-tertiary)]">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button variant="outline" onClick={recomputeStok} className="gap-2 hidden sm:flex">
            <RefreshCcw className="h-4 w-4" /> Hitung Ulang
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Tambah Stok
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {stokSummary.map((item, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
                  <Package className="h-4 w-4 text-[var(--primary)]" />
                </div>
                <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase">{item.jenisUbi}</span>
              </div>
              <div className="text-xl font-bold text-[var(--text-primary)]">{item.stokSaatIni} Kg</div>
              <div className="text-xs text-[var(--text-tertiary)] mt-1">
                +{item.totalMasuk} / -{item.totalKeluar}
              </div>
            </CardContent>
          </Card>
        ))}
        {stokSummary.length === 0 && (
          <div className="col-span-full py-4 text-center text-[var(--text-secondary)]">
            {t.noData}
          </div>
        )}
      </div>

      {/* Spreadsheet Table */}
      <SpreadsheetTable
        entries={stokEntries}
        categoryLabels={UBI_LABELS_STOK}
        onDelete={deleteStok}
        title="Stok"
      />

      <EntryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        title="Tambah Stok Manual"
        categoryLabels={UBI_LABELS_STOK}
      />
    </div>
  );
}
