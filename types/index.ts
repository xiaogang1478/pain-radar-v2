// 类型定义

// 用户类型
export interface User {
  id: number;
  email: string;
  nickname?: string;
  avatar?: string;
  memberType: 'FREE' | 'PRO' | 'ENTERPRISE';
  memberExpire?: string;
  createdAt: string;
}

// 平台类型
export interface Platform {
  id: number;
  hashid: string;
  name: string;
  display: string;
  icon?: string;
  url?: string;
}

// 热点类型
export interface HotItem {
  id: number;
  platformId: number;
  title: string;
  url?: string;
  description?: string;
  heatValue: number;
  extra?: string;
  platformName?: string;
  platformDisplay?: string;
  createdAt: string;
}

// 痛点类型
export interface PainPoint {
  id: number;
  hotItemId: number;
  title: string;
  painLevel: number;
  commercialScore: number;
  category?: string;
  keywords?: string;
  analysis?: string;
  platformName?: string;
  originalTitle?: string;
  url?: string;
  createdAt: string;
}

// 关键词类型
export interface Keyword {
  id: number;
  userId: number;
  keyword: string;
  notifyEmail: boolean;
  isActive: boolean;
  createdAt: string;
}

// 收藏类型
export interface Favorite {
  id: number;
  userId: number;
  hotItemId?: number;
  painPointId?: number;
  hotItem?: HotItem;
  painPoint?: PainPoint;
  createdAt: string;
}

// 统计数据类型
export interface Stats {
  totalHotItems: number;
  totalPlatforms: number;
  totalPainPoints: number;
  lastUpdated?: string;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页类型
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 会员类型枚举
export type MemberType = 'FREE' | 'PRO' | 'ENTERPRISE';

// 会员权限
export interface MemberPermissions {
  unlimitedHotItems: boolean;
  unlimitedPainPoints: boolean;
  allPlatforms: boolean;
  advancedSearch: boolean;
  maxKeywords: number;
  emailNotification: boolean;
  dataExport: boolean;
  apiAccess: boolean;
}

export const MEMBER_PERMISSIONS: Record<MemberType, MemberPermissions> = {
  FREE: {
    unlimitedHotItems: false,
    unlimitedPainPoints: false,
    allPlatforms: false,
    advancedSearch: false,
    maxKeywords: 0,
    emailNotification: false,
    dataExport: false,
    apiAccess: false,
  },
  PRO: {
    unlimitedHotItems: true,
    unlimitedPainPoints: true,
    allPlatforms: true,
    advancedSearch: true,
    maxKeywords: 10,
    emailNotification: true,
    dataExport: true,
    apiAccess: true,
  },
  ENTERPRISE: {
    unlimitedHotItems: true,
    unlimitedPainPoints: true,
    allPlatforms: true,
    advancedSearch: true,
    maxKeywords: -1, // 无限
    emailNotification: true,
    dataExport: true,
    apiAccess: true,
  },
};
