/**
 * 多平台热点数据获取脚本 v2.0
 * 支持: 微博, 知乎 (通过公开页面抓取)
 */

// 微博热搜抓取
async function fetchWeibo() {
  try {
    const response = await fetch('https://weibo.com/ajax/side/hotSearch', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://weibo.com'
      },
      signal: AbortSignal.timeout(10000)
    });
    
    const data = await response.json();
    
    if (data.ok === 1 && data.data?.realtime) {
      return data.data.realtime.map((item, index) => ({
        title: item.word,
        rank: index + 1,
        heat: item.raw_hot || item.hot || 0,
        url: `https://s.weibo.com/weibo?q=${encodeURIComponent(item.word)}`,
        platform: 'weibo',
        platformDisplay: '微博热搜'
      }));
    }
    
    console.log('[微博] 数据格式变化或无数据');
    return [];
  } catch (error) {
    console.log('[微博] 获取失败:', error.message);
    return [];
  }
}

// 知乎热榜抓取
async function fetchZhihu() {
  try {
    const response = await fetch('https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.zhihu.com'
      },
      signal: AbortSignal.timeout(10000)
    });
    
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      return data.data.map((item, index) => {
        // 解析热度值
        let heat = 0;
        if (item.detail_text) {
          const match = item.detail_text.match(/[\d,]+/);
          if (match) {
            heat = parseInt(match[0].replace(/,/g, ''));
          }
        }
        
        return {
          title: item.target.title,
          rank: index + 1,
          heat: heat,
          url: item.target.url?.replace('https://www.zhihu.com', '') || '#',
          platform: 'zhihu',
          platformDisplay: '知乎热榜'
        };
      });
    }
    
    console.log('[知乎] 数据格式变化或无数据');
    return [];
  } catch (error) {
    console.log('[知乎] 获取失败:', error.message);
    return [];
  }
}

// 平台注册表 - 新增平台只需在这里添加
const PLATFORMS = {
  weibo: {
    name: '微博热搜',
    fetch: fetchWeibo
  },
  zhihu: {
    name: '知乎热榜',
    fetch: fetchZhihu
  }
};

// 获取所有平台数据
async function fetchAllPlatforms() {
  const results = {};
  
  console.log('🔥 开始获取多平台热点数据...');
  
  for (const [key, config] of Object.entries(PLATFORMS)) {
    console.log(`\n[${config.name}] 开始获取...`);
    try {
      const items = await config.fetch();
      if (items.length > 0) {
        results[key] = {
          platform: key,
          platformName: config.name,
          items,
          total: items.length,
          updatedAt: new Date().toISOString()
        };
        console.log(`[${config.name}] 获取成功: ${items.length} 条`);
      } else {
        console.log(`[${config.name}] 无数据`);
      }
    } catch (error) {
      console.log(`[${config.name}] 获取失败:`, error.message);
    }
  }
  
  console.log('\n✅ 多平台数据获取完成');
  return results;
}

// 获取单个平台
async function fetchPlatform(platform) {
  const config = PLATFORMS[platform];
  if (!config) {
    throw new Error(`未知平台: ${platform}`);
  }
  return {
    platform,
    platformName: config.name,
    items: await config.fetch(),
    updatedAt: new Date().toISOString()
  };
}

// 导出
module.exports = { fetchAllPlatforms, fetchPlatform };
