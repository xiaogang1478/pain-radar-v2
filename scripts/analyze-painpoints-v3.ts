/**
 * 痛点分析脚本 V3 - 优化版
 * 改进：情绪符号检测、问句结构、搜索意图、商业价值多维度
 */
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL || 'postgresql://petapp:PetApp2024!@pgm-j6c99kn9x816j3k2qo.pg.rds.aliyuncs.com:5432/pain_radar';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ============ 痛度评分配置 ============
const PAIN_KEYWORDS = {
  // 核心痛苦词（高权重）
  CORE_PAIN: {
    keywords: ['痛苦', '崩溃', '绝望', '煎熬', '折磨', '难受', '难熬', '窒息', '崩溃', '崩溃', '活不下去', '受不了', '撑不住', '想死'],
    weight: 3.0,
    baseScore: 8
  },
  // 强烈负面情绪
  STRONG_NEGATIVE: {
    keywords: ['焦虑', '压力', '烦恼', '困扰', '头疼', '担心', '害怕', '恐惧', '后悔', '自责', '生气', '愤怒', '抓狂', '心塞', '委屈', '憋屈', '郁闷', '烦躁', '崩溃边缘'],
    weight: 2.0,
    baseScore: 7
  },
  // 中度负面情绪
  MODERATE_NEGATIVE: {
    keywords: ['无奈', '无语', '心累', '身心俱疲', '疲惫', '无力', '迷茫', '纠结', '犹豫', '社恐', '尴尬', '丢人', '丢脸', '不好意思', '害羞'],
    weight: 1.5,
    baseScore: 6
  },
  // 需求/缺乏类
  NEEDS_LACK: {
    keywords: ['需要', '想要', '希望', '渴望', '缺少', '缺乏', '没有', '急需', '迫切', '必须', '应该', '最好能', '求', '救命', '求助', '求教', '求推荐', '跪求', '急求'],
    weight: 1.2,
    baseScore: 5
  },
  // 问题/困难类
  PROBLEMS: {
    keywords: ['问题', '难题', '困难', '障碍', '瓶颈', '挑战', '弊端', '缺陷', '不足', '漏洞', '风险', '隐患', '坑', '踩坑', '怎么办', '如何解决', '怎么改善', '怎么解决'],
    weight: 1.5,
    baseScore: 6
  },
  // 育儿/教育类
  PARENTING: {
    keywords: ['宝宝', '孩子', '小孩', '儿童', '幼儿园', '小学', '初中', '高中', '早教', '育儿', '喂养', '挑食', '厌食', '便秘', '发烧', '感冒', '咳嗽', '腹泻', '湿疹', '过敏'],
    weight: 1.3,
    baseScore: 6
  },
  // 健康/医疗类
  HEALTH: {
    keywords: ['健康', '疾病', '医院', '医生', '手术', '吃药', '减肥', '美容', '护肤', '护肤', '化妆', '整形', '体检', '养生', '调理', '亚健康', '熬夜', '掉发', '白发', '失眠'],
    weight: 1.4,
    baseScore: 6
  },
  // 职场/工作类
  WORK: {
    keywords: ['加班', '工资', '辞职', '面试', '职场', '同事', '领导', '老板', '升职', '加薪', '裁员', '失业', '转行', '副业', '兼职', '考核', '绩效', 'KPI'],
    weight: 1.3,
    baseScore: 6
  },
  // 情感/家庭类
  RELATIONSHIP: {
    keywords: ['恋爱', '分手', '离婚', '婚姻', '家庭', '亲子', '婆媳', '夫妻', '相亲', '脱单', '表白', '挽回', '复合', '孤独', '单身', '异地恋'],
    weight: 1.2,
    baseScore: 6
  },
  // 低痛度抱怨
  LIGHT_COMPLAINT: {
    keywords: ['慢', '差', '烂', '垃圾', '骗', '坑人', '敷衍', '推诿', '太贵', '不公平', '黑心', '无良', '骗子'],
    weight: 1.0,
    baseScore: 5
  }
};

// ============ 商业价值配置 ============
const COMMERCIAL_KEYWORDS = {
  // 高商业意图（愿意付费）
  HIGH_INTENT: {
    keywords: ['创业', '商机', '赚钱', '致富', '投资', '理财', '收入', '副业', '兼职', '月入', '年入', '变现', '盈利', '创业项目', '生意'],
    weight: 3.0,
    baseScore: 8
  },
  // 中商业意图（学习需求）
  MEDIUM_INTENT: {
    keywords: ['推荐', '测评', '对比', '排行', '攻略', '教程', '方法', '技巧', '课程', '培训', '咨询', '解决方案'],
    weight: 2.0,
    baseScore: 6
  },
  // 低商业意图（仅娱乐）
  LOW_INTENT: {
    keywords: ['娱乐', '八卦', '明星', '网红', '搞笑', '段子', '游戏', '视频', '娱乐'],
    weight: -2.0,
    baseScore: 2
  },
  // 消费决策类
  PURCHASE_INTENT: {
    keywords: ['值得买', '推荐', '避坑', '测评', '对比', '哪个好', '怎么选', '性价比', '平替', '替代', '替代品'],
    weight: 2.5,
    baseScore: 7
  }
};

