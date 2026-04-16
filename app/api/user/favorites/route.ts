import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { MEMBER_PERMISSIONS } from '@/types';

// 获取收藏列表
export async function GET() {
  try {
    const payload = await getCurrentUser();
    
    if (!payload) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }
    
    // 检查会员权限
    const permissions = MEMBER_PERMISSIONS[payload.memberType as keyof typeof MEMBER_PERMISSIONS];
    if (!permissions.maxKeywords) { // 这里复用关键词限制，因为收藏和关键词同属于专业版功能
      return NextResponse.json(
        { success: false, error: '该功能需要专业版会员' },
        { status: 403 }
      );
    }
    
    const favorites = await prisma.favorite.findMany({
      where: { userId: payload.userId },
      include: {
        hotItem: {
          include: {
            platform: {
              select: { name: true, display: true },
            },
          },
        },
        painPoint: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    console.error('获取收藏错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}

// 添加收藏
export async function POST(request: NextRequest) {
  try {
    const payload = await getCurrentUser();
    
    if (!payload) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }
    
    // 检查会员权限
    const permissions = MEMBER_PERMISSIONS[payload.memberType as keyof typeof MEMBER_PERMISSIONS];
    if (!permissions.maxKeywords) {
      return NextResponse.json(
        { success: false, error: '该功能需要专业版会员' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { hotItemId, painPointId } = body;
    
    if (!hotItemId && !painPointId) {
      return NextResponse.json(
        { success: false, error: '缺少收藏对象ID' },
        { status: 400 }
      );
    }
    
    // 检查是否已收藏
    const existing = await prisma.favorite.findFirst({
      where: {
        userId: payload.userId,
        hotItemId: hotItemId || undefined,
        painPointId: painPointId || undefined,
      },
    });
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: '已经收藏过了' },
        { status: 400 }
      );
    }
    
    const favorite = await prisma.favorite.create({
      data: {
        userId: payload.userId,
        hotItemId: hotItemId || null,
        painPointId: painPointId || null,
      },
    });
    
    return NextResponse.json({
      success: true,
      data: favorite,
      message: '收藏成功',
    });
  } catch (error) {
    console.error('添加收藏错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}

// 删除收藏
export async function DELETE(request: NextRequest) {
  try {
    const payload = await getCurrentUser();
    
    if (!payload) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少收藏ID' },
        { status: 400 }
      );
    }
    
    // 验证收藏所属
    const favorite = await prisma.favorite.findFirst({
      where: { id, userId: payload.userId },
    });
    
    if (!favorite) {
      return NextResponse.json(
        { success: false, error: '收藏不存在' },
        { status: 404 }
      );
    }
    
    await prisma.favorite.delete({ where: { id } });
    
    return NextResponse.json({
      success: true,
      message: '取消收藏成功',
    });
  } catch (error) {
    console.error('删除收藏错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
