import { useLang } from '../../shared/i18n';
import { EditableSection } from '../../shared/editable';
import { useEditableSections } from '../../shared/api/useEditableSections';
import './Partnerships.css';

export default function EditablePartnerships() {
  const { t } = useLang();
  const p = t.partnerships;

  const { sections, handleSaveSection } = useEditableSections('partnerships', {
    hero: {
      label: 'Global tarmoq',
      title: p.title,
      subtitle: p.subtitle,
    },
    stats: {
      stats: p.stats,
    },
    network: {
      networkTitle: p.networkTitle,
      networkSubtitle: p.networkSubtitle,
      categories: p.categories,
    },
    opportunities: {
      oppTitle: p.oppTitle,
      opps: p.opps,
    },
  });

  return (
    <div className="page">
      <EditableSection
        sectionId="hero"
        data={sections.hero}
        onSave={(data) => handleSaveSection('hero', data)}
      >
        <div className="page-hero-simple">
          <div className="container">
            <span className="section-label">{sections.hero.label}</span>
            <h1 className="section-title">{sections.hero.title}</h1>
            <div className="divider" />
            <p className="section-subtitle">{sections.hero.subtitle}</p>
          </div>
        </div>
      </EditableSection>

      <section className="section">
        <div className="container">
          {/* Stats */}
          <EditableSection
            sectionId="stats"
            data={sections.stats}
            onSave={(data) => handleSaveSection('stats', data)}
            buttonClassName="stats-edit-btn"
          >
            <div className="partner-stats">
              {sections.stats.stats && sections.stats.stats.map((s, idx) => (
                <div key={idx} className="partner-stat glass-card">
                  <div className="partner-stat-val">{s.val}</div>
                  <div className="partner-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </EditableSection>

          {/* Network */}
          <EditableSection
            sectionId="network"
            data={sections.network}
            onSave={(data) => handleSaveSection('network', data)}
          >
            <div className="partner-network">
              <h2 className="section-title">{sections.network.networkTitle}</h2>
              <div className="divider" />
              <p className="section-subtitle" style={{ marginBottom: 48 }}>{sections.network.networkSubtitle}</p>
              <div className="partner-grid">
                {sections.network.categories && sections.network.categories.map((cat, i) => (
                  <div key={i} className="partner-card glass-card">
                    <div className="partner-card-icon">
                      {['🎓', '🏭', '🌐', '🤝'][i]}
                    </div>
                    <h3 className="partner-card-title">{cat.title}</h3>
                    <p className="partner-card-desc">{cat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </EditableSection>

          {/* Opportunities */}
          <EditableSection
            sectionId="opportunities"
            data={sections.opportunities}
            onSave={(data) => handleSaveSection('opportunities', data)}
          >
            <div className="opp-section">
              <h2 className="section-title">{sections.opportunities.oppTitle}</h2>
              <div className="divider" />
              <div className="opp-list">
                {sections.opportunities.opps && sections.opportunities.opps.map((o, i) => (
                  <div key={i} className="opp-item glass-card">
                    <span className="opp-icon">✨</span>
                    <span>{o}</span>
                  </div>
                ))}
              </div>
            </div>
          </EditableSection>
        </div>
      </section>
    </div>
  );
}
