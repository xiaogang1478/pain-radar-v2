'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Platform { hashid: string; display: string; name: string; }
interface HotItem {
  id: number;
  title: string;
  platformName: string;
  platformDisplay: string;
  heatValue: number;
  url: string;
  createdAt: string;
  extra?: string;
}

// Popular platforms to show by default (most active platforms with hot content)
const POPULAR_PLATFORMS = [
  { hashid: 'mproPpoq6O', display: '知乎热榜', name: '知乎' },
  { hashid: 'Jb0vmloB1G', display: '百度实时热点', name: '百度' },
  { hashid: 'K7GdaMgdQy', display: '抖音热搜', name: '抖音' },
  { hashid: 'b0vmbRXdB1', display: 'B站每周必看', name: '哔哩哔哩' },
  { hashid: '74KvxwokxM', display: 'B站全站日榜', name: '哔哩哔哩' },
  { hashid: '36Kr', display: '36氪', name: '36氪' },
  { hashid: 'gefer', display: '虎嗅', name: '虎嗅' },
  { hashid: 'HqOs', display: 'IT之家', name: 'IT之家' },
  { hashid: 'i4CN', display: 'App Store', name: 'App Store' },
  { hashid: 'weibo', display: '微博热搜', name: '微博' },
  { hashid: 'douyin', display: '抖音', name: '抖音' },
  { hashid: 'xiaohongshu', display: '小红书', name: '小红书' },
  { hashid: 'toutiao', display: '今日头条', name: '今日头条' },
];

export default function HotPage() {
  const [hotItems, setHotItems] = useState<HotItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

  useEffect(() => {
    fetchHotItems();
  }, [selectedPlatform, searchQuery, page]);

  const fetchHotItems = () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: '24',
    });
    
    if (selectedPlatform) {
      params.set('platform', selectedPlatform);
    }
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    
    fetch(`/api/hot-items?${ params }`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setHotItems(data.data?.items || []);
          setTotalPages(data.data?.totalPages || 1);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const getHeatColor = (heat: number) => {
    if (heat >= 10000000) return 'var(--accent-red)';  // 千万级
    if (heat >= 1000000) return 'var(--brand-gold)';   // 百万级
    return 'var(--accent-green)';
  };

  const formatHeat = (heat: number) => {
    if (heat >= 100000000) return (heat / 100000000).toFixed(1) + '亿';
    if (heat >= 10000) return (heat / 10000).toFixed(1) + '万';
    return heat.toString();
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
            🔥 热点监控
          </h1>
          <p style={{color: 'var(--text-secondary)', margin: 0}}>
            实时追踪全网热点，发现创业机会
          </p>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {/* Search */}
          <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
            <div style={{position: 'relative', flex: '1', minWidth: '250px', maxWidth: '400px'}}>
              <input
                type="text"
                placeholder="搜索热点内容..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
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

          {/* Platform Filter - Popular Platforms */}
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
              <span style={{fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)'}}>
                选择平台：
              </span>
              <button
                onClick={() => setShowAllPlatforms(!showAllPlatforms)}
                className="badge"
                style={{cursor: 'pointer', border: 'none', fontSize: '12px'}}
              >
                {showAllPlatforms ? '收起' : '查看全部平台'}
              </button>
            </div>
            
            <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', maxHeight: showAllPlatforms ? 'none' : '60px', overflow: showAllPlatforms ? 'visible' : 'hidden'}}>
              <button
                onClick={() => { setSelectedPlatform(''); setPage(1); }}
                className={selectedPlatform === '' ? 'badge badge-gold' : 'badge'}
                style={{cursor: 'pointer', border: 'none'}}
              >
                全部
              </button>
              {POPULAR_PLATFORMS.map(platform => (
                <button
                  key={platform.hashid}
                  onClick={() => { setSelectedPlatform(platform.hashid); setPage(1); }}
                  className={selectedPlatform === platform.hashid ? 'badge badge-gold' : 'badge'}
                  style={{cursor: 'pointer', border: 'none'}}
                >
                  {platform.display}
                </button>
              ))}
              {showAllPlatforms && (
                <span style={{fontSize: '12px', color: 'var(--text-muted)', alignSelf: 'center'}}>
                  (平台搜索已优化，仅显示热门平台)
                </span>
              )}
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
                height: '160px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-card)',
                animation: 'pulse 2s infinite'
              }} />
            ))}
          </div>
        ) : hotItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            color: 'var(--text-muted)'
          }}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>🔍</div>
            <p style={{fontSize: '1.1rem'}}>没有找到匹配的热点</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedPlatform(''); setPage(1); }}
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
              {hotItems.map((item, index) => (
                <a
                  key={item.id}
                  href={item.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card"
                  style={{
                    padding: '20px',
                    textDecoration: 'none',
                    display: 'block',
                    animation: `fadeIn 0.4s ease ${index * 0.03}s forwards`
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      background: 'var(--bg-secondary)',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}>
                      {item.platformName || item.platformDisplay || '通用'}
                    </span>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: getHeatColor(item.heatValue)
                    }}>
                      🔥 {formatHeat(item.heatValue)}
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '12px',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {item.title}
                  </h3>
                  {item.extra && (
                    <p style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      margin: 0
                    }}>
                      {item.extra}
                    </p>
                  )}
                </a>
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
    </div>
  );
}
