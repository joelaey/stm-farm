import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    let user = await prisma.user.findUnique({
      where: { username },
    });

    // Auto-seed first admin for easy setup
    if (!user && username === 'admin' && password === 'admin') {
      user = await prisma.user.create({
        data: {
          name: 'Administrator',
          username: 'admin',
          password: 'admin',
          role: 'admin',
        }
      });
    }

    // Auto-seed first pekerja for easy setup
    if (!user && username === 'pekerja' && password === 'pekerja') {
      user = await prisma.user.create({
        data: {
          name: 'Pekerja Lapangan',
          username: 'pekerja',
          password: 'pekerja',
          role: 'pekerja_lapangan',
        }
      });
    }

    if (user && user.password === password) {
      const { password: _, ...userWithoutPassword } = user;
      return NextResponse.json(userWithoutPassword);
    }

    return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
