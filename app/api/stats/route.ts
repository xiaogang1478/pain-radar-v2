import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [hotItemsCount, platformsCount, painPointsCount, latestHotItem] = await Promise.all([
      prisma.hotItem.count(),
      prisma.platform.count(),
      prisma.painPoint.count(),
      prisma.hotItem.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        totalHotItems: hotItemsCount,
        totalPlatforms: platformsCount,
        totalPainPoints: painPointsCount,
        lastUpdated: latestHotItem?.createdAt?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error('获取统计数据错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
