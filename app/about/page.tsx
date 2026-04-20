import { Header, Footer } from '@/components/layout';

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Header />
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 24px 60px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)' }}>
          关于我们
        </h1>
        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.1rem', maxWidth: '800px' }}>
          <p style={{ marginBottom: '20px' }}>
            痛点雷达是中国领先的创业机会发现平台，基于AI技术对全网热点数据进行深度分析，
            帮助创业者、投资人、产品经理发现真实的用户痛点和商业机会。
          </p>
          <p style={{ marginBottom: '20px' }}>
            我们相信，每一个伟大的产品都始于对真实痛点的深刻理解。
            痛点雷达致力于帮助创业者更高效地找到有价值的创业方向。
          </p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '40px', marginBottom: '16px', color: 'var(--text-primary)' }}>
            我们的使命
          </h2>
          <p style={{ marginBottom: '20px' }}>
            让创业更高效，让创新更精准。
            通过数据驱动的洞察，帮助创业者发现有价值的商业机会。
          </p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '40px', marginBottom: '16px', color: 'var(--text-primary)' }}>
            联系我们
          </h2>
          <p>
            商务合作：business@painradar.com<br />
            客服支持：support@painradar.com
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
