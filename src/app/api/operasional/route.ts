import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.operasional.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const entry = await prisma.operasional.create({
      data: {
        id: data.id,
        tanggal: data.tanggal,
        bulan: data.bulan,
        tanggalNum: data.tanggalNum,
        keterangan: data.keterangan,
        jumlah: data.jumlah,
        items: data.items,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      }
    });
    return NextResponse.json(entry);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
