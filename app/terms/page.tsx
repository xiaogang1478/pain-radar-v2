import { Header, Footer } from '@/components/layout';

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Header />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px 60px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)' }}>
          服务条款
        </h1>
        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}>
          <p style={{ marginBottom: '20px' }}>更新日期：2026年4月20日</p>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginTop: '32px', marginBottom: '16px', color: 'var(--text-primary)' }}>
            服务说明
          </h2>
          <p style={{ marginBottom: '16px' }}>
            痛点雷达是一个创业机会发现平台，通过AI技术对全网热点数据进行分析，为用户提供有价值的创业洞察。
          </p>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginTop: '32px', marginBottom: '16px', color: 'var(--text-primary)' }}>
            用户责任
          </h2>
          <p style={{ marginBottom: '16px' }}>
            用户应妥善保管账户信息，对账户下所有活动负责。用户不得利用本服务从事任何违法活动。
          </p>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginTop: '32px', marginBottom: '16px', color: 'var(--text-primary)' }}>
            知识产权
          </h2>
          <p style={{ marginBottom: '16px' }}>
            平台上所有内容、分析结果、技术代码的知识产权归痛点雷达所有，用户不得未经授权进行复制或传播。
          </p>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginTop: '32px', marginBottom: '16px', color: 'var(--text-primary)' }}>
            免责声明
          </h2>
          <p>
            痛点雷达对平台数据的完整性、准确性不做任何保证。用户需自行判断信息价值并承担使用风险。
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
