import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLang } from '../../shared/i18n';
import {
  fetchNews,
  selectNewsList,
  selectNewsLoading,
} from '../../features/news';
import { X } from 'lucide-react';
import './News.css';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80';

export default function News() {
  const { t } = useLang();
  // Safe fallback if t.news is a string (like in en.js) or object
  const title = typeof t.news === 'string' ? t.news : (t.news?.title || 'News & Media');
  const readMoreText = typeof t.news === 'object' ? (t.news?.readMore || 'Read More') : 'Read More';
  const allText = typeof t.news === 'object' ? (t.news?.categories?.[0] || 'All') : 'All';
  const branchId = localStorage.getItem("globalBranchId")
  const dispatch = useDispatch();

  const newsList = useSelector(selectNewsList);
  const loading = useSelector(selectNewsLoading);

  const [cat, setCat] = useState('All');
  const [selectedNews, setSelectedNews] = useState(null);

  // Fetch published news on mount
  useEffect(() => {
    dispatch(fetchNews({ branch: branchId, published: true }));
  }, [dispatch]);

  const allPosts = newsList.filter((p) => p.published !== false);

  const filtered = cat === 'All' 
    ? allPosts 
    : allPosts.filter((p) => p.category?.id === cat || p.category_id === cat);

  // Safely extract unique categories (as objects) from the posts array
  const catsMap = new Map();
  allPosts.forEach((p) => {
    if (p.category && p.category.id) {
      catsMap.set(p.category.id, p.category);
    }
  });
  
  const categories = [
    { id: 'All', name: allText },
    ...Array.from(catsMap.values())
  ];

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedNews) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedNews]);

  return (
    <div className="page">
      <div className="news-hero">
        <div className="container">
          <span className="section-label">Latest</span>
          <h1 className="section-title">{title}</h1>
          <div className="divider" />
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Category filter */}
          <div className="news-filters">
            {categories.map((c) => (
              <button key={c.id} onClick={() => setCat(c.id)}
                className={`news-filter-btn ${cat === c.id ? 'active' : ''}`}>
                {c.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted, #94a3b8)' }}>
              <div className="al-spinner" style={{ margin: '0 auto 16px', borderTopColor: 'var(--accent-cyan, #4f46e5)' }} />
              <p>Loading news…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="news-empty">
              <div className="news-empty-icon">📭</div>
              <p>No posts in this category yet.</p>
            </div>
          ) : (
            <>
              {/* Featured first post */}
              <article className="news-featured glass-card">
                <div className="news-featured-img">
                  <img
                    src={filtered[0].image || PLACEHOLDER}
                    alt={filtered[0].title}
                    onError={(e) => { e.target.src = PLACEHOLDER; }}
                  />
                  {filtered[0].category?.name && <span className="news-cat-badge">{filtered[0].category.name}</span>}
                </div>
                <div className="news-featured-body">
                  <time className="news-date">{filtered[0].date}</time>
                  <h2 className="news-featured-title">{filtered[0].title}</h2>
                  <p className="news-featured-desc">{filtered[0].description || filtered[0].desc}</p>
                  <button className="btn btn-primary" onClick={() => setSelectedNews(filtered[0])}>
                    {readMoreText} →
                  </button>
                </div>
              </article>

              {/* Grid of remaining posts */}
              {filtered.length > 1 && (
                <div className="news-grid">
                  {filtered.slice(1).map((post) => (
                    <article key={post.id} className="news-card glass-card">
                      <div className="news-card-img">
                        <img
                          src={post.image || PLACEHOLDER}
                          alt={post.title}
                          onError={(e) => { e.target.src = PLACEHOLDER; }}
                        />
                        {post.category?.name && <span className="news-cat-badge">{post.category.name}</span>}
                      </div>
                      <div className="news-card-body">
                        <time className="news-date">{post.date}</time>
                        <h3 className="news-card-title">{post.title}</h3>
                        <p className="news-card-desc">{post.description || post.desc}</p>
                        <button className="news-read-more" onClick={() => setSelectedNews(post)}>
                          {readMoreText} →
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── News Modal ── */}
      {selectedNews && (
        <div className="news-modal-overlay" onClick={() => setSelectedNews(null)}>
          <div className="news-modal-content glass-card" onClick={e => e.stopPropagation()}>
            <button className="news-modal-close" onClick={() => setSelectedNews(null)}>
              <X size={20} />
            </button>
            <img 
              src={selectedNews.image || PLACEHOLDER} 
              alt={selectedNews.title} 
              className="news-modal-img" 
              onError={(e) => { e.target.src = PLACEHOLDER; }}
            />
            <div className="news-modal-body">
              <div className="news-modal-meta">
                {selectedNews.category?.name && <span className="news-cat-badge" style={{ position: 'static' }}>{selectedNews.category.name}</span>}
                <time className="news-date">{selectedNews.date}</time>
              </div>
              <h2 className="news-modal-title">{selectedNews.title}</h2>
              <div className="news-modal-desc">
                {selectedNews.description || selectedNews.desc}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
