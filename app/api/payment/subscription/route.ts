import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
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
        memberType: true,
        memberExpire: true,
        email: true,
        nickname: true,
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }
    
    // 检查会员是否过期
    let isExpired = false;
    if (user.memberExpire && new Date() > user.memberExpire) {
      isExpired = true;
    }
    
    // 订阅方案
    const plans = [
      {
        id: 'PRO',
        name: 'Pro专业版',
        monthlyPrice: 28,
        yearlyPrice: 199,
        features: [
          '无限热点监控',
          '无限痛点分析',
          '关键词追踪（最多20个）',
          '数据导出',
          '优先客服支持',
        ],
        isPopular: true,
      },
      {
        id: 'PREMIUM',
        name: 'Premium旗舰版',
        monthlyPrice: 68,
        yearlyPrice: 499,
        features: [
          'Pro全部功能',
          '无限关键词追踪',
          'API访问权限',
          '专属顾问服务',
          '定制报告',
        ],
        isPopular: false,
      },
    ];
    
    return NextResponse.json({
      success: true,
      data: {
        memberType: isExpired ? 'FREE' : user.memberType,
        memberExpire: user.memberExpire?.toISOString() || null,
        isExpired,
        email: user.email,
        nickname: user.nickname,
        plans,
      }
    });
    
  } catch (error) {
    console.error('获取订阅状态失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
