'use client';

import { useState } from 'react';
import { useHotItems, usePlatforms } from '@/hooks/useData';
import { HotItemCard } from '@/components/features/dashboard/HotItemCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter } from 'lucide-react';
import { type HotItem } from '@/types';

export default function HotPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  
  const { data: platforms } = usePlatforms();
  const { data: hotItemsData, isLoading } = useHotItems({
    platform: selectedPlatform,
    page,
    pageSize: 24,
    q: searchQuery || undefined,
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">热点监控</h1>
      
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
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedPlatform === '' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => { setSelectedPlatform(''); setPage(1); }}
            >
              全部
            </Badge>
            {platforms?.map((platform) => (
              <Badge
                key={platform.hashid}
                variant={selectedPlatform === platform.hashid ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => { setSelectedPlatform(platform.hashid); setPage(1); }}
              >
                {platform.display}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      {/* Results */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : hotItemsData?.items?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>没有找到匹配的热点</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotItemsData?.items?.map((item: HotItem) => (
              <HotItemCard key={item.id} item={item} />
            ))}
          </div>
          
          {/* Pagination */}
          {hotItemsData && hotItemsData.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                上一页
              </Button>
              <span className="text-sm text-muted-foreground">
                第 {page} / {hotItemsData.totalPages} 页
              </span>
              <Button
                variant="outline"
                disabled={page === hotItemsData.totalPages}
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
