import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const payload = await getCurrentUser();
    
    if (!payload) {
      return NextResponse.json(
        { success: false, error: '未登录' },
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
    console.error('获取用户信息错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
