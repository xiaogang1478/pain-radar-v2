import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// 价格配置（分）
const PRICES = {
  PRO_MONTHLY: 2800,    // Pro月度 - ¥28
  PRO_YEARLY: 19900,    // Pro年度 - ¥199
  PREMIUM_MONTHLY: 6800, // Premium月度 - ¥68
  PREMIUM_YEARLY: 49900, // Premium年度 - ¥499
};

// 获取Stripe实例（延迟初始化）
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(key, { apiVersion: '2026-03-25.dahlia' });
}

export async function POST(request: NextRequest) {
  try {
    const { plan, period } = await request.json();
    
    // 获取当前用户
    const payload = await getCurrentUser();
    if (!payload) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }
    
    // 确定价格
    const priceKey = `${plan.toUpperCase()}_${period.toUpperCase()}`;
    const amount = PRICES[priceKey as keyof typeof PRICES];
    
    if (!amount) {
      return NextResponse.json(
        { success: false, error: '无效的套餐' },
        { status: 400 }
      );
    }
    
    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }
    
    // 创建Stripe Payment Intent
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'cny',
      metadata: {
        userId: user.id.toString(),
        userEmail: user.email,
        plan,
        period,
      },
      description: `痛点雷达 ${plan} ${period === 'monthly' ? '月度' : '年度'}订阅`,
      receipt_email: user.email,
    });
    
    return NextResponse.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        amount,
        plan,
        period,
      }
    });
    
  } catch (error: any) {
    console.error('创建支付失败:', error);
    return NextResponse.json(
      { success: false, error: error.message || '支付创建失败' },
      { status: 500 }
    );
  }
}
