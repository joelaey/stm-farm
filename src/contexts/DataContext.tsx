'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
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
  updateOperasional: (id: string, data: Partial<OperasionalEntry>) => void;
  deleteOperasional: (id: string) => void;
  addPengeluaran: (data: PengeluaranEntry) => void;
  updatePengeluaran: (id: string, data: Partial<PengeluaranEntry>) => void;
  deletePengeluaran: (id: string) => void;
  withConfirm: (action: 'add' | 'delete' | 'edit', fn: () => Promise<any> | void, customMessage?: string) => void;
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
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    message: '',
    onConfirm: () => {}
  });

  const apiCall = async (endpoint: string, method: string, body?: any, successMessage?: string) => {
    try {
      const res = await fetch(endpoint, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined
      });
      if (!res.ok) throw new Error('Respons server gagal');
      if (successMessage) toast.success(successMessage);
      refreshData();
      return true;
    } catch(e: any) {
      toast.error(e.message || 'Terjadi kesalahan sistem');
      console.error(e);
      return false;
    }
  };

  const withConfirm = (action: 'add' | 'delete' | 'edit', fn: () => Promise<any> | void, customMessage?: string) => {
    const message = customMessage || (
      action === 'delete' 
        ? 'Apakah Anda yakin ingin menghapus data ini? Aksi ini tidak dapat dibatalkan.' 
        : action === 'edit' ? 'Apakah Anda yakin ingin menyimpan perubahan data ini?' : 'Apakah Anda yakin ingin menyimpan data baru ini?'
    );

    setConfirmState({
      isOpen: true,
      message,
      onConfirm: async () => {
        setConfirmState(prev => ({ ...prev, isOpen: false }));
        await fn();
      }
    });
  };

  // CRUD wrappers
  const addPembelian = (data: PembelianEntry) => withConfirm('add', () => apiCall('/api/pembelian', 'POST', data, 'Pembelian berhasil ditambahkan!'));
  const updatePembelian = (id: string, data: Partial<PembelianEntry>) => withConfirm('edit', () => apiCall(`/api/pembelian/${id}`, 'PATCH', data, 'Pembelian berhasil diperbarui!'));
  const deletePembelian = (id: string) => withConfirm('delete', () => apiCall(`/api/pembelian/${id}`, 'DELETE', undefined, 'Pembelian berhasil dihapus!'));
  
  const addPenjualan = (data: PenjualanEntry) => withConfirm('add', () => apiCall('/api/penjualan', 'POST', data, 'Penjualan berhasil ditambahkan!'));
  const updatePenjualan = (id: string, data: Partial<PenjualanEntry>) => withConfirm('edit', () => apiCall(`/api/penjualan/${id}`, 'PATCH', data, 'Penjualan berhasil diperbarui!'));
  const deletePenjualan = (id: string) => withConfirm('delete', () => apiCall(`/api/penjualan/${id}`, 'DELETE', undefined, 'Penjualan berhasil dihapus!'));
  
  const addStok = (data: StokEntry) => withConfirm('add', () => apiCall('/api/stok', 'POST', data, 'Stok berhasil ditambahkan!'));
  const updateStok = (id: string, data: Partial<StokEntry>) => withConfirm('edit', () => apiCall(`/api/stok/${id}`, 'PATCH', data, 'Stok berhasil diperbarui!'));
  const deleteStok = (id: string) => withConfirm('delete', () => apiCall(`/api/stok/${id}`, 'DELETE', undefined, 'Stok berhasil dihapus!'));
  
  const addOperasional = (data: OperasionalEntry) => withConfirm('add', () => apiCall('/api/operasional', 'POST', data, 'Data operasional ditambahkan!'));
  const updateOperasional = (id: string, data: Partial<OperasionalEntry>) => withConfirm('edit', () => apiCall(`/api/operasional/${id}`, 'PATCH', data, 'Data operasional diperbarui!'));
  const deleteOperasional = (id: string) => withConfirm('delete', () => apiCall(`/api/operasional/${id}`, 'DELETE', undefined, 'Data operasional dihapus!'));
  
  const addPengeluaran = (data: PengeluaranEntry) => withConfirm('add', () => apiCall('/api/pengeluaran', 'POST', data, 'Pengeluaran lainnya ditambahkan!'));
  const updatePengeluaran = (id: string, data: Partial<PengeluaranEntry>) => withConfirm('edit', () => apiCall(`/api/pengeluaran/${id}`, 'PATCH', data, 'Pengeluaran diperbarui!'));
  const deletePengeluaran = (id: string) => withConfirm('delete', () => apiCall(`/api/pengeluaran/${id}`, 'DELETE', undefined, 'Pengeluaran lainnya dihapus!'));

  return (
    <DataContext.Provider value={{
      penjualan, pembelian, stokEntries, stokSummary, keuangan,
      operasional, pengeluaran,
      refreshData, addPembelian, updatePembelian, deletePembelian,
      addPenjualan, updatePenjualan, deletePenjualan,
      addStok, updateStok, deleteStok, recomputeStok,
      addOperasional, updateOperasional, deleteOperasional,
      addPengeluaran, updatePengeluaran, deletePengeluaran,
      withConfirm
    }}>
      {children}
      
      {/* Global Confirm Modal */}
      {confirmState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 min-w-[300px] max-w-sm m-4 transform transition-all border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100">Konfirmasi</h3>
            <p className="mb-6 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{confirmState.message}</p>
            <div className="flex gap-3 justify-end mt-2">
              <button 
                onClick={() => setConfirmState(prev => ({ ...prev, isOpen: false }))} 
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-sm transition-colors text-slate-800 dark:text-slate-200 font-medium"
              >
                Batal
              </button>
              <button 
                onClick={confirmState.onConfirm}
                className={`px-4 py-2 text-white rounded-lg text-sm transition-all font-medium shadow-sm hover:shadow-md ${confirmState.message.includes('menghapus') ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
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
