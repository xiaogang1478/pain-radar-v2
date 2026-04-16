import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { updateProfileSchema } from '@/lib/validations';

// 获取个人信息
export async function GET() {
  try {
    const payload = await getCurrentUser();
    
    if (!payload) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
        memberType: true,
        memberExpire: true,
        createdAt: true,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('获取个人信息错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}

// 更新个人信息
export async function PUT(request: NextRequest) {
  try {
    const payload = await getCurrentUser();
    
    if (!payload) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const validation = updateProfileSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const { nickname, avatar } = validation.data;
    
    const user = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        nickname,
        avatar,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
        memberType: true,
        memberExpire: true,
        createdAt: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      data: user,
      message: '个人信息更新成功',
    });
  } catch (error) {
    console.error('更新个人信息错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
