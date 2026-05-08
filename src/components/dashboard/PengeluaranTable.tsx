'use client';

import React, { useMemo } from 'react';
import { PengeluaranEntry } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

interface PengeluaranTableProps {
  entries: PengeluaranEntry[];
  onDelete?: (id: string) => void;
  onEdit?: (entry: PengeluaranEntry) => void;
}

export default function PengeluaranTable({ entries, onDelete, onEdit }: PengeluaranTableProps) {
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
              {(onDelete || onEdit) && (
                <td className="cell-action flex gap-2 justify-center items-center h-full pt-2">
                  {onEdit && (
                    <button onClick={() => onEdit(entry)} title="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--primary)] hover:scale-110 transition-transform"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(entry.id)} title="Hapus">
                      <Trash2 className="h-3.5 w-3.5 text-[var(--danger)] hover:scale-110 transition-transform" />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
          {entries.length === 0 && (
            <tr>
              <td colSpan={(onDelete || onEdit) ? 6 : 5} className="text-center" style={{ padding: '24px', color: 'var(--text-secondary)' }}>
                Belum ada data
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className="total-label">Total</td>
            <td className="cell-jumlah text-right font-bold text-[var(--primary)]">{formatRupiah(totals.totalJumlah)}</td>
            {(onDelete || onEdit) && <td></td>}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
