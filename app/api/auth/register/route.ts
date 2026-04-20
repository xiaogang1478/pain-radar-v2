import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证输入
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const { email, password, nickname } = validation.data;
    
    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: '该邮箱已被注册' },
        { status: 400 }
      );
    }
    
    // 密码加密
    const passwordHash = await hashPassword(password);
    
    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        nickname: nickname || email.split('@')[0],
        memberType: 'FREE',
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        memberType: true,
        createdAt: true,
      },
    });
    
    // 生成token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      memberType: user.memberType,
    });
    
    // 构建响应体（包含token给前端存储）
    const responseBody = {
      success: true,
      data: {
        ...user,
        token: token, // 返回token给前端
      },
      message: '注册成功',
    };
    
    // 创建响应并设置cookie
    const response = NextResponse.json(responseBody, { status: 200 });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false, // HTTP site
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('注册错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
