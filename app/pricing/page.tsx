'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import SubscribeModal from '@/components/payment/SubscribeModal';

const plans = [
  {
    id: 'FREE',
    name: '免费版',
    price: 0,
    period: '永久',
    description: '适合个人探索',
    features: [
      '每日查看前50条热点',
      '每日查看前20个痛点',
      '5个平台筛选',
      '基础搜索功能',
    ],
    notIncluded: [
      '关键词监控',
      '邮件通知',
      '数据导出',
      'API访问',
    ],
    cta: '免费开始',
    popular: false,
  },
  {
    id: 'PRO',
    name: '专业版',
    price: 99,
    period: '月',
    description: '适合创业者和独立开发者',
    features: [
      '无限热点数据访问',
      '无限痛点分析',
      '全平台筛选',
      '关键词监控',
      '每日邮件推送',
      '数据导出',
    ],
    notIncluded: ['API访问'],
    cta: '立即升级',
    popular: true,
    priceData: { monthly: 99, yearly: 899 },
  },
  {
    id: 'PREMIUM',
    name: '团队版',
    price: 299,
    period: '月',
    description: '适合创业团队和研究机构',
    features: [
      '专业版全部功能',
      'API访问',
      '团队协作',
      '优先数据更新',
      '专属客服支持',
      '定制化报告',
    ],
    notIncluded: [],
    cta: '联系我们',
    popular: false,
    href: '/contact',
  },
];

const faqs = [
  {
    q: '免费版有使用限制吗？',
    a: '免费版每日可查看前50条热点和前20个痛点，适合个人探索和体验产品功能。',
  },
  {
    q: '如何升级到专业版？',
    a: '注册账号后，在控制台页面点击升级按钮即可开通。支持微信支付和支付宝。',
  },
  {
    q: '支付安全吗？',
    a: '我们使用Stripe作为支付服务商，支持Visa、Mastercard等国际信用卡，以及微信、支付宝等本地支付方式。所有支付信息都由Stripe处理，我们不会存储您的银行卡信息。',
  },
  {
    q: '可以退款吗？',
    a: '付费订阅在7天内可申请全额退款，如有质量问题请联系客服处理。',
  },
  {
    q: '团队版有什么特色功能？',
    a: '团队版提供API访问权限、多人协作功能、优先数据更新通道，以及专属客服支持。',
  },
];

export default function PricingPage() {
  const [user, setUser] = useState<{ id: number; email: string; nickname: string; memberType: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: { monthly: number; yearly: number }; features: string[] } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.success) setUser(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUpgrade = (plan: typeof plans[0]) => {
    if (plan.id === 'FREE') {
      router.push('/register');
      return;
    }
    
    if (!user) {
      router.push('/login?redirect=/pricing');
      return;
    }
    
    // 已登录，打开订阅弹窗
    setSelectedPlan({
      id: plan.id,
      name: plan.name,
      price: plan.priceData || { monthly: plan.price, yearly: plan.price * 12 },
      features: plan.features,
    });
    setShowSubscribe(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      padding: '40px 24px'
    }}>
      <div style={{maxWidth: '1100px', margin: '0 auto'}}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '60px'}}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            marginBottom: '16px',
            color: 'var(--text-primary)'
          }}>
            <span className="text-gradient">简单透明的定价</span>
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            选择适合你的方案，开始发现创业机会
          </p>
        </div>

        {/* Pricing Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '80px'
        }}>
          {plans.map((plan, index) => (
            <div
              key={index}
              className={plan.popular ? 'card-elevated' : 'card'}
              style={{
                padding: '32px',
                position: 'relative',
                border: plan.popular ? '2px solid var(--brand-gold)' : undefined,
                transform: plan.popular ? 'scale(1.02)' : undefined,
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, var(--brand-gold) 0%, var(--brand-gold-dark) 100%)',
                  color: 'var(--bg-primary)',
                  padding: '4px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600
                }}>
                  推荐
                </div>
              )}

              <div style={{marginBottom: '24px'}}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '8px'
                }}>
                  {plan.name}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  margin: 0
                }}>
                  {plan.description}
                </p>
              </div>

              <div style={{marginBottom: '24px'}}>
                <span style={{
                  fontSize: '3rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)'
                }}>
                  {plan.price === 0 ? '¥0' : `¥${plan.price}`}
                </span>
                <span style={{
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  marginLeft: '4px'
                }}>
                  / {plan.period}
                </span>
              </div>

              {plan.href ? (
                <Link
                  href={plan.href}
                  className={plan.popular ? 'btn-primary' : 'btn-secondary'}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    textDecoration: 'none',
                    padding: '14px 24px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    marginBottom: '32px',
                  }}
                >
                  {plan.cta}
                </Link>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan)}
                  className={plan.popular ? 'btn-primary' : 'btn-secondary'}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                    textDecoration: 'none',
                    padding: '14px 24px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    marginBottom: '32px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {user && plan.id !== 'FREE' ? '立即升级' : plan.cta}
                </button>
              )}

              <div>
                <p style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  功能清单
                </p>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      <Check size={16} style={{color: 'var(--accent-green)', flexShrink: 0}} />
                      {feature}
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, i) => (
                    <li key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '14px',
                      color: 'var(--text-muted)'
                    }}>
                      <span style={{opacity: 0.5}}>−</span>
                      <span style={{textDecoration: 'line-through', opacity: 0.6}}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div style={{marginBottom: '60px'}}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '40px',
            color: 'var(--text-primary)'
          }}>
            常见问题
          </h2>

          <div style={{
            maxWidth: '700px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--text-primary)'
                  }}>
                    {faq.q}
                  </span>
                  <span style={{
                    fontSize: '18px',
                    color: 'var(--text-muted)',
                    transition: 'transform var(--transition-fast)'
                  }}>
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                {openFaq === index && (
                  <div style={{
                    padding: '0 24px 20px',
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          textAlign: 'center',
          padding: '60px 24px',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '12px',
            color: 'var(--text-primary)'
          }}>
            还在犹豫？
          </h3>
          <p style={{
            color: 'var(--text-secondary)',
            marginBottom: '24px'
          }}>
            先从免费版开始，体验产品核心功能
          </p>
          <Link href="/register" className="btn-primary" style={{
            textDecoration: 'none',
            display: 'inline-block',
            padding: '14px 32px'
          }}>
            免费开始探索
          </Link>
        </div>
      </div>

      {/* Subscribe Modal */}
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
