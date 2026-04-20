'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: 'PRO' | 'PREMIUM';
  planName: string;
  price: { monthly: number; yearly: number };
  features: string[];
}

export default function SubscribeModal({
  isOpen,
  onClose,
  plan,
  planName,
  price,
  features
}: SubscribeModalProps) {
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ plan: plan.toLowerCase(), period }),
      });
      
      const data = await res.json();
      
      if (!data.success) {
        alert(data.error || '创建支付失败');
        setLoading(false);
        return;
      }
      
      // 使用Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        alert('Stripe加载失败');
        setLoading(false);
        return;
      }
      
      const { error } = await stripe.confirmPayment({
        clientSecret: data.data.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard?payment=success`,
        },
      });
      
      if (error) {
        alert(error.message || '支付失败');
      }
    } catch (error: any) {
      alert(error.message || '支付失败');
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '16px',
        maxWidth: '480px',
        width: '100%',
        padding: '32px',
        border: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            订阅 {planName}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            ×
          </button>
        </div>
        
        {/* 周期选择 */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => setPeriod('monthly')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: period === 'monthly' ? '2px solid var(--brand-gold)' : '1px solid var(--border-subtle)',
              background: period === 'monthly' ? 'rgba(212, 165, 116, 0.1)' : 'transparent',
              color: period === 'monthly' ? 'var(--brand-gold)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            月度订阅<br />
            <span style={{ fontSize: '1.5rem' }}>¥{price.monthly}</span>/月
          </button>
          <button
            onClick={() => setPeriod('yearly')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: period === 'yearly' ? '2px solid var(--brand-gold)' : '1px solid var(--border-subtle)',
              background: period === 'yearly' ? 'rgba(212, 165, 116, 0.1)' : 'transparent',
              color: period === 'yearly' ? 'var(--brand-gold)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            年度订阅<br />
            <span style={{ fontSize: '1.5rem' }}>¥{price.yearly}</span>/年
            <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '4px' }}>
              省{price.monthly * 12 - price.yearly}元
            </div>
          </button>
        </div>
        
        {/* 功能列表 */}
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
          {features.map((feature, i) => (
            <li key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 0',
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
            }}>
              <span style={{ color: 'var(--success)' }}>✓</span>
              {feature}
            </li>
          ))}
        </ul>
        
        {/* 支付按钮 */}
        <button
          onClick={handleSubscribe}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--brand-gold)',
            color: '#000',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? '处理中...' : `立即订阅 ¥${period === 'monthly' ? price.monthly : price.yearly}`}
        </button>
        
        <p style={{
          textAlign: 'center',
          marginTop: '16px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}>
          支付安全由 Stripe 提供保障
        </p>
      </div>
    </div>
  );
}
