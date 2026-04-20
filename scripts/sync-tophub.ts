/**
 * 榜眼数据同步脚本
 * 从 tophubdata.com API 获取热点数据并存储到数据库
 */
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL || 'postgresql://petapp:PetApp2024!@pgm-j6c99kn9x816j3k2qo.pg.rds.aliyuncs.com:5432/pain_radar';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const API_BASE = 'https://api.tophubdata.com';
const API_KEY = process.env.TOPHUB_API_KEY || 'd7868442656a1f0ca75c9bd035c02f6f';

// 获取平台列表
async function fetchNodes(page: number = 1): Promise<any[]> {
  const response = await fetch(`${API_BASE}/nodes?p=${page}`, {
    headers: { 'Authorization': API_KEY }
  });
  const data = await response.json();
  return data.data || [];
}

// 获取单个平台的热点数据
async function fetchNodeData(hashid: string): Promise<any> {
  const response = await fetch(`${API_BASE}/nodes/${hashid}`, {
    headers: { 'Authorization': API_KEY }
  });
  const data = await response.json();
  return data.data;
}

// 同步平台列表
async function syncNodes() {
  console.log('📡 开始同步平台列表...');
  
  let page = 1;
  let hasMore = true;
  let totalPlatforms = 0;
  
  while (hasMore) {
    const nodes = await fetchNodes(page);
    
    if (nodes.length === 0) {
      hasMore = false;
      break;
    }
    
    for (const node of nodes) {
      try {
        await prisma.platform.upsert({
          where: { hashid: node.hashid },
          update: {
            name: node.name,
            display: node.display,
            icon: node.logo || null,
            url: node.domain || null,
          },
          create: {
            hashid: node.hashid,
            name: node.name,
            display: node.display,
            icon: node.logo || null,
            url: node.domain || null,
          },
        });
        totalPlatforms++;
      } catch (error) {
        console.error(`❌ 同步平台失败: ${node.name}`, error);
      }
    }
    
    console.log(`  第${page}页完成，获取${nodes.length}个平台`);
    
    if (nodes.length < 100) {
      hasMore = false;
    } else {
      page++;
    }
    
    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`✅ 平台同步完成，共 ${totalPlatforms} 个平台`);
  return totalPlatforms;
}

// 同步热点数据
async function syncHotItems() {
  console.log('📡 开始同步热点数据...');
  
  // 获取所有平台
  const platforms = await prisma.platform.findMany();
  let totalItems = 0;
  
  for (const platform of platforms) {
    try {
      const data = await fetchNodeData(platform.hashid);
      
      if (!data || !data.items) continue;
      
      // 获取平台记录
      const dbPlatform = await prisma.platform.findUnique({
        where: { hashid: platform.hashid }
      });
      
      if (!dbPlatform) continue;
      
      for (const item of data.items) {
        try {
          // 解析热度值
          const heatValue = parseHeatValue(item.extra);
          
          await prisma.hotItem.create({
            data: {
              platformId: dbPlatform.id,
              title: item.title || '',
              description: item.description || '',
              url: item.url || '',
              thumbnail: item.thumbnail || '',
              extra: item.extra || '',
              heatValue: heatValue,
            },
          });
          totalItems++;
        } catch (error) {
          // 忽略重复数据
        }
      }
      
      console.log(`  ✅ ${platform.name}: ${data.items.length} 条数据`);
      
      // 避免请求过快
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`  ❌ ${platform.name} 同步失败:`, error);
    }
  }
  
  console.log(`✅ 热点数据同步完成，共 ${totalItems} 条数据`);
  return totalItems;
}

// 解析热度值
function parseHeatValue(extra: string): number {
  if (!extra) return 0;
  
  // 尝试匹配各种格式
  const patterns = [
    /(\d+(?:\.\d+)?)\s*[万wW]/i,  // 455万, 200w
    /(\d+(?:\.\d+)?)\s*热度/i,
    /(\d+)/,
  ];
  
  for (const pattern of patterns) {
    const match = extra.match(pattern);
    if (match) {
      let value = parseFloat(match[1]);
      if (extra.match(/[万wW]/)) {
        value *= 10000;
      }
      return Math.round(value);
    }
  }
  
  return 0;
}

// 主函数
async function main() {
  console.log('🚀 榜眼数据同步开始\n');
  
  try {
    // 同步平台
    const platformCount = await syncNodes();
    console.log('');
    
    // 同步热点数据
    const itemCount = await syncHotItems();
    console.log('');
    
    // 输出统计
    const stats = await prisma.$transaction([
      prisma.platform.count(),
      prisma.hotItem.count(),
    ]);
    
    console.log('📊 最终统计:');
    console.log(`   平台总数: ${stats[0]}`);
    console.log(`   热点总数: ${stats[1]}`);
    console.log('\n✅ 同步完成!');
  } catch (error) {
    console.error('❌ 同步失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
