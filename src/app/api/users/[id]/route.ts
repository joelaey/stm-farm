import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.user.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    // If password is empty string, don't update it
    const updateData: any = {
      name: data.name,
      username: data.username,
      role: data.role,
    };
    
    if (data.password && data.password.trim() !== '') {
      updateData.password = data.password;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData
    });
    return NextResponse.json({ id: user.id, name: user.name, username: user.username, role: user.role });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
