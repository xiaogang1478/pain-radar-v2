'use client';

import { useState } from 'react';
import { usePainPoints } from '@/hooks/useData';
import { PainPointCard } from '@/components/features/dashboard/PainPointCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Filter } from 'lucide-react';
import { type PainPoint } from '@/types';

const CATEGORIES = [
  '全部',
  '融资创业',
  '市场竞争',
  '产品研发',
  '团队管理',
  '市场营销',
  '用户运营',
  '技术选型',
];

export default function PainPointsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [minScore, setMinScore] = useState(5);
  const [page, setPage] = useState(1);
  
  const { data: painPointsData, isLoading } = usePainPoints({
    category: selectedCategory || undefined,
    minScore,
    page,
    pageSize: 24,
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">痛点发现</h1>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">分类：</span>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Badge
                key={cat}
                variant={selectedCategory === (cat === '全部' ? '' : cat) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => { setSelectedCategory(cat === '全部' ? '' : cat); setPage(1); }}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium">最低评分：</span>
        <div className="flex gap-2">
          {[5, 6, 7, 8].map((score) => (
            <Badge
              key={score}
              variant={minScore === score ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => { setMinScore(score); setPage(1); }}
            >
              {score}+ 分
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Results */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : painPointsData?.items?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>没有找到匹配的痛点</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {painPointsData?.items?.map((item: PainPoint) => (
              <PainPointCard key={item.id} item={item} />
            ))}
          </div>
          
          {/* Pagination */}
          {painPointsData && painPointsData.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                上一页
              </Button>
              <span className="text-sm text-muted-foreground">
                第 {page} / {painPointsData.totalPages} 页
              </span>
              <Button
                variant="outline"
                disabled={page === painPointsData.totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                下一页
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
