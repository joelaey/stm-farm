import { PenjualanEntry, PembelianEntry, StokEntry, OperasionalEntry, PengeluaranEntry, createEmptyItems, createEmptyOperasionalItems } from './types';

const PREFIX = 'fafarm_';

// ============================================
// Mock Data — Penjualan (from user's example)
// ============================================
const MOCK_PENJUALAN: PenjualanEntry[] = [
  {
    id: 'pen_1', tanggal: '2026-03-30T00:00:00.000Z', bulan: 'Mart', tanggalNum: 30,
    keterangan: 'Pak Michael', nomorNota: 'J-001',
    items: { ...createEmptyItems(), M: { kg: 638, rpPerKg: 10 } },
    jumlah: 6380, debit: 6380, kredit: 0, createdAt: new Date().toISOString()
  },
  {
    id: 'pen_2', tanggal: '2026-03-30T00:00:00.000Z', bulan: 'Mart', tanggalNum: 30,
    keterangan: 'M Hery', nomorNota: 'J-002',
    items: { ...createEmptyItems(), AB: { kg: 1250, rpPerKg: 9 }, TO: { kg: 400, rpPerKg: 6 }, ARB: { kg: 100, rpPerKg: 7 }, ARS: { kg: 400, rpPerKg: 2 } },
    jumlah: 14605, debit: 10500, kredit: 4105, createdAt: new Date().toISOString()
  },
  {
    id: 'pen_3', tanggal: '2026-03-30T00:00:00.000Z', bulan: 'Mart', tanggalNum: 30,
    keterangan: 'Ardi', nomorNota: 'J-003',
    items: { ...createEmptyItems(), AB: { kg: 300, rpPerKg: 9 } },
    jumlah: 2700, debit: 2700, kredit: 0, createdAt: new Date().toISOString()
  },
  {
    id: 'pen_4', tanggal: '2026-04-01T00:00:00.000Z', bulan: 'April', tanggalNum: 1,
    keterangan: 'Firman', nomorNota: 'J-004',
    items: { ...createEmptyItems(), TO: { kg: 550, rpPerKg: 6 } },
    jumlah: 3300, debit: 3300, kredit: 0, createdAt: new Date().toISOString()
  },
  {
    id: 'pen_5', tanggal: '2026-04-01T00:00:00.000Z', bulan: 'April', tanggalNum: 1,
    keterangan: 'Pak Michael', nomorNota: 'J-005',
    items: { ...createEmptyItems(), M: { kg: 257, rpPerKg: 10 } },
    jumlah: 2570, debit: 0, kredit: 2570, createdAt: new Date().toISOString()
  },
  {
    id: 'pen_6', tanggal: '2026-04-02T00:00:00.000Z', bulan: 'April', tanggalNum: 2,
    keterangan: 'Pak Asep', nomorNota: 'J-006',
    items: { ...createEmptyItems(), AB: { kg: 650, rpPerKg: 8 } },
    jumlah: 5200, debit: 0, kredit: 5200, createdAt: new Date().toISOString()
  },
  {
    id: 'pen_7', tanggal: '2026-04-02T00:00:00.000Z', bulan: 'April', tanggalNum: 2,
    keterangan: 'M Hery', nomorNota: 'J-007',
    items: { ...createEmptyItems(), TO: { kg: 100, rpPerKg: 6 }, ARB: { kg: 450, rpPerKg: 4 }, ARS: { kg: 150, rpPerKg: 3 }, KC: { kg: 400, rpPerKg: 1 } },
    jumlah: 3175, debit: 0, kredit: 3175, createdAt: new Date().toISOString()
  },
];

