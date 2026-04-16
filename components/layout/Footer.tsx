import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              痛点雷达
            </div>
            <p className="text-sm text-muted-foreground">
              中国版 PainHunt · 发现创业机会 · 解决真实痛点
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">快速链接</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary">首页</Link></li>
              <li><Link href="/hot" className="hover:text-primary">热点监控</Link></li>
              <li><Link href="/pain-points" className="hover:text-primary">痛点发现</Link></li>
              <li><Link href="/pricing" className="hover:text-primary">定价方案</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="font-semibold mb-3">支持</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-primary">帮助中心</Link></li>
              <li><Link href="/contact" className="hover:text-primary">联系我们</Link></li>
              <li><Link href="/faq" className="hover:text-primary">常见问题</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-3">法律</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary">隐私政策</Link></li>
              <li><Link href="/terms" className="hover:text-primary">服务条款</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} 痛点雷达平台 · 为创业者发现真实机会</p>
          <p className="mt-1">Powered by 榜眼数据API</p>
        </div>
      </div>
    </footer>
  );
}
