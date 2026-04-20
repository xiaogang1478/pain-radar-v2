import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    // 找出所有重复的标题
    const duplicates = await prisma.painPoint.groupBy({
      by: ['title'],
      _count: { id: true },
      having: { id: { _count: { gt: 1 } } }
    });

    let deletedCount = 0;

    for (const dup of duplicates) {
      const records = await prisma.painPoint.findMany({
        where: { title: dup.title },
        orderBy: { id: 'asc' },
        select: { id: true }
      });

      // 保留第一个，删除其余
      const toDelete = records.slice(1).map(r => r.id);
      
      await prisma.painPoint.deleteMany({
        where: { id: { in: toDelete } }
      });
      
      deletedCount += toDelete.length;
    }

    const remaining = await prisma.painPoint.count();

    return NextResponse.json({
      success: true,
      data: {
        deleted: deletedCount,
        remaining
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
