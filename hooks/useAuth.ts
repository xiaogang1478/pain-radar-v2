'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { User } from '@/types';

// 获取当前用户
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await api.get('/auth/me');
      if (data.success) {
        return data.data as User;
      }
      throw new Error(data.error);
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}

// 注册
export function useRegister() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: { email: string; password: string; nickname?: string }) => {
      const { data } = await api.post('/auth/register', params);
      if (!data.success) {
        throw new Error(data.error);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}

// 登录
export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: { email: string; password: string }) => {
      const { data } = await api.post('/auth/login', params);
      if (!data.success) {
        throw new Error(data.error);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}

// 登出
export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/auth/logout');
      if (!data.success) {
        throw new Error(data.error);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.clear();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
  });
}

// 更新个人信息
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: { nickname?: string; avatar?: string }) => {
      const { data } = await api.put('/user/profile', params);
      if (!data.success) {
        throw new Error(data.error);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}
