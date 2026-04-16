'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStats, useHotItems, usePainPoints, usePlatforms } from '@/hooks/useData';
import { StatsCards } from '@/components/features/dashboard/StatsCards';
import { HotItemCard } from '@/components/features/dashboard/HotItemCard';
import { PainPointCard } from '@/components/features/dashboard/PainPointCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ArrowRight, Zap, TrendingUp, Clock } from 'lucide-react';
import { type HotItem, type PainPoint } from '@/types';

export default function HomePage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: platforms } = usePlatforms();
  const { data: hotItemsData, isLoading: hotLoading } = useHotItems({
    platform: selectedPlatform,
    pageSize: 12,
    q: searchQuery || undefined,
  });
  const { data: painPointsData, isLoading: painLoading } = usePainPoints({
    minScore: 5,
    pageSize: 6,
  });
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-5" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              发现真实痛点
              <br />
              <span className="text-yellow-300">抓住创业机会</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              痛点雷达是中国版 PainHunt，实时监控全网热点，AI自动识别高价值创业痛点。
              第一时间发现蓝海机会，快人一步。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" href="/register" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                免费开始
              </Button>
              <Button size="lg" variant="outline" href="/pricing" className="border-white text-white hover:bg-white/10">
                查看定价
              </Button>
            </div>
          </div>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <StatsCards stats={stats} isLoading={statsLoading} />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            为什么选择痛点雷达？
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">快人一步</h3>
              <p className="text-muted-foreground text-sm">
                第一时间发现热点中的创业机会，抢占市场先机
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">精准分析</h3>
              <p className="text-muted-foreground text-sm">
                AI评分的痛度和商业价值，精确定位高价值机会
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">省时高效</h3>
              <p className="text-muted-foreground text-sm">
                自动化数据采集和分析，把时间用在刀刃上
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Hot Items Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">实时热点监控</h2>
            <Button variant="ghost" href="/hot">
              查看更多 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索热点..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedPlatform === '' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedPlatform('')}
              >
                全部
              </Badge>
              {platforms?.slice(0, 5).map((platform) => (
                <Badge
                  key={platform.hashid}
                  variant={selectedPlatform === platform.hashid ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedPlatform(platform.hashid)}
                >
                  {platform.display}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Hot Items Grid */}
          {hotLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotItemsData?.items?.slice(0, 12).map((item: HotItem) => (
                <HotItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Pain Points Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">🔥 发现痛点机会</h2>
            <Button variant="ghost" href="/pain-points">
              查看更多 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          {painLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {painPointsData?.items?.slice(0, 6).map((item: PainPoint) => (
                <PainPointCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            准备好发现你的创业机会了吗？
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            免费注册，立即开始监控热点、发现痛点
          </p>
          <Button size="lg" href="/register" className="bg-yellow-500 hover:bg-yellow-600 text-black">
            免费开始
          </Button>
        </div>
      </section>
    </div>
  );
}
