import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../../shared/i18n';
import { EditableSection } from '../../shared/editable';
import { useEditableSections } from '../../shared/api/useEditableSections';
import './NewsSection.css';

export default function EditableNewsSection() {
  const { t } = useLang();
  const location = useLocation();
  const isEditableMode = location.pathname.startsWith('/editable');
  const basePrefix = isEditableMode ? '/editable' : '';

  const { sections, handleSaveSection } = useEditableSections('news-section', {
    main: {
      label: "So'nggi",
      title: t.news.title,
      items: t.news.items,
    },
  });

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

          <div className="news-grid">
            {sections.main.items && sections.main.items.map((item, i) => (
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
        </EditableSection>
      </div>
    </section>
  );
}