// ============ 情绪符号配置 ============
const EMOJI_PATTERNS = {
  // 高痛苦emoji
  HIGH_PAIN: { emojis: ['😭', '😰', '💔', '😤', '😫', '🥵', '🤯', '😱', '😩', '😢'], score: 8 },
  // 中痛苦emoji  
  MEDIUM_PAIN: { emojis: ['😅', '😅', '😓', '😔', '😕', '🙁', '😒', '😞'], score: 6 },
  // 疑问emoji
  QUESTION: { emojis: ['❓', '❔', '⁉️', '🤔', '💭'], score: 5 }
};

// ============ 问句结构配置 ============
const QUESTION_PATTERNS: Array<{pattern: RegExp; painBonus: number; commercialBonus: number}> = [
  { pattern: /怎么办|怎么半|如何解决|怎么改善|怎么处理/, painBonus: 4, commercialBonus: 0 },
  { pattern: /为什么|为何/, painBonus: 2, commercialBonus: 0 },
  { pattern: /是不是|该不该|要不要|能不能|会不会/, painBonus: 2, commercialBonus: 0 },
  { pattern: /哪里有|哪里能|谁能|谁有|谁用过/, painBonus: 3, commercialBonus: 0 },
  { pattern: /有没有人|有人知道吗|求助|求教|求推荐|问一下|咨询/, painBonus: 4, commercialBonus: 1 },
  { pattern: /多少钱|怎么收费|价格|报价/, painBonus: 1, commercialBonus: 4 },
  { pattern: /推荐|求推荐|需要建议|有什么.*推荐|哪个.*好|什么.*好/, painBonus: 1, commercialBonus: 3 },
  { pattern: /么.*办|么.*做|么.*选|么.*选/, painBonus: 3, commercialBonus: 0 },
  { pattern: /真的.*吗|真的.*么|不会是/, painBonus: 2, commercialBonus: 0 },
  { pattern: /求解|求救|救命/, painBonus: 5, commercialBonus: 0 }
];

// ============ 平台分类映射 ============
const CATEGORY_RULES = [
  { keywords: ['健康', '医疗', '身体', '疾病', '减肥', '美容', '护肤', '养生', '体检', '调理', '熬夜', '失眠', '掉发'], category: '健康医疗' },
  { keywords: ['价格', '贵', '便宜', '省钱', '性价比', '优惠', '折扣', '划算', '省钱'], category: '价格消费' },
  { keywords: ['服务', '售后', '客服', '态度', '投诉', '维权'], category: '服务售后' },
  { keywords: ['创业', '赚钱', '副业', '兼职', '投资', '理财', '收入', '生意', '盈利'], category: '创业赚钱' },
  { keywords: ['教育', '学习', '培训', '课程', '考试', '升学', '就业', '面试', '职场', '升职', '加薪'], category: '教育就业' },
  { keywords: ['安全', '隐私', '泄露', '欺诈', '骗局', '风险', '黑心', '无良'], category: '安全生活' },
  { keywords: ['效率', '工具', '软件', 'App', '网站', '慢', '卡顿', '崩溃', 'bug'], category: '效率体验' },
  { keywords: ['质量', '品质', '真假', '劣质', '假货', '山寨'], category: '质量品质' },
  { keywords: ['情感', '恋爱', '分手', '婚姻', '家庭', '亲子', '婆媳', '夫妻', '相亲', '脱单'], category: '情绪心理' },
  { keywords: ['金融', '贷款', '信用卡', '借款', '理财', '牛市', '基金', '股票'], category: '金融投资' },
  { keywords: ['宝宝', '孩子', '小孩', '儿童', '幼儿园', '育儿', '喂养', '挑食', '厌食', '早教'], category: '育儿亲子' },
  { keywords: ['美食', '吃饭', '餐厅', '外卖', '食谱', '烹饪', '厨房'], category: '美食生活' },
  { keywords: ['宠物', '猫', '狗', '养宠', '猫粮', '狗粮', '宠物医院'], category: '宠物生活' },
  { keywords: ['旅游', '出行', '酒店', '机票', '旅行', '景点', '打卡'], category: '旅游出行' }
];

