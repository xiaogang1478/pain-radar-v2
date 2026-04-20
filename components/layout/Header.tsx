'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface User { id: number; email: string; nickname: string; memberType: string; }

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.success) setUser(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const navItems = [
    { href: '/hot', label: '热点' },
    { href: '/pain-points', label: '痛点' },
    { href: '/pricing', label: '定价' },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(10, 14, 23, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, var(--brand-gold) 0%, var(--brand-gold-dark) 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: 'var(--bg-primary)',
            fontSize: '16px'
          }}>
            🎯
          </div>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--text-primary)'
          }}>
            痛点雷达
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }} className="hidden md:flex">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: '8px 16px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                borderRadius: 'var(--radius-sm)',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.background = 'var(--bg-card)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          {!loading && user ? (
            <>
              <Link href="/dashboard" className="btn-ghost" style={{textDecoration: 'none', fontSize: '14px'}}>
                {user.nickname || user.email.split('@')[0]}
              </Link>
              <button 
                onClick={() => {
                  fetch('/api/auth/logout', { method: 'POST' })
                    .then(() => {
                      setUser(null);
                      window.location.href = '/';
                    });
                }}
                className="btn-ghost"
                style={{textDecoration: 'none', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)'}}
              >
                退出
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost" style={{textDecoration: 'none', fontSize: '14px'}}>
                登录
              </Link>
              <Link href="/register" className="btn-primary" style={{
                textDecoration: 'none',
                fontSize: '14px',
                padding: '10px 20px'
              }}>
                免费开始
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
