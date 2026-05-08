'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  PenjualanEntry, PembelianEntry, StokEntry,
  OperasionalEntry, PengeluaranEntry,
  StokItem, RingkasanKeuangan, UBI_CATEGORIES, UbiCategory,
  createEmptyItems, calculateJumlah
} from '@/lib/types';
import { store } from '@/lib/store';

interface DataContextType {
  penjualan: PenjualanEntry[];
  pembelian: PembelianEntry[];
  stokEntries: StokEntry[];
  stokSummary: StokItem[];
  keuangan: RingkasanKeuangan;
  operasional: OperasionalEntry[];
  pengeluaran: PengeluaranEntry[];

  // Actions
  refreshData: () => void;
  addPembelian: (data: PembelianEntry) => void;
  updatePembelian: (id: string, data: Partial<PembelianEntry>) => void;
  deletePembelian: (id: string) => void;
  addPenjualan: (data: PenjualanEntry) => void;
  updatePenjualan: (id: string, data: Partial<PenjualanEntry>) => void;
  deletePenjualan: (id: string) => void;
  addStok: (data: StokEntry) => void;
  updateStok: (id: string, data: Partial<StokEntry>) => void;
  deleteStok: (id: string) => void;
  recomputeStok: () => void;
  addOperasional: (data: OperasionalEntry) => void;
  deleteOperasional: (id: string) => void;
  addPengeluaran: (data: PengeluaranEntry) => void;
  deletePengeluaran: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [penjualan, setPenjualan] = useState<PenjualanEntry[]>([]);
  const [pembelian, setPembelian] = useState<PembelianEntry[]>([]);
  const [stokEntries, setStokEntries] = useState<StokEntry[]>([]);
  const [operasional, setOperasional] = useState<OperasionalEntry[]>([]);
  const [pengeluaran, setPengeluaran] = useState<PengeluaranEntry[]>([]);

  // Derived state
  const [stokSummary, setStokSummary] = useState<StokItem[]>([]);
  const [keuangan, setKeuangan] = useState<RingkasanKeuangan>({
    totalPemasukan: 0, totalPengeluaran: 0, profit: 0, piutang: 0, hutang: 0
  });

  const calculateDerivedData = (pem: PembelianEntry[], pen: PenjualanEntry[], ops: OperasionalEntry[], klr: PengeluaranEntry[]) => {
    // 1. Calculate StokSummary
    const stokMap = new Map<string, StokItem>();
    UBI_CATEGORIES.forEach(cat => {
      const totalMasuk = pem.reduce((sum, p) => sum + (p.items[cat]?.kg || 0), 0);
      const totalKeluar = pen.reduce((sum, p) => sum + (p.items[cat]?.kg || 0), 0);
      if (totalMasuk > 0 || totalKeluar > 0) {
        stokMap.set(cat, { jenisUbi: cat, totalMasuk, totalKeluar, stokSaatIni: totalMasuk - totalKeluar });
      }
    });
    setStokSummary(Array.from(stokMap.values()));

    // 2. Calculate Keuangan
    let totalPemasukan = 0;
    let totalPengeluaran = 0;
    let piutang = 0;
    let hutang = 0;

    pem.forEach(p => { totalPengeluaran += p.jumlah; hutang += p.kredit; });
    pen.forEach(p => { totalPemasukan += p.jumlah; piutang += p.kredit; });

    // Add operasional & pengeluaran to total expenses
    ops.forEach(o => { totalPengeluaran += o.jumlah; });
    klr.forEach(k => { totalPengeluaran += k.jumlah; });

    setKeuangan({
      totalPemasukan,
      totalPengeluaran,
      profit: totalPemasukan - totalPengeluaran,
      piutang,
      hutang
    });
  };

