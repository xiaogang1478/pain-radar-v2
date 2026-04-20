import { Header, Footer } from '@/components/layout';

export default function BlogPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Header />
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 24px 60px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)' }}>
          博客
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '40px' }}>
          创业洞察、行业分析、产品思考
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '24px', border: '1px solid var(--border-subtle)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
              即将发布
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              博客内容即将上线，敬请期待...
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
