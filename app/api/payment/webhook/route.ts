import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

// 获取Stripe实例（延迟初始化）
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(key, { apiVersion: '2026-03-25.dahlia' });
}

// 计算会员过期时间
function calculateExpireDate(period: string): Date {
  const now = new Date();
  if (period === 'yearly') {
    now.setFullYear(now.getFullYear() + 1);
  } else {
    now.setMonth(now.getMonth() + 1);
  }
  return now;
}

// 映射plan到MemberType
function mapPlanToMemberType(plan: string): string {
  switch (plan.toUpperCase()) {
    case 'PRO':
      return 'PRO';
    case 'PREMIUM':
      return 'ENTERPRISE';
    default:
      return 'FREE';
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  
  let event: Stripe.Event;
  
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: any) {
    console.error('Webhook签名验证失败:', err.message);
    return NextResponse.json({ error: '签名验证失败' }, { status: 400 });
  }
  
  // 处理支付成功事件
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { userId, plan, period } = paymentIntent.metadata;
    
    try {
      const memberType = mapPlanToMemberType(plan);
      const expireDate = calculateExpireDate(period);
      
      // 更新用户会员状态
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
          memberType: memberType as any,
          memberExpire: expireDate,
        }
      });
      
      console.log(`✅ 用户 ${userId} 订阅 ${plan} ${period} 成功，到期时间: ${expireDate}`);
      
    } catch (error) {
      console.error('更新会员状态失败:', error);
      return NextResponse.json({ error: '更新失败' }, { status: 500 });
    }
  }
  
  return NextResponse.json({ received: true });
}