  const refreshData = async () => {
    try {
      const [pemRes, penRes, stkRes, opsRes, klrRes] = await Promise.all([
        fetch('/api/pembelian'),
        fetch('/api/penjualan'),
        fetch('/api/stok'),
        fetch('/api/operasional'),
        fetch('/api/pengeluaran')
      ]);

      const pem = pemRes.ok ? await pemRes.json() : [];
      const pen = penRes.ok ? await penRes.json() : [];
      const stk = stkRes.ok ? await stkRes.json() : [];
      const ops = opsRes.ok ? await opsRes.json() : [];
      const klr = klrRes.ok ? await klrRes.json() : [];

      setPembelian(pem);
      setPenjualan(pen);
      setStokEntries(stk);
      setOperasional(ops);
      setPengeluaran(klr);

      calculateDerivedData(pem, pen, ops, klr);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const recomputeStok = () => {
    // keeping as is for now, relies on latest pem and pen states
    const stokMap: Record<UbiCategory, number> = { M: 0, AB: 0, TO: 0, ARB: 0, ARS: 0, DOT: 0, KC: 0 };
    pembelian.forEach(p => { UBI_CATEGORIES.forEach(cat => { stokMap[cat] += (p.items as any)[cat]?.kg || 0; }); });
    penjualan.forEach(p => { UBI_CATEGORIES.forEach(cat => { stokMap[cat] -= (p.items as any)[cat]?.kg || 0; }); });
    const items = createEmptyItems();
    UBI_CATEGORIES.forEach(cat => { items[cat] = { kg: Math.max(0, stokMap[cat]), rpPerKg: 0 }; });
    const newStok: StokEntry = {
      id: 'stk_auto_' + Date.now(),
      tanggal: new Date().toISOString(),
      bulan: new Date().toLocaleDateString('id-ID', { month: 'long' }),
      tanggalNum: new Date().getDate(),
      keterangan: 'Auto-computed',
      items,
      jumlah: calculateJumlah(items),
      debit: 0,
      kredit: calculateJumlah(items),
      createdAt: new Date().toISOString()
    };
    addStok(newStok);
  };

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generic fetcher
  const apiCall = async (url: string, method: string, body?: any) => {
    try {
      await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined
      });
      refreshData();
    } catch(e) {
      console.error(e);
    }
  };

  // CRUD wrappers
  const addPembelian = (data: PembelianEntry) => apiCall('/api/pembelian', 'POST', data);
  const updatePembelian = (id: string, data: Partial<PembelianEntry>) => {}; // not fully implemented on backend yet
  const deletePembelian = (id: string) => apiCall(`/api/pembelian/${id}`, 'DELETE');
  
  const addPenjualan = (data: PenjualanEntry) => apiCall('/api/penjualan', 'POST', data);
  const updatePenjualan = (id: string, data: Partial<PenjualanEntry>) => {}; 
  const deletePenjualan = (id: string) => apiCall(`/api/penjualan/${id}`, 'DELETE');
  
  const addStok = (data: StokEntry) => apiCall('/api/stok', 'POST', data);
  const updateStok = (id: string, data: Partial<StokEntry>) => {}; 
  const deleteStok = (id: string) => apiCall(`/api/stok/${id}`, 'DELETE');
  
  const addOperasional = (data: OperasionalEntry) => apiCall('/api/operasional', 'POST', data);
  const deleteOperasional = (id: string) => apiCall(`/api/operasional/${id}`, 'DELETE');
  
  const addPengeluaran = (data: PengeluaranEntry) => apiCall('/api/pengeluaran', 'POST', data);
  const deletePengeluaran = (id: string) => apiCall(`/api/pengeluaran/${id}`, 'DELETE');

  return (
    <DataContext.Provider value={{
      penjualan, pembelian, stokEntries, stokSummary, keuangan,
      operasional, pengeluaran,
      refreshData, addPembelian, updatePembelian, deletePembelian,
      addPenjualan, updatePenjualan, deletePenjualan,
      addStok, updateStok, deleteStok, recomputeStok,
      addOperasional, deleteOperasional,
      addPengeluaran, deletePengeluaran
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
