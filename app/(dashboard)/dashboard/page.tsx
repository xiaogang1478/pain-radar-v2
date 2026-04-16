'use client';

import { useCurrentUser } from '@/hooks/useAuth';
import { useStats, useHotItems, usePainPoints, useKeywords, useFavorites } from '@/hooks/useData';
import { StatsCards } from '@/components/features/dashboard/StatsCards';
import { HotItemCard } from '@/components/features/dashboard/HotItemCard';
import { PainPointCard } from '@/components/features/dashboard/PainPointCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Bell } from 'lucide-react';
import { MEMBER_PERMISSIONS, type HotItem, type PainPoint } from '@/types';

export default function DashboardPage() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: hotItemsData, isLoading: hotLoading } = useHotItems({ pageSize: 10 });
  const { data: painPointsData, isLoading: painLoading } = usePainPoints({ minScore: 5, pageSize: 5 });
  const { data: keywords } = useKeywords();
  const { data: favorites } = useFavorites();
  
  const permissions = user ? MEMBER_PERMISSIONS[user.memberType] : MEMBER_PERMISSIONS.FREE;
  
  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">欢迎回来，{user?.nickname || user?.email}</h1>
          <p className="text-muted-foreground">
            当前会员：
            <Badge variant={user?.memberType === 'FREE' ? 'secondary' : 'default'}>
              {user?.memberType === 'FREE' ? '免费版' : user?.memberType === 'PRO' ? '专业版' : '企业版'}
            </Badge>
          </p>
        </div>
        {user?.memberType === 'FREE' && (
          <Button href="/pricing">升级专业版</Button>
        )}
      </div>
      
      {/* Stats */}
      <div className="mb-8">
        <StatsCards stats={stats} isLoading={statsLoading} />
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="hot" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hot">热点监控</TabsTrigger>
          <TabsTrigger value="pain">痛点发现</TabsTrigger>
          {permissions.maxKeywords > 0 && (
            <TabsTrigger value="keywords">关键词监控</TabsTrigger>
          )}
          {permissions.maxKeywords > 0 && (
            <TabsTrigger value="favorites">我的收藏</TabsTrigger>
          )}
        </TabsList>
        
        {/* Hot Items Tab */}
        <TabsContent value="hot" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">最新热点</h2>
            <Button variant="outline" href="/hot">查看全部</Button>
          </div>
          {hotLoading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {hotItemsData?.items?.slice(0, 10).map((item: HotItem) => (
                <HotItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Pain Points Tab */}
        <TabsContent value="pain" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">高价值痛点</h2>
            <Button variant="outline" href="/pain-points">查看全部</Button>
          </div>
          {painLoading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {painPointsData?.items?.slice(0, 10).map((item: PainPoint) => (
                <PainPointCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Keywords Tab */}
        {permissions.maxKeywords > 0 && (
          <TabsContent value="keywords" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">关键词监控</h2>
                <p className="text-sm text-muted-foreground">
                  已添加 {keywords?.length || 0} / {permissions.maxKeywords === -1 ? '∞' : permissions.maxKeywords} 个关键词
                </p>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" /> 添加关键词
              </Button>
            </div>
            
            {keywords?.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>还没有添加关键词</p>
                  <p className="text-sm">添加关键词，有新匹配热点时我们会通知你</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {keywords?.map((kw: any) => (
                  <Card key={kw.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{kw.keyword}</Badge>
                        {kw.notifyEmail && (
                          <Bell className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        )}
        
        {/* Favorites Tab */}
        {permissions.maxKeywords > 0 && (
          <TabsContent value="favorites" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">我的收藏</h2>
            </div>
            
            {favorites?.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <p>还没有收藏内容</p>
                  <p className="text-sm">收藏感兴趣的热点和痛点，方便后续查看</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {favorites?.map((fav: any) => (
                  fav.hotItem ? (
                    <HotItemCard key={fav.id} item={fav.hotItem} />
                  ) : fav.painPoint ? (
                    <PainPointCard key={fav.id} item={fav.painPoint} />
                  ) : null
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
