import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const minScore = parseInt(searchParams.get('minScore') || '0');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    
    // 获取当前用户，用于判断会员权限
    const payload = await getCurrentUser();
    const isFreeUser = !payload || payload.memberType === 'FREE';
    
    // 构建查询条件
    const where: any = {
      painLevel: { gte: minScore },
    };
    
    if (category) {
      where.category = category;
    }
    
    // 免费用户限制
    if (isFreeUser) {
      where.createdAt = {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      };
    }
    
    // 获取总数
    const total = await prisma.painPoint.count({ where });
    
    // 获取数据
    const items = await prisma.painPoint.findMany({
      where,
      include: {
        hotItem: {
          include: {
            platform: {
              select: { name: true, display: true },
            },
          },
        },
      },
      orderBy: [{ commercialScore: 'desc' }, { painLevel: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    
    // 格式化数据
    const formattedItems = items.map((item) => ({
      id: item.id,
      hotItemId: item.hotItemId,
      title: item.title,
      painLevel: item.painLevel,
      commercialScore: item.commercialScore,
      category: item.category,
      keywords: item.keywords,
      analysis: item.analysis,
      platformName: item.hotItem?.platform?.name,
      originalTitle: item.hotItem?.title,
      url: item.hotItem?.url,
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
    console.error('获取痛点数据错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
