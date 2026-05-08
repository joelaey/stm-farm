'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface PengeluaranFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    keterangan: string;
    uraian?: string;
    harga?: number;
    jumlah: number;
    tanggal?: string;
  }) => void;
}

export default function PengeluaranFormModal({ isOpen, onClose, onSave }: PengeluaranFormModalProps) {
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [keterangan, setKeterangan] = useState('');
  const [uraian, setUraian] = useState('');
  const [harga, setHarga] = useState<number | ''>('');
  const [jumlah, setJumlah] = useState<number | ''>('');

  const handleSave = () => {
    if (!keterangan.trim()) {
      alert('Masukkan keterangan');
      return;
    }
    if (!jumlah || Number(jumlah) <= 0) {
      alert('Masukkan jumlah yang valid');
      return;
    }

    onSave({
      tanggal: tanggal ? new Date(tanggal).toISOString() : undefined,
      keterangan: keterangan.trim(),
      uraian: uraian.trim() || undefined,
      harga: harga ? Number(harga) : undefined,
      jumlah: Number(jumlah)
    });

    // Reset
    setKeterangan('');
    setUraian('');
    setHarga('');
    setJumlah('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Pengeluaran Lainnya"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSave}>Simpan</Button>
        </>
      }
    >
      <div className="space-y-4 py-2">
        <Input
          label="Tanggal"
          type="date"
          value={tanggal}
          onChange={e => setTanggal(e.target.value)}
        />
        <Input
          label="Keterangan"
          placeholder="Contoh: Kiloan, B Hutang, Ongkir"
          value={keterangan}
          onChange={e => setKeterangan(e.target.value)}
        />
        <Input
          label="Uraian (Opsional)"
          placeholder="Penjelasan lebih lanjut"
          value={uraian}
          onChange={e => setUraian(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Harga (Opsional)"
            type="number"
            min={0}
            value={harga}
            onChange={e => setHarga(Number(e.target.value))}
            placeholder="0"
          />
          <Input
            label="Jumlah (Total Rp)"
            type="number"
            min={0}
            value={jumlah}
            onChange={e => setJumlah(Number(e.target.value))}
            placeholder="0"
          />
        </div>
      </div>
    </Modal>
  );
}
