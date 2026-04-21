import { NextResponse } from 'next/server';
import { fetchPlatform } from '@/scripts/fetch-multi-platform';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');

  try {
    let data: any;

    if (platform) {
      // 只获取指定平台的数据，避免超时
      const items = await fetchPlatform(platform);
      data = {
        platform,
        platformName: platform,
        items: items.slice((page - 1) * pageSize, page * pageSize),
        total: items.length,
        page,
        pageSize
      };
    } else {
      // 不获取所有平台，返回错误提示
      return NextResponse.json({
        success: false,
        error: '请指定平台参数: ?platform=weibo'
      }, { status: 400 });
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
