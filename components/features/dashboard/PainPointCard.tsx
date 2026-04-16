'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PainPoint } from '@/types';
import { Zap, TrendingUp } from 'lucide-react';

interface PainPointCardProps {
  item: PainPoint;
}

export function PainPointCard({ item }: PainPointCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
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
        
        {/* Analysis Preview */}
        {item.analysis && (
          <p className="text-xs text-muted-foreground line-clamp-2 bg-muted/50 p-2 rounded">
            {item.analysis}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
