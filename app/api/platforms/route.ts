import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const platforms = await prisma.platform.findMany({
      orderBy: { name: 'asc' },
    });
    
    return NextResponse.json({
      success: true,
      data: platforms,
    });
  } catch (error) {
    console.error('获取平台数据错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
