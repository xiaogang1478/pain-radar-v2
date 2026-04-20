import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证输入
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const { email, password } = validation.data;
    
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: '邮箱或密码错误' },
        { status: 401 }
      );
    }
    
    // 验证密码
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: '邮箱或密码错误' },
        { status: 401 }
      );
    }
    
    // 生成token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      memberType: user.memberType,
    });
    
    // 构建响应体（包含token给前端存储）
    const responseData = {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        memberType: user.memberType,
        memberExpire: user.memberExpire,
        token: token, // 返回token给前端
      },
      message: '登录成功',
    };
    
    // 创建响应并设置cookie
    const response = NextResponse.json(responseData);
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false, // HTTP site
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
