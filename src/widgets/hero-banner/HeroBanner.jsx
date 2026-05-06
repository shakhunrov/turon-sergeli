import { Link } from 'react-router-dom';
import { useLang } from '../../shared/i18n';
import './HeroBanner.css';

export default function HeroBanner() {
  const { t } = useLang();

  return (
    <section className="hero">
      {/* Animated background orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      {/* Grid overlay */}
      <div className="hero-grid" />

      <div className="container hero-content">
        <div className="hero-badge fade-up">
          <span className="badge badge-cyan">🎓 {t.hero.subtitle}</span>
        </div>

        <h1 className="hero-title fade-up-d1">
          {t.hero.vision.split(' ').slice(0, 5).join(' ')}{' '}
          <span className="text-gradient">{t.hero.vision.split(' ').slice(5, 9).join(' ')}</span>{' '}
          {t.hero.vision.split(' ').slice(9).join(' ')}
        </h1>

        <p className="hero-sub fade-up-d2">{t.whoWeAre.text}</p>

        <div className="hero-actions fade-up-d3">
          <Link to="/about/vision" className="btn btn-primary">
            {t.hero.cta} →
          </Link>
          <Link to="/admissions" className="btn btn-outline">
            {t.hero.apply}
          </Link>
        </div>

        {/* Stats row */}
        <div className="hero-stats fade-up-d3">
          {[
            { val: '200+', label: t.stats.students },
            { val: '30+', label: t.stats.teachers },
            { val: '15+', label: t.stats.universities },
            { val: '3', label: 'Languages' },
          ].map((s) => (
            <div key={s.label} className="hero-stat">
              <div className="hero-stat-val">{s.val}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll">
        <div className="scroll-dot" />
      </div>
    </section>
  );
}
