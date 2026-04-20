import { Header, Footer } from '@/components/layout';

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Header />
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 24px 60px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)' }}>
          联系我们
        </h1>
        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.1rem', maxWidth: '800px' }}>
          <p style={{ marginBottom: '20px' }}>
            我们期待与您交流，无论是商务合作、产品反馈还是技术支持。
          </p>
          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', marginTop: '32px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
              商务合作
            </h2>
            <p style={{ marginBottom: '8px' }}>📧 business@painradar.com</p>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', marginTop: '16px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
              客服支持
            </h2>
            <p style={{ marginBottom: '8px' }}>📧 support@painradar.com</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
