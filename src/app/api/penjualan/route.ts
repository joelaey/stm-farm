import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.penjualan.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const entry = await prisma.penjualan.create({
      data: {
        id: data.id,
        tanggal: data.tanggal,
        bulan: data.bulan,
        tanggalNum: data.tanggalNum,
        keterangan: data.keterangan,
        nomorNota: data.nomorNota || null,
        jumlah: data.jumlah,
        debit: data.debit,
        kredit: data.kredit,
        items: data.items,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      }
    });
    return NextResponse.json(entry);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