// ============================================
// Mock Data — Pembelian (from user's example)
// ============================================
const MOCK_PEMBELIAN: PembelianEntry[] = [
  {
    id: 'bel_1', tanggal: '2026-03-29T00:00:00.000Z', bulan: 'Mart', tanggalNum: 29,
    keterangan: 'Pak Yuda', nomorNota: 'B-001',
    items: { ...createEmptyItems(), M: { kg: 1765, rpPerKg: 2 }, AB: { kg: 1405, rpPerKg: 8 }, TO: { kg: 713, rpPerKg: 5 }, KC: { kg: 158, rpPerKg: 1 } },
    jumlah: 17791, debit: 17291, kredit: 500, createdAt: new Date().toISOString()
  },
  {
    id: 'bel_2', tanggal: '2026-04-01T00:00:00.000Z', bulan: 'April', tanggalNum: 1,
    keterangan: 'A Nasir', nomorNota: 'B-002',
    items: { ...createEmptyItems(), AB: { kg: 567, rpPerKg: 8 }, TO: { kg: 448, rpPerKg: 6 }, ARB: { kg: 193, rpPerKg: 4 }, KC: { kg: 573, rpPerKg: 2 } },
    jumlah: 8762, debit: 8762, kredit: 0, createdAt: new Date().toISOString()
  },
];

// ============================================
// Mock Data — Stok (from user's example)
// ============================================
const MOCK_STOK: StokEntry[] = [
  {
    id: 'stk_1', tanggal: '2026-03-29T00:00:00.000Z', bulan: 'Mart', tanggalNum: 29,
    keterangan: 'Pak Yuda',
    items: {
      M: { kg: 638, rpPerKg: 10 }, AB: { kg: 1500, rpPerKg: 9 }, TO: { kg: 700, rpPerKg: 6 },
      ARB: { kg: 350, rpPerKg: 4 }, ARS: { kg: 400, rpPerKg: 3 }, DOT: { kg: 100, rpPerKg: 7 }, KC: { kg: 0, rpPerKg: 1 }
    },
    jumlah: 26430, debit: 0, kredit: 26430, createdAt: new Date().toISOString()
  },
  {
    id: 'stk_2', tanggal: '2026-04-01T00:00:00.000Z', bulan: 'April', tanggalNum: 1,
    keterangan: 'A Nasir',
    items: {
      M: { kg: 257, rpPerKg: 10 }, AB: { kg: 650, rpPerKg: 8 }, TO: { kg: 250, rpPerKg: 6 },
      ARB: { kg: 50, rpPerKg: 4 }, ARS: { kg: 50, rpPerKg: 3 }, DOT: { kg: 0, rpPerKg: 0 }, KC: { kg: 0, rpPerKg: 1 }
    },
    jumlah: 9595, debit: 0, kredit: 9595, createdAt: new Date().toISOString()
  },
];

// ============================================
// Mock Data — Operasional (from user's example)
// ============================================
const MOCK_OPERASIONAL: OperasionalEntry[] = [
  {
    id: 'ops_1', tanggal: '2026-03-30T00:00:00.000Z', bulan: 'Mart', tanggalNum: 30,
    keterangan: 'Kuningan',
    items: { Ongkos: 150, Panen: 0, Cuci: 560, Sortasi: 700, Dll: 250 },
    jumlah: 1660, createdAt: new Date().toISOString()
  },
  {
    id: 'ops_2', tanggal: '2026-04-01T00:00:00.000Z', bulan: 'April', tanggalNum: 1,
    keterangan: 'Ciparay',
    items: { Ongkos: 0, Panen: 0, Cuci: 400, Sortasi: 250, Dll: 100 },
    jumlah: 750, createdAt: new Date().toISOString()
  },
];

// ============================================
// Mock Data — Pengeluaran (from user's example)
// ============================================
const MOCK_PENGELUARAN: PengeluaranEntry[] = [
  { id: 'klr_1', keterangan: 'Kiloan', jumlah: 300, createdAt: new Date().toISOString() },
  { id: 'klr_2', keterangan: 'B Hutang', jumlah: 900, createdAt: new Date().toISOString() },
  { id: 'klr_3', keterangan: 'V', jumlah: 450, createdAt: new Date().toISOString() },
  { id: 'klr_4', keterangan: 'Cipanas', jumlah: 400, createdAt: new Date().toISOString() },
  { id: 'klr_5', keterangan: 'Ongkir', jumlah: 300, createdAt: new Date().toISOString() },
];

