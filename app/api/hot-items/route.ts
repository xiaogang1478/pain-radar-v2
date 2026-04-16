import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');
    const search = searchParams.get('q');
    
    // 获取当前用户，用于判断会员权限
    const payload = await getCurrentUser();
    const isFreeUser = !payload || payload.memberType === 'FREE';
    
    // 构建查询条件
    const where: any = {};
    
    if (platform) {
      where.platform = { hashid: platform };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // 免费用户限制
    if (isFreeUser) {
      where.createdAt = {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // 只看24小时内的
      };
    }
    
    // 获取总数
    const total = await prisma.hotItem.count({ where });
    
    // 获取数据
    const items = await prisma.hotItem.findMany({
      where,
      include: {
        platform: {
          select: { name: true, display: true, hashid: true },
        },
      },
      orderBy: { heatValue: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    
    // 格式化数据
    const formattedItems = items.map((item) => ({
      id: item.id,
      platformId: item.platformId,
      title: item.title,
      url: item.url,
      description: item.description,
      heatValue: item.heatValue,
      extra: item.extra,
      platformName: item.platform.name,
      platformDisplay: item.platform.display,
      platformHashid: item.platform.hashid,
      createdAt: item.createdAt.toISOString(),
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        items: formattedItems,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('获取热点数据错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
