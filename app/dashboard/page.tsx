'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import SubscribeModal from '@/components/payment/SubscribeModal';

interface UserData {
  memberType: string;
  memberExpire: string | null;
  isExpired: boolean;
  email: string;
  nickname: string | null;
  plans: Array<{
    id: string;
    name: string;
    monthlyPrice: number;
    yearlyPrice: number;
    features: string[];
    isPopular: boolean;
  }>;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: { monthly: number; yearly: number }; features: string[] } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/payment/subscription');
      const data = await res.json();
      
      if (data.success) {
        setUser(data.data);
      } else if (data.error === '请先登录') {
        router.push('/login');
      }
    } catch (error) {
      console.error('获取用户数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (plan: typeof user!.plans[0]) => {
    setSelectedPlan({
      id: plan.id,
      name: plan.name,
      price: { monthly: plan.monthlyPrice, yearly: plan.yearlyPrice },
      features: plan.features,
    });
    setShowSubscribe(true);
  };

  const getMemberBadge = (type: string) => {
    switch (type) {
      case 'PRO':
        return { label: 'Pro', color: '#d4a574' };
      case 'ENTERPRISE':
        return { label: 'Premium', color: '#9333ea' };
      default:
        return { label: 'Free', color: 'var(--text-muted)' };
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-secondary)' }}>加载中...</div>
      </div>
    );
  }

  const badge = user ? getMemberBadge(user.memberType) : { label: 'Free', color: 'var(--text-muted)' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Header />
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px 60px' }}>
        {/* 用户信息区 */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {/* 头像 */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--brand-gold) 0%, var(--brand-gold-dark) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 700,
              color: '#000',
            }}>
              {user?.nickname?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            
            {/* 信息 */}
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {user?.nickname || '用户'}
                </h1>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: badge.color,
                  color: badge.label === 'Free' ? '#fff' : '#000',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>
                  {badge.label}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
                {user?.email}
              </p>
              {user?.memberExpire && !user.isExpired && (
                <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0', fontSize: '0.85rem' }}>
                  到期时间: {new Date(user.memberExpire).toLocaleDateString('zh-CN')}
                </p>
              )}
            </div>
            
            {/* 升级按钮 */}
            {user?.memberType === 'FREE' && (
              <button
                onClick={() => handleSubscribe(user.plans[0])}
                style={{
                  padding: '12px 32px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--brand-gold)',
                  color: '#000',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                升级Pro
              </button>
            )}
          </div>
        </div>

        {/* 订阅方案 */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '24px' }}>
          订阅方案
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          {user?.plans.map((plan) => (
            <div
              key={plan.id}
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '28px',
                border: plan.isPopular ? '2px solid var(--brand-gold)' : '1px solid var(--border-subtle)',
                position: 'relative',
              }}
            >
              {plan.isPopular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--brand-gold)',
                  color: '#000',
                  padding: '4px 16px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>
                  推荐
                </div>
              )}
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
                {plan.name}
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ¥{plan.yearlyPrice}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>/年</span>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                  或 ¥{plan.monthlyPrice}/月
                </div>
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                {plan.features.map((feature, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 0',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                  }}>
                    <span style={{ color: 'var(--success)' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscribe(plan)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: plan.isPopular ? 'none' : '1px solid var(--border-subtle)',
                  background: plan.isPopular ? 'var(--brand-gold)' : 'transparent',
                  color: plan.isPopular ? '#000' : 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {user?.memberType === plan.id ? '当前方案' : '立即订阅'}
              </button>
            </div>
          ))}
        </div>

        {/* 功能说明 */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '24px' }}>
          功能对比
        </h2>
        
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid var(--border-subtle)',
          overflowX: 'auto',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-primary)', fontWeight: 600 }}>功能</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Free</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', color: 'var(--brand-gold)', fontSize: '0.85rem' }}>Pro</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', color: '#9333ea', fontSize: '0.85rem' }}>Premium</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['热点监控', '100条/天', '无限', '无限'],
                ['痛点分析', '20条/天', '无限', '无限'],
                ['关键词追踪', '1个', '20个', '无限'],
                ['数据导出', '❌', '✓', '✓'],
                ['API访问', '❌', '❌', '✓'],
                ['专属顾问', '❌', '❌', '✓'],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{row[0]}</td>
                  <td style={{ textAlign: 'center', padding: '12px 8px', color: 'var(--text-muted)' }}>{row[1]}</td>
                  <td style={{ textAlign: 'center', padding: '12px 8px', color: 'var(--text-primary)' }}>{row[2]}</td>
                  <td style={{ textAlign: 'center', padding: '12px 8px', color: '#9333ea' }}>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      
      <Footer />
      
      {selectedPlan && (
        <SubscribeModal
          isOpen={showSubscribe}
          onClose={() => setShowSubscribe(false)}
          plan={selectedPlan.id as 'PRO' | 'PREMIUM'}
          planName={selectedPlan.name}
          price={selectedPlan.price}
          features={selectedPlan.features}
        />
      )}
    </div>
  );
}
