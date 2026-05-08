'use client';

import React, { useState, useMemo } from 'react';
import { UBI_CATEGORIES, UbiCategory, UbiCategoryData, createEmptyItems, calculateJumlah } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface EntryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    bulan: string;
    tanggalNum: number;
    keterangan: string;
    nomorNota?: string;
    items: Record<UbiCategory, UbiCategoryData>;
    jumlah: number;
    debit: number;
    kredit: number;
    tanggal: string;
  }) => void;
  title: string;
  categoryLabels: Record<UbiCategory, string>;
  showNomorNota?: boolean;
}

const BULAN_OPTIONS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function EntryFormModal({ isOpen, onClose, onSave, title, categoryLabels, showNomorNota = false }: EntryFormModalProps) {
  const [bulan, setBulan] = useState(BULAN_OPTIONS[new Date().getMonth()]);
  const [tanggalNum, setTanggalNum] = useState(new Date().getDate());
  const [keterangan, setKeterangan] = useState('');
  const [nomorNota, setNomorNota] = useState('');
  const [items, setItems] = useState<Record<UbiCategory, UbiCategoryData>>(createEmptyItems());
  const [debit, setDebit] = useState(0);
  const [kredit, setKredit] = useState(0);

  const jumlah = useMemo(() => calculateJumlah(items), [items]);

  const handleItemChange = (cat: UbiCategory, field: 'kg' | 'rpPerKg', value: number) => {
    setItems(prev => ({
      ...prev,
      [cat]: { ...prev[cat], [field]: value }
    }));
  };

  const handleSave = () => {
    if (!keterangan.trim()) {
      alert('Masukkan keterangan/nama');
      return;
    }

    const monthIndex = BULAN_OPTIONS.indexOf(bulan);
    const year = new Date().getFullYear();
    const tanggalDate = new Date(year, monthIndex, tanggalNum);

    onSave({
      bulan,
      tanggalNum,
      keterangan: keterangan.trim(),
      nomorNota: nomorNota.trim() || undefined,
      items,
      jumlah,
      debit,
      kredit,
      tanggal: tanggalDate.toISOString()
    });

    // Reset form
    setKeterangan('');
    setNomorNota('');
    setItems(createEmptyItems());
    setDebit(0);
    setKredit(0);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSave}>Simpan</Button>
        </>
      }
    >
      <div className="space-y-4 py-2" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {/* Bulan & Tanggal */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Bulan</label>
            <select
              value={bulan}
              onChange={e => setBulan(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border-light)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              {BULAN_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <Input
            label="Tanggal"
            type="number"
            min={1}
            max={31}
            value={tanggalNum}
            onChange={e => setTanggalNum(Number(e.target.value))}
          />
        </div>

        {/* Keterangan & Nomor Nota */}
        <div className={showNomorNota ? "grid grid-cols-2 gap-3" : ""}>
          <Input
            label="Keterangan (Nama)"
            placeholder="Contoh: Pak Michael"
            value={keterangan}
            onChange={e => setKeterangan(e.target.value)}
          />
          {showNomorNota && (
            <Input
              label="No. Nota"
              placeholder="Contoh: J-001"
              value={nomorNota}
              onChange={e => setNomorNota(e.target.value)}
            />
          )}
        </div>

        {/* Per-category inputs */}
        <div>
          <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">Data per Kategori Ubi</p>
          <div className="space-y-1">
            {/* Header */}
            <div className="form-grid-ubi" style={{ marginBottom: 4 }}>
              <span className="text-xs text-[var(--text-tertiary)] text-center">Kat.</span>
              <span className="text-xs text-[var(--text-tertiary)] text-center">Kg</span>
              <span className="text-xs text-[var(--text-tertiary)] text-center">Rp/Kg</span>
            </div>
            {UBI_CATEGORIES.map(cat => (
              <div key={cat} className="form-grid-ubi">
                <div className="category-label">{categoryLabels[cat]}</div>
                <input
                  type="number"
                  min={0}
                  value={items[cat].kg || ''}
                  onChange={e => handleItemChange(cat, 'kg', Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-2 py-1.5 rounded-md border border-[var(--border-light)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm text-center focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
                <input
                  type="number"
                  min={0}
                  value={items[cat].rpPerKg || ''}
                  onChange={e => handleItemChange(cat, 'rpPerKg', Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-2 py-1.5 rounded-md border border-[var(--border-light)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm text-center focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Computed jumlah */}
        <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg">
          <p className="text-xs text-[var(--text-secondary)]">Total Jumlah (auto)</p>
          <p className="text-xl font-bold text-[var(--text-primary)]">{formatRupiah(jumlah)}</p>
        </div>

        {/* Debit & Kredit */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Debit (Rp)"
            type="number"
            min={0}
            value={debit || ''}
            onChange={e => setDebit(Number(e.target.value))}
          />
          <Input
            label="Kredit (Rp)"
            type="number"
            min={0}
            value={kredit || ''}
            onChange={e => setKredit(Number(e.target.value))}
          />
        </div>
      </div>
    </Modal>
  );
}
