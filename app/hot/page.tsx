'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Platform { hashid: string; display: string; }
interface HotItem {
  id: number;
  title: string;
  platform: string;
  heat: number;
  url: string;
  createdAt: string;
}

export default function HotPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [hotItems, setHotItems] = useState<HotItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch('/api/platforms')
      .then(r => r.json())
      .then(data => {
        if (data.success) setPlatforms(data.data || []);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: '24',
      ...(selectedPlatform && { platform: selectedPlatform }),
      ...(searchQuery && { q: searchQuery })
    });
    
    fetch(`/api/hot-items?${params}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setHotItems(data.data?.items || []);
          setTotalPages(data.data?.totalPages || 1);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedPlatform, searchQuery, page]);

  const getHeatColor = (heat: number) => {
    if (heat >= 90) return 'var(--accent-red)';
    if (heat >= 70) return 'var(--brand-gold)';
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
          <div style={{position: 'relative', maxWidth: '400px'}}>
            <input
              type="text"
              placeholder="搜索热点..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="input"
              style={{paddingLeft: '44px'}}
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

          {/* Platform Filter */}
          <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
            <button
              onClick={() => { setSelectedPlatform(''); setPage(1); }}
              className={selectedPlatform === '' ? 'badge badge-gold' : 'badge'}
              style={{cursor: 'pointer', border: 'none'}}
            >
              全部平台
            </button>
            {platforms.map(platform => (
              <button
                key={platform.hashid}
                onClick={() => { setSelectedPlatform(platform.hashid); setPage(1); }}
                className={selectedPlatform === platform.hashid ? 'badge badge-gold' : 'badge'}
                style={{cursor: 'pointer', border: 'none'}}
              >
                {platform.display}
              </button>
            ))}
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
              <div key={i} className="skeleton" style={{height: '160px'}} />
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
              className="btn-secondary"
              style={{marginTop: '20px', border: 'none', cursor: 'pointer'}}
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
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card"
                  style={{
                    padding: '24px',
                    textDecoration: 'none',
                    display: 'block',
                    animation: `fadeIn 0.4s ease ${index * 0.03}s forwards`
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <span className="badge" style={{fontSize: '12px'}}>
                      {item.platform || '通用'}
                    </span>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: getHeatColor(item.heat)
                    }}>
                      🔥 {item.heat}%
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: '1rem',
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
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)'
                  }}>
                    {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                  </div>
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
                  className="btn-secondary"
                  style={{
                    padding: '10px 20px',
                    border: '1px solid var(--border-default)',
                    background: 'transparent',
                    color: page === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  上一页
                </button>
                <span style={{color: 'var(--text-secondary)', fontSize: '14px'}}>
                  第 {page} / {totalPages} 页
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-secondary"
                  style={{
                    padding: '10px 20px',
                    border: '1px solid var(--border-default)',
                    background: 'transparent',
                    color: page === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                    cursor: page === totalPages ? 'not-allowed' : 'pointer',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
