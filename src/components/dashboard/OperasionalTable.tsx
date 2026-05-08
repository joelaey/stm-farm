'use client';

import React, { useMemo } from 'react';
import { OPERASIONAL_CATEGORIES, OperasionalCategory, OperasionalEntry } from '@/lib/types';
import { Trash2 } from 'lucide-react';

interface OperasionalTableProps {
  entries: OperasionalEntry[];
  onDelete?: (id: string) => void;
  onEdit?: (entry: OperasionalEntry) => void;
}

function formatRp(val: number): string {
  if (val === 0) return '';
  return `Rp ${(val * 1000).toLocaleString('id-ID')}`;
}

export default function OperasionalTable({ entries, onDelete, onEdit }: OperasionalTableProps) {
  // Group entries by bulan+tanggalNum for display
  const groupedEntries = useMemo(() => {
    const groups: { bulan: string; tanggalNum: number; items: OperasionalEntry[] }[] = [];
    let lastKey = '';
    
    entries.forEach(entry => {
      const key = `${entry.bulan}-${entry.tanggalNum}`;
      if (key !== lastKey) {
        groups.push({ bulan: entry.bulan, tanggalNum: entry.tanggalNum, items: [entry] });
        lastKey = key;
      } else {
        groups[groups.length - 1].items.push(entry);
      }
    });
    
    return groups;
  }, [entries]);

  // Calculate totals
  const totals = useMemo(() => {
    let totalJumlah = 0;
    entries.forEach(entry => {
      totalJumlah += entry.jumlah;
    });
    return { totalJumlah };
  }, [entries]);

  let lastRenderedBulan = '';

  return (
    <div className="spreadsheet-wrapper">
      <table className="spreadsheet-table">
        <thead>
          <tr>
            <th rowSpan={2} className="sticky-col sticky-col-0" style={{ minWidth: 70 }}>Tanggal</th>
            <th rowSpan={2} className="sticky-col sticky-col-1" style={{ minWidth: 130 }}>Ket.</th>
            <th colSpan={5} className="group-header">Uraian</th>
            <th rowSpan={2}>Jumlah</th>
            {onDelete && <th rowSpan={2} style={{ width: 40 }}></th>}
          </tr>
          <tr>
            {OPERASIONAL_CATEGORIES.map(cat => (
              <th key={`cat-${cat}`} style={{ minWidth: 80 }}>{cat}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groupedEntries.map(group => 
            group.items.map((entry, itemIdx) => {
              const showBulan = entry.bulan !== lastRenderedBulan;
              if (showBulan) lastRenderedBulan = entry.bulan;
              const showTanggal = itemIdx === 0;

              return (
                <tr key={entry.id}>
                  <td className="sticky-col sticky-col-0 text-left">
                    {showBulan && showTanggal && (
                      <span className="font-semibold">{entry.bulan}</span>
                    )}
                    {showTanggal && (
                      <span className="ml-1 text-[var(--text-secondary)]">{entry.tanggalNum}</span>
                    )}
                  </td>
                  <td className="sticky-col sticky-col-1 text-left font-medium">
                    {entry.keterangan}
                  </td>
                  {OPERASIONAL_CATEGORIES.map(cat => {
                    const val = entry.items[cat] || 0;
                    return (
                      <td key={`val-${cat}`} className={val > 0 ? 'cell-rp' : 'cell-empty'}>
                        {formatRp(val)}
                      </td>
                    );
                  })}
                  <td className="cell-jumlah text-right">{formatRp(entry.jumlah)}</td>
                  {(onDelete || onEdit) && (
                    <td className="cell-action flex gap-2 justify-center items-center h-full pt-1.5">
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
              );
            })
          )}
          {entries.length === 0 && (
            <tr>
              <td colSpan={(onDelete || onEdit) ? 9 : 8} className="text-center" style={{ padding: '24px', color: 'var(--text-secondary)' }}>
                Belum ada data
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} className="total-label">Total</td>
            <td colSpan={5}></td>
            <td className="cell-jumlah text-right">{formatRp(totals.totalJumlah)}</td>
            {(onDelete || onEdit) && <td></td>}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
