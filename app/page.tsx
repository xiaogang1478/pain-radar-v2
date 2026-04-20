'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User { id: number; email: string; nickname: string; memberType: string; }
interface Stats { totalHotItems: number; totalPlatforms: number; totalPainPoints: number; }

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.json()).catch(() => null),
      fetch('/api/stats').then(r => r.json()).catch(() => null)
    ]).then(([userData, statsData]) => {
      if (userData?.success) setUser(userData.data);
      if (statsData?.success) setStats(statsData.data);
      setLoading(false);
    });
  }, []);

  const features = [
    {
      icon: '🎯',
      title: '精准痛点识别',
      desc: 'AI智能分析全网热点，识别真实用户痛点'
    },
    {
      icon: '📊',
      title: '多平台聚合',
      desc: '覆盖微博、知乎、抖音等100+平台数据'
    },
    {
      icon: '⚡',
      title: '实时监控',
      desc: '7×24小时追踪热点动态，第一时间发现机会'
    },
    {
      icon: '💎',
      title: '价值评估',
      desc: '多维度评估痛点商业价值，优先级一目了然'
    }
  ];

  return (
    <div style={{background: 'var(--bg-primary)'}}>
      {/* Hero Section */}
      <section style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '80px 24px'
      }}>
        {/* Background Glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(212, 165, 116, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{maxWidth: '900px', textAlign: 'center', position: 'relative', zIndex: 1}}>
          {/* Badge */}
          <div style={{marginBottom: '24px'}}>
            <span className="badge badge-gold" style={{fontSize: '13px', padding: '8px 16px'}}>
              🚀 中国版 PainHunt
            </span>
          </div>
          
          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '24px',
            letterSpacing: '-0.02em'
          }}>
            <span className="text-gradient">发现真实痛点</span>
            <br />
            <span style={{color: 'var(--text-secondary)'}}>找到创业机会</span>
          </h1>
          
          {/* Subtitle */}
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: 1.7
          }}>
            聚合全网100+平台热搜数据，AI智能分析痛点强度与商业价值
          </p>
          
          {/* CTA Buttons */}
          <div style={{display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap'}}>
            {!loading && user ? (
              <>
                <Link href="/dashboard" className="btn-primary" style={{textDecoration: 'none', fontSize: '16px', padding: '14px 32px'}}>
                  进入控制台 →
                </Link>
                <Link href="/hot" className="btn-secondary" style={{textDecoration: 'none', fontSize: '16px', padding: '14px 32px'}}>
                  查看热点
                </Link>
              </>
            ) : (
              <>
                <Link href="/register" className="btn-primary" style={{textDecoration: 'none', fontSize: '16px', padding: '14px 32px'}}>
                  免费开始 →
                </Link>
                <Link href="/hot" className="btn-secondary" style={{textDecoration: 'none', fontSize: '16px', padding: '14px 32px'}}>
                  查看热点
                </Link>
              </>
            )}
          </div>
          
          {/* Stats */}
          {stats && (
            <div style={{
              display: 'flex',
              gap: '48px',
              justifyContent: 'center',
              marginTop: '80px',
              paddingTop: '40px',
              borderTop: '1px solid var(--border-subtle)'
            }}>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2.5rem', fontWeight: 700, color: 'var(--brand-gold)'}}>
                  {stats.totalHotItems.toLocaleString()}
                </div>
                <div style={{color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px'}}>热点数据</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2.5rem', fontWeight: 700, color: 'var(--brand-gold)'}}>
                  {stats.totalPlatforms}
                </div>
                <div style={{color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px'}}>监控平台</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2.5rem', fontWeight: 700, color: 'var(--brand-gold)'}}>
                  {stats.totalPainPoints.toLocaleString()}
                </div>
                <div style={{color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px'}}>痛点分析</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '100px 24px',
        background: 'var(--bg-secondary)'
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '60px'}}>
            <h2 style={{fontSize: '2.5rem', fontWeight: 700, marginBottom: '16px'}}>
              <span className="text-gradient">为什么选择痛点雷达</span>
            </h2>
            <p style={{color: 'var(--text-secondary)', fontSize: '1.1rem'}}>
              专业、精准、高效的创业机会发现工具
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                className="card"
                style={{
                  padding: '32px',
                  textAlign: 'left',
                  animation: `fadeIn 0.5s ease ${index * 0.1}s forwards`
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'rgba(212, 165, 116, 0.1)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginBottom: '20px'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '12px',
                  color: 'var(--text-primary)'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '100px 24px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(212, 165, 116, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 1}}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '20px'
          }}>
            准备好发现你的创业机会了吗？
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            marginBottom: '40px'
          }}>
            加入我们，开始用AI驱动的方式发现真实的市场痛点
          </p>
          <Link href="/register" className="btn-primary" style={{
            textDecoration: 'none',
            fontSize: '18px',
            padding: '16px 48px',
            display: 'inline-block'
          }}>
            立即免费开始
          </Link>
        </div>
      </section>
    </div>
  );
}
