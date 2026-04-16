import { z } from 'zod';

// 注册表单验证
export const registerSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(8, '密码至少8位字符').max(50, '密码最多50位字符'),
  nickname: z.string().min(2, '昵称至少2位字符').max(20, '昵称最多20位字符').optional(),
});

// 登录表单验证
export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码'),
});

// 更新个人信息验证
export const updateProfileSchema = z.object({
  nickname: z.string().min(2, '昵称至少2位字符').max(20, '昵称最多20位字符').optional(),
  avatar: z.string().url('请输入有效的头像URL').optional(),
});

// 关键词验证
export const keywordSchema = z.object({
  keyword: z.string().min(1, '关键词不能为空').max(50, '关键词最多50位字符'),
  notifyEmail: z.boolean().default(true),
});

// 搜索验证
export const searchSchema = z.object({
  q: z.string().optional(),
  platform: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type KeywordInput = z.infer<typeof keywordSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
