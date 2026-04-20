/**
 * 多平台热点数据获取脚本
 * 支持: 微博, 知乎 (通过公开页面抓取)
 * 架构: 每个平台 = 配置文件 + 抓取函数
 */

import fetch from 'node-fetch';

// 平台配置类型
interface PlatformConfig {
  name: string;           // 显示名称
  fetch: () => Promise<HotItem[]>;  // 抓取函数
}

// 热点条目
interface HotItem {
  title: string;
  rank: number;
  heat: number;
  url: string;
  platform: string;
}

// 微博热搜抓取
async function fetchWeibo(): Promise<HotItem[]> {
  try {
    const response = await fetch('https://weibo.com/ajax/side/hotSearch', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://weibo.com'
      },
      timeout: 10000
    });
    
    const data = await response.json() as any;
    
    if (data.ok === 1 && data.data?.realtime) {
      return data.data.realtime.map((item: any, index: number) => ({
        title: item.word,
        rank: index + 1,
        heat: item.raw_hot,
        url: `https://s.weibo.com/weibo?q=${encodeURIComponent(item.word)}`,
        platform: 'weibo'
      }));
    }
    
    console.log('[微博] 数据格式变化，使用备用方案');
    return [];
  } catch (error) {
    console.log('[微博] 获取失败:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

// 知乎热榜抓取
async function fetchZhihu(): Promise<HotItem[]> {
  try {
    const response = await fetch('https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.zhihu.com'
      },
      timeout: 10000
    });
    
    const data = await response.json() as any;
    
    if (data.data && data.data.length > 0) {
      return data.data.map((item: any, index: number) => ({
        title: item.target.title,
        rank: index + 1,
        heat: parseInt(item.detail_text?.replace(/[^0-9]/g, '') || '0'),
        url: item.target.url?.replace('https://www.zhihu.com', '') || item.target.link?.url || '#',
        platform: 'zhihu'
      }));
    }
    
    console.log('[知乎] 数据格式变化');
    return [];
  } catch (error) {
    console.log('[知乎] 获取失败:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

// 百度热搜（通过榜眼API已有，此处备用）
async function fetchBaidu(): Promise<HotItem[]> {
  // 百度数据由榜眼API提供，这里只是示例备用
  return [];
}

// 抖音热搜（通过榜眼API已有，此处备用）
async function fetchDouyin(): Promise<HotItem[]> {
  return [];
}

// 平台注册表 - 新增平台只需在这里添加
const PLATFORMS: Record<string, PlatformConfig> = {
  weibo: {
    name: '微博热搜',
    fetch: fetchWeibo
  },
  zhihu: {
    name: '知乎热榜',
    fetch: fetchZhihu
  },
  baidu: {
    name: '百度热搜',
    fetch: fetchBaidu  // 备用，实际由榜眼API提供
  },
  douyin: {
    name: '抖音热搜',
    fetch: fetchDouyin  // 备用，实际由榜眼API提供
  }
};

// 主函数：获取所有平台数据
export async function fetchAllPlatforms(): Promise<Record<string, HotItem[]>> {
  const results: Record<string, HotItem[]> = {};
  
  console.log('🔥 开始获取多平台热点数据...');
  
  for (const [key, config] of Object.entries(PLATFORMS)) {
    console.log(`\n[${config.name}] 开始获取...`);
    try {
      const items = await config.fetch();
      if (items.length > 0) {
        results[key] = items;
        console.log(`[${config.name}] 获取成功: ${items.length} 条`);
      } else {
        console.log(`[${config.name}] 无数据`);
      }
    } catch (error) {
      console.log(`[${config.name}] 获取失败`);
    }
  }
  
  console.log('\n✅ 多平台数据获取完成');
  return results;
}

// 获取单个平台
export async function fetchPlatform(platform: string): Promise<HotItem[]> {
  const config = PLATFORMS[platform];
  if (!config) {
    throw new Error(`未知平台: ${platform}`);
  }
  return config.fetch();
}

// 导出类型
export { HotItem, PlatformConfig };
