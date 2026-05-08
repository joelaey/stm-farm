'use client';

import React, { useMemo } from 'react';
import { PengeluaranEntry } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

interface PengeluaranTableProps {
  entries: PengeluaranEntry[];
  onDelete?: (id: string) => void;
}

export default function PengeluaranTable({ entries, onDelete }: PengeluaranTableProps) {
  // Calculate totals
  const totals = useMemo(() => {
    let totalJumlah = 0;
    entries.forEach(entry => {
      totalJumlah += entry.jumlah;
    });
    return { totalJumlah };
  }, [entries]);

  return (
    <div className="spreadsheet-wrapper">
      <table className="spreadsheet-table">
        <thead>
          <tr>
            <th className="sticky-col sticky-col-0" style={{ minWidth: 100 }}>Tanggal</th>
            <th className="sticky-col" style={{ left: 100, minWidth: 150 }}>Ket</th>
            <th>Uraian</th>
            <th>Harga</th>
            <th>Jumlah</th>
            {onDelete && <th style={{ width: 40 }}></th>}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className="sticky-col sticky-col-0 text-left text-[var(--text-secondary)]">
                {entry.tanggal ? new Date(entry.tanggal).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }) : '-'}
              </td>
              <td className="sticky-col text-left font-medium" style={{ left: 100 }}>
                {entry.keterangan}
              </td>
              <td className="text-left text-[var(--text-secondary)]">
                {entry.uraian || '-'}
              </td>
              <td className="cell-rp">
                {entry.harga ? formatRupiah(entry.harga) : '-'}
              </td>
              <td className="cell-jumlah text-right font-medium">
                {formatRupiah(entry.jumlah)}
              </td>
              {onDelete && (
                <td className="cell-action">
                  <button onClick={() => onDelete(entry.id)} title="Hapus">
                    <Trash2 className="h-3.5 w-3.5 text-[var(--danger)]" />
                  </button>
                </td>
              )}
            </tr>
          ))}
          {entries.length === 0 && (
            <tr>
              <td colSpan={onDelete ? 6 : 5} className="text-center" style={{ padding: '24px', color: 'var(--text-secondary)' }}>
                Belum ada data
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className="total-label">Total</td>
            <td className="cell-jumlah text-right font-bold text-[var(--primary)]">{formatRupiah(totals.totalJumlah)}</td>
            {onDelete && <td></td>}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
