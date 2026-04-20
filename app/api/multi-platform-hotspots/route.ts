import { NextResponse } from 'next/server';
import { fetchAllPlatforms, fetchPlatform } from '@/scripts/fetch-multi-platform';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');

  try {
    let data;
    const allData = await fetchAllPlatforms();
    
    if (platform) {
      // 获取单个平台
      const platformData = allData[platform];
      if (!platformData) {
        return NextResponse.json({
          success: false,
          error: `未知平台: ${platform}`
        }, { status: 400 });
      }
      
      const items = platformData.items || [];
      data = {
        platform,
        platformName: platformData.platformName,
        items: items.slice((page - 1) * pageSize, page * pageSize),
        total: items.length,
        page,
        pageSize,
        updatedAt: platformData.updatedAt
      };
    } else {
      // 返回所有平台
      data = allData;
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error: any) {
    console.error('Multi-platform hotspots error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '获取失败'
    }, { status: 500 });
  }
}
