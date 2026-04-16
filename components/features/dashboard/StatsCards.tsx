'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Stats } from '@/types';
import { Flame, Globe, Target } from 'lucide-react';

interface StatsCardsProps {
  stats: Stats | undefined;
  isLoading: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-10 bg-muted rounded mb-2" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  const items = [
    {
      label: '热点数据',
      value: stats?.totalHotItems || 0,
      icon: Flame,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      label: '监控平台',
      value: stats?.totalPlatforms || 0,
      icon: Globe,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: '发现痛点',
      value: stats?.totalPainPoints || 0,
      icon: Target,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      label: '最后更新',
      value: stats?.lastUpdated
        ? new Date(stats.lastUpdated).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '-',
      icon: null,
      color: 'text-gray-500',
      bg: 'bg-gray-500/10',
    },
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              {item.icon && (
                <div className={`p-3 rounded-lg ${item.bg}`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
              )}
              <div>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
