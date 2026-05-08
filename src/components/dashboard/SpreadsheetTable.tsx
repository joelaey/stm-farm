'use client';

import React, { useMemo } from 'react';
import { UBI_CATEGORIES, UbiCategory, TransactionEntry, StokEntry } from '@/lib/types';
import { Trash2 } from 'lucide-react';

type EntryType = TransactionEntry | StokEntry;

interface SpreadsheetTableProps {
  entries: EntryType[];
  categoryLabels: Record<UbiCategory, string>;
  onDelete?: (id: string) => void;
  title: string;
  showNomorNota?: boolean;
}

function formatRp(val: number): string {
  if (val === 0) return '';
  return `Rp ${(val * 1000).toLocaleString('id-ID')}`;
}

function formatKg(val: number): string {
  if (val === 0) return '';
  return val.toLocaleString('id-ID');
}

export default function SpreadsheetTable({ entries, categoryLabels, onDelete, title, showNomorNota = false }: SpreadsheetTableProps) {
  // Group entries by bulan+tanggalNum for display
  const groupedEntries = useMemo(() => {
    const groups: { bulan: string; tanggalNum: number; items: EntryType[] }[] = [];
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
    const kgTotals: Record<UbiCategory, number> = { M: 0, AB: 0, TO: 0, ARB: 0, ARS: 0, DOT: 0, KC: 0 };
    let totalJumlah = 0;
    let totalDebit = 0;
    let totalKredit = 0;
    let grandTotalKg = 0;

    entries.forEach(entry => {
      UBI_CATEGORIES.forEach(cat => {
        const kg = entry.items[cat]?.kg || 0;
        kgTotals[cat] += kg;
        grandTotalKg += kg;
      });
      totalJumlah += entry.jumlah;
      totalDebit += entry.debit;
      totalKredit += entry.kredit;
    });

    return { kgTotals, totalJumlah, totalDebit, totalKredit, grandTotalKg };
  }, [entries]);

  // For sticky column widths
  const stickyKetLeft = 60;
  const stickyNotaLeft = showNomorNota ? 60 + 130 : 0;
  const colSpanFixed = showNomorNota ? 3 : 2;

  let lastRenderedBulan = '';

  return (
    <div className="spreadsheet-wrapper">
      <table className="spreadsheet-table">
        <thead>
          {/* Row 1: Group headers */}
          <tr>
            <th rowSpan={2} className="sticky-col sticky-col-0" style={{ minWidth: 60 }}>Tanggal</th>
            <th rowSpan={2} className="sticky-col" style={{ left: stickyKetLeft, minWidth: 130 }}>Ket.</th>
            {showNomorNota && (
              <th rowSpan={2} className="sticky-col" style={{ left: stickyNotaLeft, minWidth: 80 }}>No. Nota</th>
            )}
            <th colSpan={7} className="group-header">{title} Kg.</th>
            <th colSpan={7} className="group-header">Rp.</th>
            <th rowSpan={2}>Jumlah</th>
            <th rowSpan={2}>Debit</th>
            <th rowSpan={2}>Kredit</th>
            {onDelete && <th rowSpan={2} style={{ width: 40 }}></th>}
          </tr>
          {/* Row 2: Category sub-headers */}
          <tr>
            {UBI_CATEGORIES.map(cat => (
              <th key={`kg-${cat}`} style={{ minWidth: 55 }}>{categoryLabels[cat]}</th>
            ))}
            {UBI_CATEGORIES.map(cat => (
              <th key={`rp-${cat}`} style={{ minWidth: 55 }}>{categoryLabels[cat]}</th>
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
                  {/* Tanggal column */}
                  <td className="sticky-col sticky-col-0 text-left">
                    {showBulan && showTanggal && (
                      <span className="font-semibold">{entry.bulan}</span>
                    )}
                    {showTanggal && (
                      <span className="ml-1 text-[var(--text-secondary)]">{entry.tanggalNum}</span>
                    )}
                  </td>
                  {/* Keterangan */}
                  <td className="sticky-col text-left font-medium" style={{ left: stickyKetLeft }}>
                    {entry.keterangan}
                  </td>
                  {/* Nomor Nota */}
                  {showNomorNota && (
                    <td className="sticky-col text-left" style={{ left: stickyNotaLeft, fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {'nomorNota' in entry ? (entry as TransactionEntry).nomorNota || '' : ''}
                    </td>
                  )}
                  {/* Kg columns */}
                  {UBI_CATEGORIES.map(cat => {
                    const kg = entry.items[cat]?.kg || 0;
                    return (
                      <td key={`kg-${cat}`} className={kg > 0 ? 'cell-kg' : 'cell-empty'}>
                        {formatKg(kg)}
                      </td>
                    );
                  })}
                  {/* Rp columns */}
                  {UBI_CATEGORIES.map(cat => {
                    const rpPerKg = entry.items[cat]?.rpPerKg || 0;
                    const kg = entry.items[cat]?.kg || 0;
                    return (
                      <td key={`rp-${cat}`} className={rpPerKg > 0 && kg > 0 ? 'cell-rp' : 'cell-empty'}>
                        {rpPerKg > 0 && kg > 0 ? formatRp(rpPerKg) : ''}
                      </td>
                    );
                  })}
                  {/* Jumlah */}
                  <td className="cell-jumlah text-right">{formatRp(entry.jumlah)}</td>
                  {/* Debit */}
                  <td className="cell-debit text-right">{formatRp(entry.debit)}</td>
                  {/* Kredit */}
                  <td className="cell-kredit text-right">{formatRp(entry.kredit)}</td>
                  {/* Delete action */}
                  {onDelete && (
                    <td className="cell-action">
                      <button onClick={() => onDelete(entry.id)} title="Hapus">
                        <Trash2 className="h-3.5 w-3.5 text-[var(--danger)]" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })
          )}
          {entries.length === 0 && (
            <tr>
              <td colSpan={colSpanFixed + 14 + (onDelete ? 1 : 0) + 3} className="text-center" style={{ padding: '24px', color: 'var(--text-secondary)' }}>
                Belum ada data
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          {/* Total Rp Row */}
          <tr>
            <td colSpan={colSpanFixed} className="total-label">Total Rp.</td>
            {UBI_CATEGORIES.map(cat => (
              <td key={`total-kg-${cat}`} className="cell-kg">
                {formatKg(totals.kgTotals[cat])}
              </td>
            ))}
            {UBI_CATEGORIES.map(cat => (
              <td key={`total-rp-${cat}`}></td>
            ))}
            <td className="cell-jumlah text-right">{formatRp(totals.totalJumlah)}</td>
            <td className="cell-debit text-right">{formatRp(totals.totalDebit)}</td>
            <td className="cell-kredit text-right">{formatRp(totals.totalKredit)}</td>
            {onDelete && <td></td>}
          </tr>
          {/* Total Kg Row */}
          <tr>
            <td colSpan={colSpanFixed} className="total-label">Total Kg.</td>
            <td colSpan={14 + 3 + (onDelete ? 1 : 0)} style={{ textAlign: 'right', fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>
              {totals.grandTotalKg.toLocaleString('id-ID')}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
