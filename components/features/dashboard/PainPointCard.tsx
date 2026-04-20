'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PainPoint } from '@/types';
import { Zap, TrendingUp, ExternalLink, X } from 'lucide-react';

interface PainPointCardProps {
  item: PainPoint;
}

export function PainPointCard({ item }: PainPointCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <Card 
        className="hover:shadow-md transition-shadow border-l-4 border-l-orange-500 cursor-pointer"
        onClick={() => setShowDetail(true)}
      >
        <CardContent className="p-4 space-y-4">
          {/* Title */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-sm leading-snug line-clamp-2">
              {item.title}
            </h3>
            {item.category && (
              <Badge variant="outline" className="text-xs flex-shrink-0">
                {item.category}
              </Badge>
            )}
          </div>
          
          {/* Metrics */}
          <div className="space-y-3">
            {/* Pain Level */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-orange-500">
                  <Zap className="h-3 w-3" /> 痛度
                </span>
                <span className="font-medium">{item.painLevel}/10</span>
              </div>
              <Progress value={item.painLevel * 10} className="h-2" />
            </div>
            
            {/* Commercial Score */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-3 w-3" /> 商业价值
                </span>
                <span className="font-medium">{item.commercialScore}/10</span>
              </div>
              <Progress value={item.commercialScore * 10} className="h-2 [&>div]:bg-green-500" />
            </div>
          </div>
          
          {/* Source */}
          {item.platformName && (
            <div className="text-xs text-muted-foreground">
              来源: {item.platformName}
            </div>
          )}
          
          {/* Keywords */}
          {item.keywords && (
            <div className="flex flex-wrap gap-1">
              {item.keywords.split(',').slice(0, 5).map((kw: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {kw.trim()}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {showDetail && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetail(false)}
        >
          <div 
            className="bg-background rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">痛点详情</h2>
              <button 
                onClick={() => setShowDetail(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Title & Category */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {item.category && (
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  )}
                  {item.platformName && (
                    <span className="text-xs text-muted-foreground">
                      来源: {item.platformName}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold leading-tight">
                  {item.title}
                </h3>
              </div>
              
              {/* Original Hot Item */}
              {item.originalTitle && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">原始热点</p>
                  <p className="text-sm">{item.originalTitle}</p>
                  {item.url && (
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline mt-2"
                    >
                      查看原文 <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )}
              
              {/* Scores */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-500/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-orange-500" />
                    <span className="font-medium">痛度评分</span>
                  </div>
                  <div className="text-3xl font-bold text-orange-500">
                    {item.painLevel}/10
                  </div>
                  <Progress value={item.painLevel * 10} className="h-2 mt-2" />
                </div>
                <div className="bg-green-500/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-medium">商业价值</span>
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    {item.commercialScore}/10
                  </div>
                  <Progress value={item.commercialScore * 10} className="h-2 mt-2 [&>div]:bg-green-500" />
                </div>
              </div>
              
              {/* Keywords */}
              {item.keywords && (
                <div>
                  <h4 className="font-medium mb-2">识别关键词</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.keywords.split(',').map((kw: string, i: number) => (
                      <Badge key={i} variant="secondary">
                        {kw.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Analysis */}
              {item.analysis && (
                <div>
                  <h4 className="font-medium mb-2">AI分析</h4>
                  <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap">
                    {item.analysis}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <a 
                  href={item.url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-primary text-primary-foreground rounded-lg py-3 text-center font-medium hover:opacity-90 transition-opacity"
                >
                  查看原文
                </a>
                <button className="flex-1 border border-border rounded-lg py-3 text-center font-medium hover:bg-muted transition-colors">
                  收藏
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
