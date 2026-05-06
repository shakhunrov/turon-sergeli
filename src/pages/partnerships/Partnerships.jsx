import { useLang } from '../../shared/i18n';
import './Partnerships.css';

export default function Partnerships() {
  const { t } = useLang();
  const p = t.partnerships;

  return (
    <div className="page">
      <div className="page-hero-simple">
        <div className="container">
          <span className="section-label">Global tarmoq</span>
          <h1 className="section-title">{p.title}</h1>
          <div className="divider" />
          <p className="section-subtitle">{p.subtitle}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Stats */}
          <div className="partner-stats">
            {p.stats.map((s) => (
              <div key={s.label} className="partner-stat glass-card">
                <div className="partner-stat-val">{s.val}</div>
                <div className="partner-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Network */}
          <div className="partner-network">
            <h2 className="section-title">{p.networkTitle}</h2>
            <div className="divider" />
            <p className="section-subtitle" style={{ marginBottom: 48 }}>{p.networkSubtitle}</p>
            <div className="partner-grid">
              {p.categories.map((cat, i) => (
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

          {/* Opportunities */}
          <div className="opp-section">
            <h2 className="section-title">{p.oppTitle}</h2>
            <div className="divider" />
            <div className="opp-list">
              {p.opps.map((o, i) => (
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
