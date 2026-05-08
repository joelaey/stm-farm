// ============================================
// FAFarm — TypeScript Types & Interfaces
// ============================================

// 7 fixed ubi categories
export const UBI_CATEGORIES = ['M', 'AB', 'TO', 'ARB', 'ARS', 'DOT', 'KC'] as const;
export type UbiCategory = typeof UBI_CATEGORIES[number];

// Labels for pembelian (first column is "Rad/Borong" instead of "M")
export const UBI_LABELS_PENJUALAN: Record<UbiCategory, string> = {
  M: 'M', AB: 'AB', TO: 'TO', ARB: 'ARB', ARS: 'ARS', DOT: 'DOT', KC: 'KC'
};
export const UBI_LABELS_PEMBELIAN: Record<UbiCategory, string> = {
  M: 'Rad/Borong', AB: 'AB', TO: 'TO', ARB: 'ARB', ARS: 'ARS', DOT: 'DOT', KC: 'KC'
};
export const UBI_LABELS_STOK: Record<UbiCategory, string> = {
  M: 'M', AB: 'AB', TO: 'TO', ARB: 'ARB', ARS: 'ARS', DOT: 'DOT', KC: 'KC'
};

// Data per ubi category in a single transaction row
export interface UbiCategoryData {
  kg: number;      // jumlah kg (0 if empty)
  rpPerKg: number; // harga per kg (0 if empty)
}

// Empty category data
export const EMPTY_UBI_DATA: UbiCategoryData = { kg: 0, rpPerKg: 0 };

// ---- Transaction Entry (used by Penjualan & Pembelian) ----
export interface TransactionEntry {
  id: string;
  tanggal: string;        // ISO date string
  bulan: string;           // display month: "Mart", "April", etc.
  tanggalNum: number;      // day number: 30, 1, 2, etc.
  keterangan: string;      // person name: "Pak Michael", "M Hery"
  nomorNota?: string;      // nomor nota / invoice number
  items: Record<UbiCategory, UbiCategoryData>;
  jumlah: number;          // total Rp (sum of kg * rpPerKg for all categories)
  debit: number;           // manual: amount paid/received
  kredit: number;          // manual: amount owed
  createdAt: string;
}

// Aliases for clarity
export type PenjualanEntry = TransactionEntry;
export type PembelianEntry = TransactionEntry;

// ---- Stok Entry ----
// Auto-computed from pembelian - penjualan, but can be manually overridden
export interface StokEntry {
  id: string;
  tanggal: string;
  bulan: string;
  tanggalNum: number;
  keterangan: string;
  items: Record<UbiCategory, UbiCategoryData>;
  jumlah: number;
  debit: number;
  kredit: number;
  isManualOverride?: boolean; // true if user edited this manually
  createdAt: string;
}



// ---- StokItem for dashboard summary ----
export interface StokItem {
  jenisUbi: string;
  totalMasuk: number;
  totalKeluar: number;
  stokSaatIni: number;
}

export interface RingkasanKeuangan {
  totalPemasukan: number;
  totalPengeluaran: number;
  profit: number;
  piutang: number;
  hutang: number;
}

export type Locale = 'id' | 'en';
export type Theme = 'light' | 'dark';

// ---- Operasional (Biaya Operasional) ----
export const OPERASIONAL_CATEGORIES = ['Ongkos', 'Panen', 'Cuci', 'Sortasi', 'Dll'] as const;
export type OperasionalCategory = typeof OPERASIONAL_CATEGORIES[number];

export interface OperasionalEntry {
  id: string;
  tanggal: string;
  bulan: string;
  tanggalNum: number;
  keterangan: string;      // e.g. "Kuningan", "Ciparay"
  items: Record<OperasionalCategory, number>; // Rp per category
  jumlah: number;          // total Rp
  createdAt: string;
}

export function createEmptyOperasionalItems(): Record<OperasionalCategory, number> {
  return { Ongkos: 0, Panen: 0, Cuci: 0, Sortasi: 0, Dll: 0 };
}

export function calculateOperasionalJumlah(items: Record<OperasionalCategory, number>): number {
  return OPERASIONAL_CATEGORIES.reduce((sum, cat) => sum + (items[cat] || 0), 0);
}

// ---- Pengeluaran (custom free-form) ----
export interface PengeluaranEntry {
  id: string;
  tanggal?: string;
  keterangan: string;      // e.g. "Kiloan", "B Hutang", "Ongkir"
  uraian?: string;         // optional description
  harga?: number;          // optional unit price
  jumlah: number;          // total amount
  createdAt: string;
}

// ---- Helper to create empty items record ----
export function createEmptyItems(): Record<UbiCategory, UbiCategoryData> {
  return {
    M: { kg: 0, rpPerKg: 0 },
    AB: { kg: 0, rpPerKg: 0 },
    TO: { kg: 0, rpPerKg: 0 },
    ARB: { kg: 0, rpPerKg: 0 },
    ARS: { kg: 0, rpPerKg: 0 },
    DOT: { kg: 0, rpPerKg: 0 },
    KC: { kg: 0, rpPerKg: 0 },
  };
}

// ---- Helper to calculate jumlah from items ----
export function calculateJumlah(items: Record<UbiCategory, UbiCategoryData>): number {
  return UBI_CATEGORIES.reduce((sum, cat) => {
    const item = items[cat];
    return sum + (item.kg * item.rpPerKg);
  }, 0);
}

// ---- Helper to calculate total kg from items ----
export function calculateTotalKg(items: Record<UbiCategory, UbiCategoryData>): number {
  return UBI_CATEGORIES.reduce((sum, cat) => sum + items[cat].kg, 0);
}
