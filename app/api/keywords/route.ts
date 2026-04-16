import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { keywordSchema } from '@/lib/validations';
import { MEMBER_PERMISSIONS } from '@/types';

// 获取关键词列表
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
    if (permissions.maxKeywords === 0) {
      return NextResponse.json(
        { success: false, error: '该功能需要专业版会员' },
        { status: 403 }
      );
    }
    
    const keywords = await prisma.keyword.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({
      success: true,
      data: keywords,
    });
  } catch (error) {
    console.error('获取关键词错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}

// 添加关键词
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
    if (permissions.maxKeywords === 0) {
      return NextResponse.json(
        { success: false, error: '该功能需要专业版会员' },
        { status: 403 }
      );
    }
    
    // 检查关键词数量限制
    const keywordCount = await prisma.keyword.count({
      where: { userId: payload.userId, isActive: true },
    });
    
    if (permissions.maxKeywords > 0 && keywordCount >= permissions.maxKeywords) {
      return NextResponse.json(
        { success: false, error: `专业版最多添加${permissions.maxKeywords}个关键词` },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const validation = keywordSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const { keyword, notifyEmail } = validation.data;
    
    // 检查关键词是否已存在
    const existingKeyword = await prisma.keyword.findFirst({
      where: { userId: payload.userId, keyword },
    });
    
    if (existingKeyword) {
      return NextResponse.json(
        { success: false, error: '该关键词已存在' },
        { status: 400 }
      );
    }
    
    const newKeyword = await prisma.keyword.create({
      data: {
        userId: payload.userId,
        keyword,
        notifyEmail,
      },
    });
    
    return NextResponse.json({
      success: true,
      data: newKeyword,
      message: '关键词添加成功',
    });
  } catch (error) {
    console.error('添加关键词错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}

// 删除关键词
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
        { success: false, error: '缺少关键词ID' },
        { status: 400 }
      );
    }
    
    // 验证关键词所属
    const keyword = await prisma.keyword.findFirst({
      where: { id, userId: payload.userId },
    });
    
    if (!keyword) {
      return NextResponse.json(
        { success: false, error: '关键词不存在' },
        { status: 404 }
      );
    }
    
    await prisma.keyword.delete({ where: { id } });
    
    return NextResponse.json({
      success: true,
      message: '关键词删除成功',
    });
  } catch (error) {
    console.error('删除关键词错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
