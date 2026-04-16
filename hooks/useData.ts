'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Stats, Platform, HotItem, PainPoint } from '@/types';

// 获取统计数据
export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data } = await api.get('/stats');
      if (data.success) {
        return data.data as Stats;
      }
      throw new Error(data.error);
    },
    refetchInterval: 5 * 60 * 1000, // 5分钟刷新
  });
}

// 获取平台列表
export function usePlatforms() {
  return useQuery({
    queryKey: ['platforms'],
    queryFn: async () => {
      const { data } = await api.get('/platforms');
      if (data.success) {
        return data.data as Platform[];
      }
      throw new Error(data.error);
    },
    staleTime: 10 * 60 * 1000, // 10分钟
  });
}

// 获取热点列表
export function useHotItems(params: {
  platform?: string;
  page?: number;
  pageSize?: number;
  q?: string;
}) {
  const { platform, page = 1, pageSize = 50, q } = params;
  
  return useQuery({
    queryKey: ['hotItems', platform, page, pageSize, q],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (platform) searchParams.set('platform', platform);
      if (page) searchParams.set('page', page.toString());
      if (pageSize) searchParams.set('pageSize', pageSize.toString());
      if (q) searchParams.set('q', q);
      
      const { data } = await api.get(`/hot-items?${searchParams.toString()}`);
      if (data.success) {
        return data.data;
      }
      throw new Error(data.error);
    },
  });
}

// 获取痛点列表
export function usePainPoints(params: {
  category?: string;
  minScore?: number;
  page?: number;
  pageSize?: number;
}) {
  const { category, minScore = 0, page = 1, pageSize = 20 } = params;
  
  return useQuery({
    queryKey: ['painPoints', category, minScore, page, pageSize],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (category) searchParams.set('category', category);
      if (minScore) searchParams.set('minScore', minScore.toString());
      if (page) searchParams.set('page', page.toString());
      if (pageSize) searchParams.set('pageSize', pageSize.toString());
      
      const { data } = await api.get(`/pain-points?${searchParams.toString()}`);
      if (data.success) {
        return data.data;
      }
      throw new Error(data.error);
    },
  });
}

// 获取关键词列表
export function useKeywords() {
  return useQuery({
    queryKey: ['keywords'],
    queryFn: async () => {
      const { data } = await api.get('/keywords');
      if (data.success) {
        return data.data;
      }
      throw new Error(data.error);
    },
  });
}

// 获取收藏列表
export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data } = await api.get('/user/favorites');
      if (data.success) {
        return data.data;
      }
      throw new Error(data.error);
    },
  });
}
