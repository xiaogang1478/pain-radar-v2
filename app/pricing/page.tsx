'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const plans = [
  {
    name: '免费版',
    price: '¥0',
    period: '永久',
    description: '适合个人探索',
    features: [
      '每日查看前50条热点',
      '每日查看前20个痛点',
      '3个平台筛选',
      '基础搜索',
    ],
    notIncluded: [
      '关键词监控',
      '邮件通知',
      '数据导出',
      'API访问',
    ],
    cta: '免费开始',
    href: '/register',
    highlighted: false,
  },
  {
    name: '专业版',
    price: '¥99',
    period: '/月',
    description: '适合创业者',
    features: [
      '无限查看热点和痛点',
      '所有平台筛选',
      '高级搜索',
      '关键词监控（10个）',
      '邮件通知',
      '数据导出（CSV）',
      'API访问（100次/天）',
    ],
    notIncluded: [],
    cta: '升级专业版',
    href: '/register?plan=pro',
    highlighted: true,
  },
  {
    name: '企业版',
    price: '¥299',
    period: '/月',
    description: '适合团队',
    features: [
      '专业版全部功能',
      '无限关键词监控',
      '无限数据导出',
      'API无限访问',
      '专属客服支持',
      '自定义数据源（即将支持）',
    ],
    notIncluded: [],
    cta: '联系我们',
    href: '/contact',
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">简单透明的定价</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          选择适合你的计划，开始发现创业机会。所有计划都包含痛点发现核心功能。
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={plan.highlighted ? 'border-purple-500 shadow-lg relative' : ''}
          >
            {plan.highlighted && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500">
                推荐
              </Badge>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-muted-foreground">
                    <span className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.highlighted ? 'default' : 'outline'}
                href={plan.href}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* FAQ */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">常见问题</h2>
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="font-semibold mb-2">可以随时更换计划吗？</h3>
            <p className="text-sm text-muted-foreground">
              可以，你可以随时升级或降级你的计划。升级立即生效，降级将在当前计费周期结束后生效。
            </p>
          </div>
          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="font-semibold mb-2">支持退款吗？</h3>
            <p className="text-sm text-muted-foreground">
              如果你在购买后7天内不满意，可以申请全额退款。
            </p>
          </div>
          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="font-semibold mb-2">如何获取企业版？</h3>
            <p className="text-sm text-muted-foreground">
              企业版需要联系我们销售团队，可以享受定制化服务和批量折扣。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
