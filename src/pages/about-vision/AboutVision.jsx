import { useLang } from '../../shared/i18n';
import './AboutVision.css';

export default function AboutVision() {
  const { t } = useLang();
  const v = t.about.vision;

  return (
    <div className="page">
      <div className="page-hero">
        <div className="container">
          <span className="section-label">Biz haqimizda</span>
          <h1 className="section-title">{v.title}</h1>
          <div className="divider" />
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Vision */}
          <div className="vision-block glass-card">
            <div className="vision-icon">🌟</div>
            <h2 className="vision-block-title">{v.vision}</h2>
            <p className="vision-text">{v.visionText}</p>
          </div>

          {/* Values */}
          <div className="vision-values-section">
            <h2 className="section-title">{v.valuesTitle}</h2>
            <div className="divider" />
            <div className="values-grid">
              {v.values.map((val, i) => (
                <div key={i} className="value-tag glass-card">
                  <span className="value-dot" />
                  {val}
                </div>
              ))}
            </div>
          </div>

          {/* Student Outcomes */}
          <div className="outcomes-section">
            <h2 className="section-title">{v.outcomesTitle}</h2>
            <div className="divider" />
            <div className="outcomes-list">
              {v.outcomes.map((o, i) => (
                <div key={i} className="outcome-item glass-card">
                  <span className="outcome-num">{String(i + 1).padStart(2, '0')}</span>
                  <p>{o}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