// ============================================
// Store
// ============================================
export const store = {
  // Generic GET
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = window.localStorage.getItem(PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage`, error);
      return defaultValue;
    }
  },

  // Generic SET
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage`, error);
    }
  },

  // Initialize mock data if empty
  initMockData() {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem(PREFIX + 'penjualan_v2')) {
      this.set('penjualan_v2', MOCK_PENJUALAN);
    }
    if (!window.localStorage.getItem(PREFIX + 'pembelian_v2')) {
      this.set('pembelian_v2', MOCK_PEMBELIAN);
    }
    if (!window.localStorage.getItem(PREFIX + 'stok_v2')) {
      this.set('stok_v2', MOCK_STOK);
    }
    if (!window.localStorage.getItem(PREFIX + 'operasional')) {
      this.set('operasional', MOCK_OPERASIONAL);
    }
    if (!window.localStorage.getItem(PREFIX + 'pengeluaran')) {
      this.set('pengeluaran', MOCK_PENGELUARAN);
    }
  },

  // Specific Getters
  getPenjualan(): PenjualanEntry[] { return this.get<PenjualanEntry[]>('penjualan_v2', []); },
  getPembelian(): PembelianEntry[] { return this.get<PembelianEntry[]>('pembelian_v2', []); },
  getStok(): StokEntry[] { return this.get<StokEntry[]>('stok_v2', []); },
  getOperasional(): OperasionalEntry[] { return this.get<OperasionalEntry[]>('operasional', []); },
  getPengeluaran(): PengeluaranEntry[] { return this.get<PengeluaranEntry[]>('pengeluaran', []); },

  // Specific Adders
  addPenjualan(data: PenjualanEntry) {
    const items = this.getPenjualan();
    this.set('penjualan_v2', [...items, data]);
  },
  addPembelian(data: PembelianEntry) {
    const items = this.getPembelian();
    this.set('pembelian_v2', [...items, data]);
  },
  addStok(data: StokEntry) {
    const items = this.getStok();
    this.set('stok_v2', [...items, data]);
  },
  addOperasional(data: OperasionalEntry) {
    const items = this.getOperasional();
    this.set('operasional', [...items, data]);
  },
  addPengeluaran(data: PengeluaranEntry) {
    const items = this.getPengeluaran();
    this.set('pengeluaran', [...items, data]);
  },

  // Specific Updaters
  updatePenjualan(id: string, data: Partial<PenjualanEntry>) {
    const items = this.getPenjualan();
    this.set('penjualan_v2', items.map(item => item.id === id ? { ...item, ...data } : item));
  },
  updatePembelian(id: string, data: Partial<PembelianEntry>) {
    const items = this.getPembelian();
    this.set('pembelian_v2', items.map(item => item.id === id ? { ...item, ...data } : item));
  },
  updateStok(id: string, data: Partial<StokEntry>) {
    const items = this.getStok();
    this.set('stok_v2', items.map(item => item.id === id ? { ...item, ...data } : item));
  },

  // Specific Deleters
  deletePenjualan(id: string) {
    const items = this.getPenjualan();
    this.set('penjualan_v2', items.filter(item => item.id !== id));
  },
  deletePembelian(id: string) {
    const items = this.getPembelian();
    this.set('pembelian_v2', items.filter(item => item.id !== id));
  },
  deleteStok(id: string) {
    const items = this.getStok();
    this.set('stok_v2', items.filter(item => item.id !== id));
  },
  deleteOperasional(id: string) {
    const items = this.getOperasional();
    this.set('operasional', items.filter(item => item.id !== id));
  },
  deletePengeluaran(id: string) {
    const items = this.getPengeluaran();
    this.set('pengeluaran', items.filter(item => item.id !== id));
  },
};

