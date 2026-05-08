'use client';

import React, { useState, useMemo } from 'react';
import { OPERASIONAL_CATEGORIES, OperasionalCategory, createEmptyOperasionalItems, calculateOperasionalJumlah } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface OperasionalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    bulan: string;
    tanggalNum: number;
    keterangan: string;
    items: Record<OperasionalCategory, number>;
    jumlah: number;
    tanggal: string;
  }) => void;
  initialData?: any;
}

const BULAN_OPTIONS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function OperasionalFormModal({ isOpen, onClose, onSave, initialData }: OperasionalFormModalProps) {
  const [bulan, setBulan] = useState(BULAN_OPTIONS[new Date().getMonth()]);
  const [tanggalNum, setTanggalNum] = useState(new Date().getDate());
  const [keterangan, setKeterangan] = useState('');
  const [items, setItems] = useState<Record<OperasionalCategory, number>>(createEmptyOperasionalItems());

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setBulan(initialData.bulan);
        setTanggalNum(initialData.tanggalNum);
        setKeterangan(initialData.keterangan);
        setItems(initialData.items || createEmptyOperasionalItems());
      } else {
        setBulan(BULAN_OPTIONS[new Date().getMonth()]);
        setTanggalNum(new Date().getDate());
        setKeterangan('');
        setItems(createEmptyOperasionalItems());
      }
    }
  }, [isOpen, initialData]);

  const jumlah = useMemo(() => calculateOperasionalJumlah(items), [items]);

  const handleItemChange = (cat: OperasionalCategory, value: number) => {
    setItems(prev => ({
      ...prev,
      [cat]: value
    }));
  };

  const handleSave = () => {
    if (!keterangan.trim()) {
      alert('Masukkan keterangan/uraian');
      return;
    }

    const monthIndex = BULAN_OPTIONS.indexOf(bulan);
    const year = new Date().getFullYear();
    const tanggalDate = new Date(year, monthIndex, tanggalNum);

    onSave({
      bulan,
      tanggalNum,
      keterangan: keterangan.trim(),
      items,
      jumlah,
      tanggal: tanggalDate.toISOString()
    });

    // Reset
    setKeterangan('');
    setItems(createEmptyOperasionalItems());
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Operasional"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSave}>Simpan</Button>
        </>
      }
    >
      <div className="space-y-4 py-2" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
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

        <Input
          label="Keterangan (Uraian)"
          placeholder="Contoh: Kuningan, Ciparay"
          value={keterangan}
          onChange={e => setKeterangan(e.target.value)}
        />

        <div>
          <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">Data Uraian (Rp)</p>
          <div className="space-y-2">
            {OPERASIONAL_CATEGORIES.map(cat => (
              <div key={cat} className="flex items-center gap-3">
                <div className="w-24 text-sm text-[var(--text-primary)] font-medium">{cat}</div>
                <input
                  type="number"
                  min={0}
                  value={items[cat] || ''}
                  onChange={e => handleItemChange(cat, Number(e.target.value))}
                  placeholder="0"
                  className="flex-1 px-3 py-2 rounded-lg border border-[var(--border-light)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg">
          <p className="text-xs text-[var(--text-secondary)]">Total Jumlah (auto)</p>
          <p className="text-xl font-bold text-[var(--text-primary)]">{formatRupiah(jumlah)}</p>
        </div>
      </div>
    </Modal>
  );
}
