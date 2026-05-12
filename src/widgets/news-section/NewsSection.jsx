import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../../shared/i18n';
import './NewsSection.css';

export default function NewsSection() {
  const { t } = useLang();
  const location = useLocation();
  const isEditableMode = location.pathname.startsWith('/editable');
  const basePrefix = isEditableMode ? '/editable' : '';

  return (
    <section className="news-section section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">So'nggi</span>
          <h2 className="section-title">{t.news.title}</h2>
          <div className="divider" />
        </div>

        <div className="news-grid">
          {t.news.items.map((item, i) => (
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
