import { Header, Footer } from '@/components/layout';

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Header />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px 60px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)' }}>
          隐私政策
        </h1>
        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}>
          <p style={{ marginBottom: '20px' }}>更新日期：2026年4月20日</p>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginTop: '32px', marginBottom: '16px', color: 'var(--text-primary)' }}>
            信息收集
          </h2>
          <p style={{ marginBottom: '16px' }}>
            我们收集您在使用服务时主动提供的信息，包括但不限于：注册信息、联系方式、支付信息等。
          </p>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginTop: '32px', marginBottom: '16px', color: 'var(--text-primary)' }}>
            信息使用
          </h2>
          <p style={{ marginBottom: '16px' }}>
            我们使用收集的信息用于：提供和改进服务、处理交易、发送重要通知等。
          </p>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginTop: '32px', marginBottom: '16px', color: 'var(--text-primary)' }}>
            信息保护
          </h2>
          <p style={{ marginBottom: '16px' }}>
            我们采用行业标准的安全措施保护您的个人信息，防止数据未经授权的访问、使用或泄露。
          </p>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginTop: '32px', marginBottom: '16px', color: 'var(--text-primary)' }}>
            联系我们
          </h2>
          <p>
            如您对本隐私政策有任何疑问，请联系：privacy@painradar.com
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
