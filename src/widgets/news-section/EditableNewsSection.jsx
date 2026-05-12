import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../../shared/i18n';
import { EditableSection } from '../../shared/editable';
import { useEditableSections } from '../../shared/api/useEditableSections';
import { fetchNews, selectNewsList, selectNewsLoading } from '../../features/news';
import './NewsSection.css';

export default function EditableNewsSection() {
  const { t } = useLang();
  const dispatch = useDispatch();
  const location = useLocation();
  const isEditableMode = location.pathname.startsWith('/editable');
  const basePrefix = isEditableMode ? '/editable' : '';
  const branchId = localStorage.getItem('globalBranchId');

  const newsList = useSelector(selectNewsList);
  const newsLoading = useSelector(selectNewsLoading);

  const { sections, handleSaveSection } = useEditableSections('news-section', {
    main: {
      label: "So'nggi",
      title: t.news.title,
    },
  });


  // Backend'dan yangiliklar ma'lumotlarini yuklash
  useEffect(() => {
    dispatch(fetchNews({ branch: branchId }));
  }, [dispatch, branchId]);

  // Faqat nashr etilgan va eng so'nggi 3ta yangilikni olish
    const latestNews = newsList
        // .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

  console.log('newsList:', newsList);
  console.log('latestNews:', latestNews);

  return (
    <section className="news-section section">
      <div className="container">
        <EditableSection
          sectionId="main"
          data={sections.main}
          onSave={(data) => handleSaveSection('main', data)}
        >
          <div className="section-header">
            <span className="section-label">{sections.main.label}</span>
            <h2 className="section-title">{sections.main.title}</h2>
            <div className="divider" />
          </div>

          {newsLoading ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
              <div className="al-spinner" style={{ margin: '0 auto 16px', borderTopColor: '#4f46e5' }} />
              Yangiliklar yuklanmoqda…
            </div>
          ) : (
            <>
              <div className="news-grid">
                {latestNews.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', gridColumn: '1 / -1' }}>
                    Yangiliklar topilmadi.
                  </div>
                ) : (
                  latestNews.map((item, i) => (
                    <article key={item.id} className="news-card glass-card">
                      <div
                        className="news-img-placeholder"
                        style={{
                          background: item.image ? `url(${item.image}) center/cover` : `var(--grad-${['cyan','gold','purple'][i % 3]})`,
                          opacity: item.image ? 1 : 0.15,
                          height: 200,
                        }}
                      />
                      <div className="news-body">
                        <time className="news-date">{item.date}</time>
                        <h3 className="news-title">{item.title}</h3>
                        <p className="news-desc">{(item.description || '').slice(0, 100)}…</p>
                        <Link to={`${basePrefix}/news/${item.id}`} className="news-read-more">{t.news.readMore} →</Link>
                      </div>
                    </article>
                  ))
                )}
              </div>

              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <Link to={`${basePrefix}/news`} className="btn btn-outline">Barcha yangiliklar</Link>
              </div>
            </>
          )}
        </EditableSection>
      </div>
    </section>
  );
}
