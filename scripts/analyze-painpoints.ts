/**
 * 痛点分析脚本
 * 从热点数据中提取痛点并存储到数据库
 */
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL || 'postgresql://petapp:PetApp2024!@pgm-j6c99kn9x816j3k2qo.pg.rds.aliyuncs.com:5432/pain_radar';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 痛点关键词配置
const PAIN_POINT_PATTERNS = {
  // 负面情绪类
  negative_emotion: {
    keywords: ['焦虑', '压力', '烦恼', '痛苦', '困扰', '麻烦', '头疼', '难受', '崩溃', '绝望', '无奈', '担心', '害怕', '恐惧', '后悔', '自责'],
    weight: 1.2
  },
  // 需求类
  needs: {
    keywords: ['需要', '想要', '希望', '渴望', '缺少', '缺乏', '没有', '急需', '迫切', '必须', '应该', '最好能'],
    weight: 1.0
  },
  // 问题类
  problems: {
    keywords: ['问题', '难题', '困难', '障碍', '麻烦', '瓶颈', '挑战', '弊端', '缺陷', '不足', '漏洞', '风险', '隐患'],
    weight: 1.5
  },
  // 价格类
  price: {
    keywords: ['贵', '便宜', '省钱', '划算', '性价比', '太贵', '太便宜', '涨价', '降价', '折扣', '优惠'],
    weight: 0.8
  },
  // 质量类
  quality: {
    keywords: ['质量', '品质', '太差', '太差', '粗制滥造', '劣质', '假货', '冒牌', '过期', '损坏'],
    weight: 1.3
  },
  // 服务类
  service: {
    keywords: ['服务', '态度', '售后', '客服', '不负责', '推诿', '踢皮球', '敷衍'],
    weight: 1.2
  },
  // 健康类
  health: {
    keywords: ['健康', '安全', '卫生', '污染', '有毒', '危害', '致癌', '致病'],
    weight: 1.5
  },
  // 效率类
  efficiency: {
    keywords: ['慢', '耽误', '浪费时间', '效率低', '卡顿', '延迟', '等待', '排队'],
    weight: 1.0
  }
};

// 商业价值评分关键词
const COMMERCIAL_PATTERNS = {
  high_value: ['创业', '商机', '赚钱', '致富', '投资', '理财', '收入', '副业', '兼职', '月入', '年入'],
  medium_value: ['推荐', '测评', '对比', '排行', '攻略', '教程', '方法', '技巧'],
  low_value: ['娱乐', '八卦', '明星', '网红', '搞笑', '段子']
};

// 计算痛度评分
function calculatePainLevel(title: string, description: string): number {
  const text = title + description;
  let score = 5; // 默认5分
  
  // 匹配负面情绪
  for (const [category, config] of Object.entries(PAIN_POINT_PATTERNS)) {
    const count = config.keywords.filter(k => text.includes(k)).length;
    score += count * config.weight * 0.5;
  }
  
  // 限制在1-10分
  return Math.min(10, Math.max(1, Math.round(score)));
}

// 计算商业价值评分
function calculateCommercialScore(title: string, description: string): number {
  const text = title + description;
  let score = 5;
  
  for (const keyword of COMMERCIAL_PATTERNS.high_value) {
    if (text.includes(keyword)) score += 2;
  }
  for (const keyword of COMMERCIAL_PATTERNS.medium_value) {
    if (text.includes(keyword)) score += 1;
  }
  for (const keyword of COMMERCIAL_PATTERNS.low_value) {
    if (text.includes(keyword)) score -= 1;
  }
  
  return Math.min(10, Math.max(1, score));
}

// 判断是否为痛点内容
function isPainPoint(title: string, description: string): { isPain: boolean; keywords: string[] } {
  const text = title + description;
  const matchedKeywords: string[] = [];
  
  for (const [category, config] of Object.entries(PAIN_POINT_PATTERNS)) {
    for (const keyword of config.keywords) {
      if (text.includes(keyword)) {
        matchedKeywords.push(keyword);
      }
    }
  }
  
  return {
    isPain: matchedKeywords.length >= 1,
    keywords: [...new Set(matchedKeywords)]
  };
}

