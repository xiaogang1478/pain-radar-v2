'use client';
'use client';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    product: [
      { href: '/hot', label: '热点监控' },
      { href: '/pain-points', label: '痛点发现' },
      { href: '/pricing', label: '定价方案' },
    ],
    company: [
      { href: '/about', label: '关于我们' },
      { href: '/contact', label: '联系我们' },
      { href: '/blog', label: '博客' },
    ],
    legal: [
      { href: '/privacy', label: '隐私政策' },
      { href: '/terms', label: '服务条款' },
    ],
  };

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '60px 24px 40px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '48px',
          marginBottom: '48px'
        }}>
          {/* Brand */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, var(--brand-gold) 0%, var(--brand-gold-dark) 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px'
              }}>
                🎯
              </div>
              <span style={{fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)'}}>
                痛点雷达
              </span>
            </div>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '14px',
              lineHeight: 1.6,
              maxWidth: '280px'
            }}>
              中国版 PainHunt · 发现创业机会 · 解决真实痛点
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 style={{fontWeight: 600, marginBottom: '16px', fontSize: '14px', color: 'var(--text-primary)'}}>
              产品
            </h4>
            <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px'}}>
              {footerLinks.product.map(link => (
                <li key={link.href}>
                  <Link href={link.href} style={{
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color var(--transition-fast)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{fontWeight: 600, marginBottom: '16px', fontSize: '14px', color: 'var(--text-primary)'}}>
              公司
            </h4>
            <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px'}}>
              {footerLinks.company.map(link => (
                <li key={link.href}>
                  <Link href={link.href} style={{
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color var(--transition-fast)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{fontWeight: 600, marginBottom: '16px', fontSize: '14px', color: 'var(--text-primary)'}}>
              法律
            </h4>
            <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px'}}>
              {footerLinks.legal.map(link => (
                <li key={link.href}>
                  <Link href={link.href} style={{
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color var(--transition-fast)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          paddingTop: '32px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{color: 'var(--text-muted)', fontSize: '13px', margin: 0}}>
            © {currentYear} 痛点雷达平台 · 为创业者发现真实机会
          </p>
          <p style={{color: 'var(--text-muted)', fontSize: '13px', margin: 0}}>
            Powered by 榜眼数据API
          </p>
        </div>
      </div>
    </footer>
  );
}