// ============ 评分函数 ============

/**
 * 检测情绪符号
 */
function detectEmoji(text: string): { painEmoji: number; commercialEmoji: number } {
  let painEmoji = 0;
  
  for (const [type, config] of Object.entries(EMOJI_PATTERNS)) {
    for (const emoji of config.emojis) {
      if (text.includes(emoji)) {
        painEmoji = Math.max(painEmoji, config.score);
      }
    }
  }
  
  return { painEmoji, commercialEmoji: 0 };
}

/**
 * 检测问句结构
 */
function detectQuestions(text: string): { painBonus: number; commercialBonus: number } {
  let painBonus = 0;
  let commercialBonus = 0;
  
  for (const rule of QUESTION_PATTERNS) {
    if (rule.pattern.test(text)) {
      if ('painBonus' in rule) painBonus += rule.painBonus;
      if ('commercialBonus' in rule) commercialBonus += rule.commercialBonus;
    }
  }
  
  return { painBonus, commercialBonus };
}

/**
 * 计算痛度评分（1-10）
 */
function calculatePainLevel(title: string, description: string): number {
  const text = (title + ' ' + (description || '')).toLowerCase();
  
  // 1. 情绪符号检测
  const { painEmoji } = detectEmoji(text);
  
  // 2. 问句结构检测
  const { painBonus } = detectQuestions(text);
  
  // 3. 关键词匹配
  let keywordScore = 5;
  let matchedCategory = '';
  let maxWeight = 0;
  
  for (const [category, config] of Object.entries(PAIN_KEYWORDS)) {
    let matchCount = 0;
    for (const keyword of config.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    }
    if (matchCount > 0) {
      const weightedScore = config.baseScore + (matchCount * config.weight);
      if (weightedScore > keywordScore) {
        keywordScore = Math.min(10, weightedScore);
      }
    }
  }
  
  // 4. 综合计算
  let finalScore = keywordScore;
  
  // 情绪emoji加成
  if (painEmoji > 0) {
    finalScore = Math.max(finalScore, painEmoji);
  }
  
  // 问句加成
  finalScore = Math.min(10, finalScore + painBonus);
  
  // 限制范围
  return Math.max(1, Math.min(10, Math.round(finalScore * 10) / 10));
}

/**
 * 计算商业价值评分（1-10）
 */
function calculateCommercialScore(title: string, description: string): number {
  const text = (title + ' ' + (description || '')).toLowerCase();
  
  let score = 5; // 默认5分
  
  // 1. 高意图关键词
  const highIntent = COMMERCIAL_KEYWORDS.HIGH_INTENT;
  const highMatches = highIntent.keywords.filter(k => text.includes(k.toLowerCase())).length;
  score += highMatches * highIntent.weight;
  
  // 2. 中意图关键词
  const mediumIntent = COMMERCIAL_KEYWORDS.MEDIUM_INTENT;
  const mediumMatches = mediumIntent.keywords.filter(k => text.includes(k.toLowerCase())).length;
  score += mediumMatches * mediumIntent.weight;
  
  // 3. 购买意图关键词
  const purchaseIntent = COMMERCIAL_KEYWORDS.PURCHASE_INTENT;
  const purchaseMatches = purchaseIntent.keywords.filter(k => text.includes(k.toLowerCase())).length;
  score += purchaseMatches * purchaseIntent.weight;
  
  // 4. 低意图关键词（减分）
  const lowIntent = COMMERCIAL_KEYWORDS.LOW_INTENT;
  const lowMatches = lowIntent.keywords.filter(k => text.includes(k.toLowerCase())).length;
  score -= lowMatches * Math.abs(lowIntent.weight);
  
  // 5. 问句加成
  const { commercialBonus } = detectQuestions(text);
  score += commercialBonus;
  
  return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
}

/**
 * 判断是否为痛点内容
 */