// 确定分类
function categorize(title: string, description: string): string {
  const text = title + description;
  
  if (PAIN_POINT_PATTERNS.health.keywords.some(k => text.includes(k))) return '健康医疗';
  if (PAIN_POINT_PATTERNS.price.keywords.some(k => text.includes(k))) return '价格消费';
  if (PAIN_POINT_PATTERNS.quality.keywords.some(k => text.includes(k))) return '质量品质';
  if (PAIN_POINT_PATTERNS.service.keywords.some(k => text.includes(k))) return '服务售后';
  if (PAIN_POINT_PATTERNS.efficiency.keywords.some(k => text.includes(k))) return '效率体验';
  if (PAIN_POINT_PATTERNS.problems.keywords.some(k => text.includes(k))) return '问题困扰';
  if (PAIN_POINT_PATTERNS.negative_emotion.keywords.some(k => text.includes(k))) return '情绪心理';
  
  return '综合其他';
}

// 生成分析文本
function generateAnalysis(title: string, description: string, keywords: string[], painLevel: number, commercialScore: number): string {
  const category = categorize(title, description);
  
  let analysis = `【痛点分析】\n`;
  analysis += `• 识别关键词: ${keywords.join(', ') || '无特定关键词'}\n`;
  analysis += `• 内容分类: ${category}\n`;
  analysis += `• 痛度评分: ${painLevel}/10\n`;
  analysis += `• 商业价值: ${commercialScore}/10\n`;
  
  if (painLevel >= 7) {
    analysis += `• 机会提示: 高痛度内容，用户强烈需求，适合做深度解决方案\n`;
  }
  if (commercialScore >= 7) {
    analysis += `• 商业提示: 高商业价值，可考虑付费内容或电商变现\n`;
  }
  
  return analysis;
}

// 主函数
async function main() {
  console.log('🚀 痛点分析开始\n');
  
  try {
    // 获取未分析的热点数据
    const hotItems = await prisma.hotItem.findMany({
      where: {
        NOT: {
          painPoints: {
            some: {}
          }
        }
      },
      include: {
        platform: true
      },
      take: 500, // 每次处理500条
      orderBy: {
        heatValue: 'desc' // 从高热度开始
      }
    });
    
    console.log(`📊 待分析热点: ${hotItems.length} 条\n`);
    
    let analyzedCount = 0;
    let painPointCount = 0;
    
    for (const item of hotItems) {
      const { isPain, keywords } = isPainPoint(item.title, item.description);
      
      if (!isPain) continue;
      
      const painLevel = calculatePainLevel(item.title, item.description);
      const commercialScore = calculateCommercialScore(item.title, item.description);
      const category = categorize(item.title, item.description);
      const analysis = generateAnalysis(item.title, item.description, keywords, painLevel, commercialScore);
      
      try {
        await prisma.painPoint.create({
          data: {
            hotItemId: item.id,
            title: item.title.slice(0, 200), // 限制标题长度
            painLevel,
            commercialScore,
            category,
            keywords: keywords.join(','),
            analysis
          }
        });
        
        painPointCount++;
        analyzedCount++;
        
        if (analyzedCount % 50 === 0) {
          console.log(`  已分析 ${analyzedCount} 条热点，生成 ${painPointCount} 个痛点`);
        }
      } catch (error: any) {
        if (error.code === 'P2002') {
          // 重复数据，跳过
        } else {
          console.error(`  ❌ 分析失败: ${item.title.slice(0, 30)}...`);
        }
      }
    }
    
    console.log(`\n✅ 分析完成！`);
    console.log(`   处理热点: ${analyzedCount} 条`);
    console.log(`   生成痛点: ${painPointCount} 个`);
    
    // 输出统计
    const totalPainPoints = await prisma.painPoint.count();
    console.log(`   痛点总数: ${totalPainPoints} 个`);
    
  } catch (error) {
    console.error('❌ 分析失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
