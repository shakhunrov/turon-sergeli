import { useState, useEffect } from 'react';
import { useLang } from '../../shared/i18n';
import { getPageSections } from '../../shared/api/pageSections';
import './Partnerships.css';

export default function Partnerships() {
  const { t, lang } = useLang();
  const p = t.partnerships;
  const branchId = localStorage.getItem('globalBranchId');

  const [sections, setSections] = useState({
    hero: {
      label: 'Global tarmoq',
      title: p.title,
      subtitle: p.subtitle,
    },
    stats: {
      stats: p.stats,
    },
    network: {
      title: p.networkTitle,
      subtitle: p.networkSubtitle,
      categories: p.categories,
    },
    opportunities: {
      title: p.oppTitle,
      opps: p.opps,
    },
  });

  useEffect(() => {
    const loadSections = async () => {
      try {
        const data = await getPageSections({ branch: branchId, page: 'partnerships' });
        if (data && data.length > 0) {
          const loadedSections = {};
          data.forEach(section => {
            try {
              const contentField = `content_${lang}`;
              let content = section[contentField];

              if (typeof content === 'string') {
                content = JSON.parse(content);
              }

              if (content && Object.keys(content).length > 0) {
                loadedSections[section.section_id] = content;
              }
            } catch (e) {
              console.error(`Section ${section.section_id} parse error:`, e);
            }
          });
          setSections(prev => ({ ...prev, ...loadedSections }));
        }
      } catch (error) {
        console.error('Section ma\'lumotlarini yuklashda xatolik:', error);
      }
    };
    loadSections();
  }, [branchId, lang, p]);

  return (
    <div className="page">
      <div className="page-hero-simple">
        <div className="container">
          <span className="section-label">{sections.hero.label}</span>
          <h1 className="section-title">{sections.hero.title}</h1>
          <div className="divider" />
          <p className="section-subtitle">{sections.hero.subtitle}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Stats */}
          <div className="partner-stats">
            {sections.stats.stats.map((s, idx) => (
              <div key={idx} className="partner-stat glass-card">
                <div className="partner-stat-val">{s.val}</div>
                <div className="partner-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Network */}
          <div className="partner-network">
            <h2 className="section-title">{sections.network.title}</h2>
            <div className="divider" />
            <p className="section-subtitle" style={{ marginBottom: 48 }}>{sections.network.subtitle}</p>
            <div className="partner-grid">
              {sections.network.categories.map((cat, i) => (
                <div key={i} className="partner-card glass-card">
                  <div className="partner-card-icon">
                    {cat.icon || ['🎓', '🏭', '🌐', '🤝'][i]}
                  </div>
                  <h3 className="partner-card-title">{cat.title}</h3>
                  <p className="partner-card-desc">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div className="opp-section">
            <h2 className="section-title">{sections.opportunities.title}</h2>
            <div className="divider" />
            <div className="opp-list">
              {sections.opportunities.opps.map((o, i) => (
                <div key={i} className="opp-item glass-card">
                  <span className="opp-icon">✨</span>
                  <span>{o}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