function isPainPoint(title: string, description: string): { isPain: boolean; keywords: string[]; reason: string } {
  const text = (title + ' ' + (description || '')).toLowerCase();
  const keywords: string[] = [];
  let reasons: string[] = [];
  
  // 1. 高痛苦emoji
  const { painEmoji } = detectEmoji(text);
  if (painEmoji >= 6) {
    reasons.push('高痛苦emoji');
  }
  
  // 2. 问句结构检测（更宽松：任何问号）
  const hasQuestionMark = text.includes('？') || text.includes('?');
  const { painBonus, commercialBonus } = detectQuestions(text);
  
  if (painEmoji >= 6) {
    reasons.push('高痛苦emoji');
  }
  if (painBonus >= 2) {
    reasons.push('高权重问句');
  } else if (hasQuestionMark) {
    reasons.push('问句');
  }
  
  // 3. 关键词匹配
  for (const [category, config] of Object.entries(PAIN_KEYWORDS)) {
    for (const keyword of config.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        keywords.push(keyword);
      }
    }
  }
  
  // 判断逻辑（更宽松）：
  // - 有高痛苦emoji → 是
  // - 有高权重问句(painBonus>=2) → 是
  // - 有问号 + 任何关键词 → 是
  // - 有育儿/健康/职场/情感关键词 → 是
  const hasHighEmoji = painEmoji >= 6;
  const hasHighWeightQuestion = painBonus >= 2;
  const hasQuestionWithKeywords = hasQuestionMark && keywords.length >= 1;
  const hasCategoryKeywords = (PAIN_KEYWORDS.PARENTING?.keywords.some(k => text.includes(k.toLowerCase())) ||
                              PAIN_KEYWORDS.HEALTH?.keywords.some(k => text.includes(k.toLowerCase())) ||
                              PAIN_KEYWORDS.WORK?.keywords.some(k => text.includes(k.toLowerCase())) ||
                              PAIN_KEYWORDS.RELATIONSHIP?.keywords.some(k => text.includes(k.toLowerCase()))) && keywords.length >= 1;
  const hasBasicKeywords = keywords.length >= 2;
  
  const isPain = hasHighEmoji || hasHighWeightQuestion || hasQuestionWithKeywords || hasCategoryKeywords || hasBasicKeywords;
  
  if (reasons.length === 0 && keywords.length > 0) {
    reasons.push('匹配到' + keywords.length + '个关键词');
  }
  
  return {
    isPain,
    keywords: [...new Set(keywords)],
    reason: reasons.length > 0 ? reasons.join(', ') : '无明显痛点信号'
  };
}

/**
 * 分类判断
 */
function categorize(title: string, description: string): string {
  const text = (title + ' ' + (description || '')).toLowerCase();
  
  for (const rule of CATEGORY_RULES) {
    for (const keyword of rule.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        return rule.category;
      }
    }
  }
  
  return '综合其他';
}

/**
 * 生成分析文本
 */
function generateAnalysis(title: string, description: string, keywords: string[], painLevel: number, commercialScore: number, reason: string): string {
  const category = categorize(title, description);
  const opportunityScore = painLevel * commercialScore;
  
  let analysis = `【痛点分析】\n`;
  analysis += `• 识别依据: ${reason}\n`;
  analysis += `• 识别关键词: ${keywords.length > 0 ? keywords.join(', ') : '无特定关键词'}\n`;
  analysis += `• 内容分类: ${category}\n`;
  analysis += `• 痛度评分: ${painLevel}/10\n`;
  analysis += `• 商业价值: ${commercialScore}/10\n`;
  analysis += `• 机会指数: ${opportunityScore}/100\n`;
  
  if (opportunityScore >= 80) {
    analysis += `• ⭐⭐⭐ 极高优先级 — 强烈建议立即调研\n`;
  } else if (opportunityScore >= 60) {
    analysis += `• ⭐⭐ 高优先级 — 值得深入分析\n`;
  } else if (opportunityScore >= 40) {
    analysis += `• ⭐ 中优先级 — 可以考虑\n`;
  } else {
    analysis += `• 低优先级 — 机会较小\n`;
  }
  
  return analysis;
}

// ============ 主函数 ============
async function main() {
  console.log('🚀 痛点分析V3开始\n');
  
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
      take: 500,
      orderBy: {
        heatValue: 'desc'
      }
    });
    
    console.log(`📊 待分析热点: ${hotItems.length} 条\n`);
    
    let analyzedCount = 0;
    let painPointCount = 0;
    
    for (const item of hotItems) {
      const { isPain, keywords, reason } = isPainPoint(item.title, item.description || '');
      
      if (!isPain) {
        console.log(`  跳过: ${item.title.slice(0, 40)}... (${reason})`);
        analyzedCount++;
        continue;
      }
      
      const painLevel = calculatePainLevel(item.title, item.description || '');
      const commercialScore = calculateCommercialScore(item.title, item.description || '');
      const category = categorize(item.title, item.description || '');
      const analysis = generateAnalysis(item.title, item.description || '', keywords, painLevel, commercialScore, reason);
      
      try {
        await prisma.painPoint.create({
          data: {
            hotItemId: item.id,
            title: item.title.slice(0, 200),
            painLevel,
            commercialScore,
            category,
            keywords: keywords.join(','),
            analysis
          }
        });
        
        painPointCount++;
        analyzedCount++;
        
        if (painPointCount % 20 === 0) {
          console.log(`  ✓ 已分析 ${analyzedCount} 条，生成 ${painPointCount} 个痛点`);
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
