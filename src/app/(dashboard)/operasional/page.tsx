'use client';

import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useSettings } from '@/contexts/SettingsContext';
import { OperasionalEntry, OperasionalCategory } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Plus, Download } from 'lucide-react';
import OperasionalTable from '@/components/dashboard/OperasionalTable';
import OperasionalFormModal from '@/components/dashboard/OperasionalFormModal';

export default function OperasionalPage() {
  const { t } = useSettings();
  const { operasional, addOperasional, deleteOperasional } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (data: {
    bulan: string;
    tanggalNum: number;
    keterangan: string;
    items: Record<OperasionalCategory, number>;
    jumlah: number;
    tanggal: string;
  }) => {
    addOperasional({
      id: generateId(),
      tanggal: data.tanggal,
      bulan: data.bulan,
      tanggalNum: data.tanggalNum,
      keterangan: data.keterangan,
      items: data.items,
      jumlah: data.jumlah,
      createdAt: new Date().toISOString()
    });
  };

  const handleExportCSV = () => {
    const categories = ['Ongkos', 'Panen', 'Cuci', 'Sortasi', 'Dll'] as const;
    const headers = [
      'Tanggal', 'Keterangan',
      ...categories,
      'Total (Rp)'
    ];
    const rows = operasional.map(p => {
      const catData = categories.map(k => (p.items as any)[k] || 0);
      return [
        p.tanggal.split('T')[0],
        `"${p.keterangan.replace(/"/g, '""')}"`,
        ...catData,
        p.jumlah
      ].join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Operasional_Data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{t.dash.operational}</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Data biaya operasional
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline" className="gap-2 hidden sm:flex border-[var(--border-medium)] hover:bg-[var(--bg-tertiary)]">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Tambah Operasional
          </Button>
        </div>
      </div>

      <OperasionalTable
        entries={operasional}
        onDelete={deleteOperasional}
      />

      <OperasionalFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
