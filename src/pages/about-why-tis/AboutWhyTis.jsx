import { useLang } from '../../shared/i18n';
import './AboutWhyTis.css';

export default function AboutWhyTis() {
  const { t } = useLang();
  const w = t.about.whyTis;

  return (
    <div className="page">
      <div className="page-hero-simple">
        <div className="container">
          <span className="section-label">Biz haqimizda</span>
          <h1 className="section-title">{w.title}</h1>
          <div className="divider" />
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Differentiators */}
          <div className="differ-intro glass-card">
            <h2 className="differ-title">{w.differTitle}</h2>
            <p className="differ-text">{w.differText}</p>
          </div>

          <div className="differ-grid">
            {w.differItems.map((item, i) => (
              <div key={i} className="differ-card glass-card">
                <div className="differ-num">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="differ-card-title">{item.title}</h3>
                <ul className="differ-list">
                  {item.items.map((p, j) => (
                    <li key={j}><span className="differ-dot" />{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Pedagogical Strengths */}
          <div className="ped-section">
            <h2 className="section-title">{w.pedTitle}</h2>
            <div className="divider" />
            <p className="section-subtitle" style={{ marginBottom: 40 }}>{w.pedText}</p>
            <div className="ped-grid">
              {w.pedItems.map((p, i) => (
                <div key={i} className="ped-card glass-card">
                  <div className="ped-num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="ped-text">{p}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Unified Academic Approach */}
          <div className="unified-section">
            <h2 className="section-title">{w.unifiedTitle}</h2>
            <div className="divider" />
            <p className="section-subtitle" style={{ marginBottom: 40 }}>{w.unifiedText}</p>
            <div className="unified-list">
              {w.unifiedItems.map((item, i) => (
                <div key={i} className="unified-item glass-card">
                  <div className="unified-icon">✓</div>
                  <div>
                    <h4 className="unified-item-title">{item.title}</h4>
                    <p className="unified-item-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
