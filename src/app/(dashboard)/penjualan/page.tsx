'use client';

import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useSettings } from '@/contexts/SettingsContext';
import { UBI_LABELS_PENJUALAN, PenjualanEntry } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Search, Download } from 'lucide-react';
import SpreadsheetTable from '@/components/dashboard/SpreadsheetTable';
import EntryFormModal from '@/components/dashboard/EntryFormModal';

export default function PenjualanPage() {
  const { t } = useSettings();
  const { penjualan, addPenjualan, updatePenjualan, deletePenjualan } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPenjualan = penjualan.filter(p => 
    p.keterangan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (data: any) => {
    if (editingData) {
      updatePenjualan(editingData.id, data);
    } else {
      addPenjualan({
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
    }
    setEditingData(null);
  };

  const handleExportCSV = () => {
    const ubiKeys = Object.keys(UBI_LABELS_PENJUALAN);
    const headers = [
      'Tanggal', 'Keterangan', 'No. Nota',
      ...ubiKeys.map(k => `${UBI_LABELS_PENJUALAN[k as keyof typeof UBI_LABELS_PENJUALAN]} (Kg)`),
      ...ubiKeys.map(k => `${UBI_LABELS_PENJUALAN[k as keyof typeof UBI_LABELS_PENJUALAN]} (Rp/Kg)`),
      'Total (Rp)', 'Debit', 'Kredit'
    ];
    const rows = filteredPenjualan.map(p => {
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
    link.setAttribute('download', `Penjualan_Data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{t.dash.sales}</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Data penjualan per kategori ubi
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder="Cari keterangan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-[var(--border-medium)] bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <Button onClick={handleExportCSV} variant="outline" className="gap-2 shrink-0 hidden sm:flex border-[var(--border-medium)] hover:bg-[var(--bg-tertiary)]">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" /> {t.dash.addSale}
          </Button>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-2xl p-4 sm:p-6 shadow-sm overflow-x-auto overflow-y-hidden mt-6">
        <SpreadsheetTable
          entries={filteredPenjualan}
          categoryLabels={UBI_LABELS_PENJUALAN}
          onDelete={deletePenjualan}
          onEdit={(entry) => {
            setEditingData(entry);
            setIsModalOpen(true);
          }}
          title="Penjualan"
          showNomorNota
        />
      </div>

      {(isModalOpen || editingData) && (
        <EntryFormModal
          isOpen={isModalOpen || !!editingData}
          onClose={() => {
            setIsModalOpen(false);
            setEditingData(null);
          }}
          onSave={handleSave}
          title={editingData ? "Edit Penjualan" : t.dash.addSale}
          categoryLabels={UBI_LABELS_PENJUALAN}
          showNomorNota
          initialData={editingData}
        />
      )}
    </div>
  );
}
