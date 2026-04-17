'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User { id: number; email: string; nickname: string; memberType: string; }

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success) setUser(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: '#f8fafc'}}>
      <header style={{padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
        <Link href="/" style={{display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#f8fafc'}}>
          <div style={{width: '32px', height: '32px', background: 'linear-gradient(135deg, #d4a574, #f59e0b)', borderRadius: '8px'}} />
          <span style={{fontSize: '1.25rem', fontWeight: 'bold'}}>痛点雷达</span>
        </Link>
        <nav style={{display: 'flex', gap: '32px', alignItems: 'center'}}>
          <Link href="/hot" style={{color: '#94a3b8', textDecoration: 'none'}}>热点</Link>
          <Link href="/pricing" style={{color: '#94a3b8', textDecoration: 'none'}}>定价</Link>
          {!loading && user ? (
            <>
              <Link href="/dashboard" style={{color: '#d4a574', textDecoration: 'none', fontWeight: 600}}>
                {user.nickname || user.email}
              </Link>
              <Link href="/api/auth/logout" style={{color: '#94a3b8', textDecoration: 'none'}}>退出</Link>
            </>
          ) : (
            <>
              <Link href="/login" style={{color: '#f8fafc', textDecoration: 'none'}}>登录</Link>
              <Link href="/register" style={{background: 'linear-gradient(135deg, #d4a574, #f59e0b)', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', color: '#0f172a'}}>免费开始</Link>
            </>
          )}
        </nav>
      </header>
      <section style={{padding: '120px 48px', textAlign: 'center', maxWidth: '900px', margin: '0 auto'}}>
        <h1 style={{fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 'bold', marginBottom: '24px', background: 'linear-gradient(135deg, #f8fafc, #d4a574)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>发现真实痛点<br/>找到创业机会</h1>
        <p style={{fontSize: '1.25rem', color: '#94a3b8', marginBottom: '48px'}}>聚合全网100+平台热搜数据，AI智能分析痛点强度与商业价值</p>
        <div style={{display: 'flex', gap: '16px', justifyContent: 'center'}}>
          <Link href="/register" style={{background: 'linear-gradient(135deg, #d4a574, #f59e0b)', padding: '16px 32px', borderRadius: '12px', textDecoration: 'none', color: '#0f172a', fontWeight: 'bold'}}>免费试用</Link>
          <Link href="/hot" style={{border: '1px solid rgba(255,255,255,0.2)', padding: '16px 32px', borderRadius: '12px', textDecoration: 'none', color: '#f8fafc'}}>查看热点</Link>
        </div>
      </section>
      <footer style={{padding: '32px 48px', textAlign: 'center', color: '#64748b'}}>© 2026 痛点雷达</footer>
    </div>
  );
}
