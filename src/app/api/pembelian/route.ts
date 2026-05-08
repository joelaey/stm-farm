import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const pembelian = await prisma.pembelian.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(pembelian);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pembelian' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newEntry = await prisma.pembelian.create({
      data: {
        id: data.id, // optional, Prisma usually generates UUIDs
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
    return NextResponse.json(newEntry);
  } catch (error) {
    console.error('Create pembelian error:', error);
    return NextResponse.json({ error: 'Failed to create pembelian' }, { status: 500 });
  }
}
