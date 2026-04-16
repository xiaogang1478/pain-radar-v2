'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { HotItem } from '@/types';
import { Flame, ExternalLink } from 'lucide-react';

interface HotItemCardProps {
  item: HotItem;
}

export function HotItemCard({ item }: HotItemCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title & Link */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-sm leading-snug line-clamp-2">
              {item.title}
            </h3>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-muted-foreground hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          
          {/* Description */}
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          )}
          
          {/* Meta */}
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {item.platformDisplay || item.platformName}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-orange-500">
              <Flame className="h-3 w-3" />
              <span>{item.heatValue}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
