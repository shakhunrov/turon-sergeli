import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../../shared/i18n';
import { getPageSections } from '../../shared/api/pageSections';
import { fetchNews, selectNewsList } from '../../features/news';
import './NewsSection.css';

export default function NewsSection() {
  const { t, lang } = useLang();
  const dispatch = useDispatch();
  const location = useLocation();
  const isEditableMode = location.pathname.startsWith('/editable');
  const basePrefix = isEditableMode ? '/editable' : '';
  const branchId = localStorage.getItem('globalBranchId');

  const newsList = useSelector(selectNewsList);

  const [section, setSection] = useState({
    label: "So'nggi",
    title: t.news.title,
  });

  // Backend'dan section ma'lumotlarini yuklash
  useEffect(() => {
    const loadSection = async () => {
      try {
        const data = await getPageSections({ branch: branchId, page: 'news-section' });
        if (data && data.length > 0) {
          const mainSection = data.find(s => s.section_id === 'main');
          if (mainSection) {
            try {
              const contentField = `content_${lang}`;
              let content = mainSection[contentField];

              if (typeof content === 'string') {
                content = JSON.parse(content);
              }

              if (content && Object.keys(content).length > 0) {
                setSection(prev => ({ ...prev, ...content }));
              }
            } catch (e) {
              console.error('NewsSection parse error:', e);
            }
          }
        }
      } catch (error) {
        console.error('NewsSection ma\'lumotlarini yuklashda xatolik:', error);
      }
    };
    loadSection();
  }, [branchId, lang, t]);

  // Backend'dan yangiliklar ma'lumotlarini yuklash
  useEffect(() => {
    dispatch(fetchNews({ branch: branchId }));
  }, [dispatch, branchId]);

  // Faqat eng so'nggi 3ta yangilikni olish
  const latestNews = newsList.slice(0, 3);

  return (
    <section className="news-section section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{section.label}</span>
          <h2 className="section-title">{section.title}</h2>
          <div className="divider" />
        </div>

        <div className="news-grid">
          {latestNews.map((item, i) => (
            <article key={i} className="news-card glass-card">
              <div className="news-img-placeholder" style={{ background: `var(--grad-${['cyan','gold','purple'][i % 3]})`, opacity: 0.15 }} />
              <div className="news-body">
                <time className="news-date">{item.date}</time>
                <h3 className="news-title">{item.title}</h3>
                <p className="news-desc">{item.desc}</p>
                <Link to={`${basePrefix}/news`} className="news-read-more">{t.news.readMore} →</Link>
              </div>
            </article>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to={`${basePrefix}/news`} className="btn btn-outline">Barcha yangiliklar</Link>
        </div>
      </div>
    </section>
  );
}
