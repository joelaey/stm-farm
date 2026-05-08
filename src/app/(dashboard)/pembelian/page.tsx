'use client';

import React, { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { useSettings } from '@/contexts/SettingsContext';
import { UBI_LABELS_PEMBELIAN, PembelianEntry } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Plus, Search, ClipboardEdit, Download } from 'lucide-react';
import SpreadsheetTable from '@/components/dashboard/SpreadsheetTable';
import EntryFormModal from '@/components/dashboard/EntryFormModal';

export default function PembelianPage() {
  const { t } = useSettings();
  const { pembelian, addPembelian, deletePembelian } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem('user_role') || 'admin');
  }, []);

  const filteredPembelian = pembelian.filter(p => 
    p.keterangan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (data: {
    bulan: string;
    tanggalNum: number;
    keterangan: string;
    nomorNota?: string;
    items: PembelianEntry['items'];
    jumlah: number;
    debit: number;
    kredit: number;
    tanggal: string;
  }) => {
    addPembelian({
      id: generateId(),
      tanggal: data.tanggal,
      bulan: data.bulan,
      tanggalNum: data.tanggalNum,
      keterangan: data.keterangan,
      nomorNota: data.nomorNota,
      items: data.items,
      jumlah: data.jumlah,
      debit: data.debit,
      kredit: data.kredit,
      createdAt: new Date().toISOString()
    });
  };

  const handleExportCSV = () => {
    // Prepare headers
    const ubiKeys = Object.keys(UBI_LABELS_PEMBELIAN);
    const headers = [
      'Tanggal', 'Keterangan', 'No. Nota',
      ...ubiKeys.map(k => `${UBI_LABELS_PEMBELIAN[k as keyof typeof UBI_LABELS_PEMBELIAN]} (Kg)`),
      ...ubiKeys.map(k => `${UBI_LABELS_PEMBELIAN[k as keyof typeof UBI_LABELS_PEMBELIAN]} (Rp/Kg)`),
      'Total (Rp)', 'Debit', 'Kredit'
    ];

    // Prepare rows
    const rows = filteredPembelian.map(p => {
      const ubiDataKg = ubiKeys.map(k => (p.items as any)[k]?.kg || 0);
      const ubiDataRp = ubiKeys.map(k => (p.items as any)[k]?.rpPerKg || 0);
      
      return [
        p.tanggal.split('T')[0],
        `"${p.keterangan.replace(/"/g, '""')}"`,
        `"${p.nomorNota || '-'}"`,
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
    link.setAttribute('download', `Pembelian_Data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isPekerja = role === 'pekerja_lapangan';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{t.dash.purchases}</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {isPekerja ? 'Catat data pembelian baru ke sistem' : 'Data pembelian per kategori ubi'}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
          {!isPekerja && (
            <div className="relative w-full sm:w-64 hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Cari keterangan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-[var(--border-medium)] bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          )}
          
          {!isPekerja && (
            <>
              <Button onClick={handleExportCSV} variant="outline" className="gap-2 shrink-0 hidden sm:flex border-[var(--border-medium)] hover:bg-[var(--bg-tertiary)]">
                <Download className="h-4 w-4" /> Export CSV
              </Button>
              <Button onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0 hidden sm:flex">
                <Plus className="h-4 w-4" /> {t.dash.addPurchase}
              </Button>
            </>
          )}
        </div>
      </div>

      {isPekerja ? (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-3xl p-12 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[var(--primary-light)] text-[var(--primary)] rounded-full flex items-center justify-center animate-bounce">
              <ClipboardEdit className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Input Pembelian Baru</h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
            Silakan masukkan data detail pembelian hasil panen dari petani ke dalam sistem melalui tombol di bawah ini.
          </p>
          <Button onClick={() => setIsModalOpen(true)} size="lg" className="rounded-full px-8 h-14 text-lg shadow-xl hover:scale-105 transition-transform gap-2">
            <Plus className="w-6 h-6" /> Tambah Pembelian
          </Button>
        </div>
      ) : (
        <>
          <div className="sm:hidden flex gap-2 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-[var(--border-medium)] bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <SpreadsheetTable
            entries={filteredPembelian}
            categoryLabels={UBI_LABELS_PEMBELIAN}
            onDelete={deletePembelian}
            title="Pembelian"
            showNomorNota
          />
        </>
      )}

      <EntryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        title={t.dash.addPurchase}
        categoryLabels={UBI_LABELS_PEMBELIAN}
        showNomorNota
      />
    </div>
  );
}
