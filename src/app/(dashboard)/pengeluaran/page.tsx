'use client';

import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useSettings } from '@/contexts/SettingsContext';
import { generateId } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Plus, Download } from 'lucide-react';
import PengeluaranTable from '@/components/dashboard/PengeluaranTable';
import PengeluaranFormModal from '@/components/dashboard/PengeluaranFormModal';

export default function PengeluaranPage() {
  const { t } = useSettings();
  const { pengeluaran, addPengeluaran, deletePengeluaran } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (data: {
    keterangan: string;
    uraian?: string;
    harga?: number;
    jumlah: number;
    tanggal?: string;
  }) => {
    addPengeluaran({
      id: generateId(),
      tanggal: data.tanggal || new Date().toISOString(),
      keterangan: data.keterangan,
      uraian: data.uraian,
      harga: data.harga,
      jumlah: data.jumlah,
      createdAt: new Date().toISOString()
    });
  };

  const handleExportCSV = () => {
    const headers = [
      'Tanggal', 'Keterangan', 'Uraian', 'Harga Satuan (Rp)', 'Total (Rp)'
    ];
    const rows = pengeluaran.map(p => {
      return [
        (p.tanggal || p.createdAt).split('T')[0],
        `"${p.keterangan.replace(/"/g, '""')}"`,
        `"${(p.uraian || '').replace(/"/g, '""')}"`,
        p.harga || 0,
        p.jumlah
      ].join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Pengeluaran_Data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{t.dash.expenses}</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Data pengeluaran lainnya
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline" className="gap-2 hidden sm:flex border-[var(--border-medium)] hover:bg-[var(--bg-tertiary)]">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Tambah Pengeluaran
          </Button>
        </div>
      </div>

      <PengeluaranTable
        entries={pengeluaran}
        onDelete={deletePengeluaran}
      />

      <PengeluaranFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
