'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Zap, TrendingUp, ExternalLink, X, Lightbulb, Target, DollarSign } from 'lucide-react';

interface PainPoint {
  id: number;
  title: string;
  painLevel: number;
  commercialScore: number;
  category: string;
  keywords: string;
  analysis: string;
  platformName: string;
  originalTitle: string;
  url: string;
}

const DEFAULT_CATEGORIES = [
  { id: '', name: '全部' },
  { id: '综合其他', name: '综合其他' },
  { id: '问题困扰', name: '问题困扰' },
  { id: '健康医疗', name: '健康医疗' },
  { id: '价格消费', name: '价格消费' },
  { id: '服务售后', name: '服务售后' },
  { id: '创业赚钱', name: '创业赚钱' },
  { id: '金融投资', name: '金融投资' },
  { id: '科技互联网', name: '科技互联网' },
  { id: '情绪心理', name: '情绪心理' },
  { id: '教育就业', name: '教育就业' },
  { id: '安全生活', name: '安全生活' },
  { id: '效率体验', name: '效率体验' },
  { id: '质量品质', name: '质量品质' },
];

export default function PainPointsPage() {
  const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minScore, setMinScore] = useState(5);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPain, setSelectedPain] = useState<PainPoint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPainPoints();
  }, [selectedCategory, minScore, page, searchQuery]);

  const fetchPainPoints = () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: '24',
    });
    if (selectedCategory) params.set('category', selectedCategory);
    if (minScore) params.set('minScore', minScore.toString());
    
    fetch(`/api/pain-points?${params}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setPainPoints(data.data?.items || []);
          setTotalPages(data.data?.totalPages || 1);
          // 动态更新分类列表
          if (data.data?.items?.length > 0) {
            const cats = data.data.items.map((p: PainPoint) => p.category).filter(Boolean) as string[];
            const uniqueCats = [...new Set(cats)];
            const catMap: Record<string, string> = {};
            uniqueCats.forEach(c => { catMap[c] = c; });
            const dynamicCats = [{ id: '', name: '全部' }];
            Object.keys(catMap).sort().forEach(c => {
              dynamicCats.push({ id: c, name: c });
            });
            setCategories(dynamicCats);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'var(--accent-red)';
    if (score >= 6) return 'var(--brand-gold)';
    return 'var(--accent-green)';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      padding: '40px 24px'
    }}>
      <div style={{maxWidth: '1280px', margin: '0 auto'}}>
        {/* Header */}
        <div style={{marginBottom: '40px'}}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '8px',
            color: 'var(--text-primary)'
          }}>
            💎 痛点发现
          </h1>
          <p style={{color: 'var(--text-secondary)', margin: 0}}>
            从热点内容中挖掘用户真实痛点，发现创业机会
          </p>
        </div>

        {/* Pain Point Dimensions Explanation */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            marginBottom: '16px',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Lightbulb size={20} style={{color: 'var(--brand-gold)'}} />
            痛点评分维度说明
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <Zap size={18} style={{color: 'var(--accent-red)'}} />
                <span style={{fontWeight: 600, color: 'var(--text-primary)'}}>痛度评分</span>
              </div>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.6
              }}>
                衡量用户痛苦程度。10分=极度痛苦（如：服务差、效率低、质量差）；1分=轻微不便
              </p>
            </div>
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <TrendingUp size={18} style={{color: 'var(--accent-green)'}} />
                <span style={{fontWeight: 600, color: 'var(--text-primary)'}}>商业价值</span>
              </div>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.6
              }}>
                变现潜力。10分=可做高价课程/VIP服务；1分=仅适合免费内容引流
              </p>
            </div>
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <Target size={18} style={{color: 'var(--brand-gold)'}} />
                <span style={{fontWeight: 600, color: 'var(--text-primary)'}}>识别关键词</span>
              </div>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.6
              }}>
                高频痛苦词：「痛苦」「需要」「缺乏」「没有」「过期」「服务差」「慢」「贵」
              </p>
            </div>
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <DollarSign size={18} style={{color: 'var(--accent-blue)'}} />
                <span style={{fontWeight: 600, color: 'var(--text-primary)'}}>创业机会</span>
              </div>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.6
              }}>
                痛度×商业价值 &gt; 60分的痛点是高优先级创业机会
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
          <div style={{position: 'relative', flex: '1', minWidth: '250px', maxWidth: '400px'}}>
            <input
              type="text"
              placeholder="搜索痛点内容..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              style={{
                width: '100%',
                padding: '12px 16px 12px 44px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <span style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '18px',
              pointerEvents: 'none'
            }}>
              🔍
            </span>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {/* Category Filter */}
          <div>
            <span style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '12px',
              display: 'block'
            }}>
              分类筛选：
            </span>
            <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: selectedCategory === cat.id ? 'var(--brand-gold)' : 'var(--border-default)',
                    background: selectedCategory === cat.id ? 'var(--brand-gold)' : 'transparent',
                    color: selectedCategory === cat.id ? '#000' : 'var(--text-secondary)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: selectedCategory === cat.id ? 600 : 400,
                    transition: 'all 0.2s'
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Score Filter */}
          <div>
            <span style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '12px',
              display: 'block'
            }}>
              最低评分：
            </span>
            <div style={{display: 'flex', gap: '8px'}}>
              {[5, 6, 7, 8].map((score) => (
                <button
                  key={score}
                  onClick={() => { setMinScore(score); setPage(1); }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: minScore === score ? 'var(--accent-red)' : 'var(--border-default)',
                    background: minScore === score ? 'var(--accent-red)' : 'transparent',
                    color: minScore === score ? '#fff' : 'var(--text-secondary)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: minScore === score ? 600 : 400,
                    transition: 'all 0.2s'
                  }}
                >
                  {score}+ 分
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '20px'
          }}>
            {[...Array(12)].map((_, i) => (
              <div key={i} style={{
                height: '200px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-card)',
                animation: 'pulse 2s infinite'
              }} />
            ))}
          </div>
        ) : painPoints.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            color: 'var(--text-muted)'
          }}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>🔍</div>
            <p style={{fontSize: '1.1rem'}}>没有找到匹配的痛点</p>
            <button
              onClick={() => { setSelectedCategory(''); setMinScore(5); setPage(1); }}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                background: 'transparent',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              清除筛选
            </button>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '20px',
              marginBottom: '40px'
            }}>
              {painPoints.map((item, index) => (
                <Card
                  key={item.id}
                  onClick={() => setSelectedPain(item)}
                  style={{
                    cursor: 'pointer',
                    borderLeft: '4px solid var(--accent-red)',
                    animation: `fadeIn 0.4s ease ${index * 0.03}s forwards`,
                    opacity: 0,
                    animationFillMode: 'forwards'
                  }}
                >
                  <CardContent style={{padding: '20px'}}>
                    <div style={{marginBottom: '16px'}}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '8px',
                        marginBottom: '8px'
                      }}>
                        <h3 style={{
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          margin: 0
                        }}>
                          {item.title}
                        </h3>
                      </div>
                      {item.category && (
                        <Badge variant="outline" style={{fontSize: '11px'}}>
                          {item.category}
                        </Badge>
                      )}
                    </div>

                    {/* Scores */}
                    <div style={{display: 'flex', gap: '16px', marginBottom: '16px'}}>
                      <div style={{flex: 1}}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '12px',
                          marginBottom: '4px'
                        }}>
                          <span style={{display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-red)'}}>
                            <Zap size={12} /> 痛度
                          </span>
                          <span style={{fontWeight: 600, color: getScoreColor(item.painLevel)}}>
                            {item.painLevel}/10
                          </span>
                        </div>
                        <Progress value={item.painLevel * 10} style={{height: '6px'}} />
                      </div>
                      <div style={{flex: 1}}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '12px',
                          marginBottom: '4px'
                        }}>
                          <span style={{display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-green)'}}>
                            <TrendingUp size={12} /> 商业
                          </span>
                          <span style={{fontWeight: 600, color: getScoreColor(item.commercialScore)}}>
                            {item.commercialScore}/10
                          </span>
                        </div>
                        <Progress value={item.commercialScore * 10} style={{height: '6px', '--progress-color': 'var(--accent-green)'} as any} />
                      </div>
                    </div>

                    {/* Keywords */}
                    {item.keywords && (
                      <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
                        {item.keywords.split(',').slice(0, 4).map((kw: string, i: number) => (
                          <span key={i} style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-muted)'
                          }}>
                            {kw.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px'
              }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    background: 'transparent',
                    color: page === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                    opacity: page === 1 ? 0.5 : 1
                  }}
                >
                  ← 上一页
                </button>
                <span style={{color: 'var(--text-secondary)', fontSize: '14px'}}>
                  第 {page} / {totalPages} 页
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    background: 'transparent',
                    color: page === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                    cursor: page === totalPages ? 'not-allowed' : 'pointer',
                    opacity: page === totalPages ? 0.5 : 1
                  }}
                >
                  下一页 →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Pain Point Detail Modal */}
      {selectedPain && (
        <div 
          onClick={() => setSelectedPain(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-secondary)',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '85vh',
              overflow: 'auto',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {/* Header */}
            <div style={{
              position: 'sticky',
              top: 0,
              background: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-subtle)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0
              }}>
                💎 痛点详情
              </h2>
              <button 
                onClick={() => setSelectedPain(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: '4px 8px',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>
            
            {/* Content */}
            <div style={{padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px'}}>
              {/* Title & Meta */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  {selectedPain.category && (
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      background: 'var(--brand-gold)',
                      color: '#000',
                      fontWeight: 600
                    }}>
                      {selectedPain.category}
                    </span>
                  )}
                  {selectedPain.platformName && (
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)'
                    }}>
                      来源: {selectedPain.platformName}
                    </span>
                  )}
                </div>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  {selectedPain.title}
                </h3>
              </div>
              
              {/* Original Hot Item */}
              {selectedPain.originalTitle && (
                <div style={{
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px'
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    marginBottom: '8px',
                    fontWeight: 600
                  }}>
                    📰 原始热点
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    margin: 0,
                    lineHeight: 1.6
                  }}>
                    {selectedPain.originalTitle}
                  </p>
                  {selectedPain.url && (
                    <a 
                      href={selectedPain.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        color: 'var(--accent-blue)',
                        marginTop: '8px',
                        textDecoration: 'none'
                      }}
                    >
                      查看原文 <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              )}
              
              {/* Scores */}
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <Zap size={18} style={{color: 'var(--accent-red)'}} />
                    <span style={{fontWeight: 600, color: 'var(--text-primary)'}}>痛度评分</span>
                  </div>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    color: getScoreColor(selectedPain.painLevel),
                    lineHeight: 1
                  }}>
                    {selectedPain.painLevel}
                    <span style={{fontSize: '1rem', fontWeight: 400}}>/10</span>
                  </div>
                  <Progress value={selectedPain.painLevel * 10} style={{height: '8px', marginTop: '12px'}} />
                </div>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <TrendingUp size={18} style={{color: 'var(--accent-green)'}} />
                    <span style={{fontWeight: 600, color: 'var(--text-primary)'}}>商业价值</span>
                  </div>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    color: getScoreColor(selectedPain.commercialScore),
                    lineHeight: 1
                  }}>
                    {selectedPain.commercialScore}
                    <span style={{fontSize: '1rem', fontWeight: 400}}>/10</span>
                  </div>
                  <Progress value={selectedPain.commercialScore * 10} style={{height: '8px', marginTop: '12px', '--progress-color': 'var(--accent-green)'} as any} />
                </div>
              </div>

              {/* Opportunity Score */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.2) 0%, rgba(212, 165, 116, 0.05) 100%)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                textAlign: 'center',
                border: '1px solid var(--brand-gold)'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  marginBottom: '8px',
                  fontWeight: 600
                }}>
                  🎯 创业机会指数
                </p>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 800,
                  color: 'var(--brand-gold)',
                  lineHeight: 1
                }}>
                  {selectedPain.painLevel * selectedPain.commercialScore}
                  <span style={{fontSize: '1rem', fontWeight: 400, color: 'var(--text-muted)'}}>
                    {' '}/100
                  </span>
                </div>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  marginTop: '8px'
                }}>
                  {selectedPain.painLevel * selectedPain.commercialScore >= 80 
                    ? '⭐⭐⭐ 极高优先级 — 强烈建议立即调研' 
                    : selectedPain.painLevel * selectedPain.commercialScore >= 60 
                    ? '⭐⭐ 高优先级 — 值得深入分析'
                    : selectedPain.painLevel * selectedPain.commercialScore >= 40 
                    ? '⭐ 中优先级 — 可以考虑'
                    : '低优先级 — 机会较小'}
                </p>
              </div>
              
              {/* Keywords */}
              {selectedPain.keywords && (
                <div>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '12px'
                  }}>
                    🏷️ 识别关键词
                  </h4>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                    {selectedPain.keywords.split(',').map((kw: string, i: number) => (
                      <span key={i} style={{
                        fontSize: '13px',
                        padding: '4px 12px',
                        borderRadius: '16px',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-secondary)'
                      }}>
                        {kw.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* AI Analysis */}
              {selectedPain.analysis && (
                <div>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '12px'
                  }}>
                    📊 AI分析
                  </h4>
                  <div style={{
                    background: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    fontSize: '14px',
                    lineHeight: 1.8,
                    color: 'var(--text-secondary)',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {selectedPain.analysis}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div style={{display: 'flex', gap: '12px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)'}}>
                {selectedPain.url && (
                  <a 
                    href={selectedPain.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--brand-gold)',
                      color: '#000',
                      textAlign: 'center',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    查看原文
                  </a>
                )}
                <button style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  收藏痛点
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
