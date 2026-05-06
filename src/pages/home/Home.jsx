import { Link } from 'react-router-dom';
import HeroBanner from '../../widgets/hero-banner/HeroBanner';
import WhyChoose from '../../widgets/why-choose/WhyChoose';
import Testimonials from '../../widgets/testimonials/Testimonials';
import NewsSection from '../../widgets/news-section/NewsSection';
import { useLang } from '../../shared/i18n';
import schoolImg from '../../shared/assets/img/school.png';
import './Home.css';

export default function Home() {
  const { t } = useLang();

  return (
    <div className="page">
      <HeroBanner />

      {/* Biz haqimizda */}
      <section className="section">
        <div className="container who-we-are">
          <div className="wwa-content">
            <span className="section-label">{t.nav.about}</span>
            <h2 className="section-title">{t.whoWeAre.title}</h2>
            <div className="divider" />
            <p className="wwa-text">{t.whoWeAre.text}</p>
            <Link to="/about/vision" className="btn btn-primary" style={{ marginTop: 16 }}>Batafsil →</Link>
          </div>
          <div className="wwa-image-side">
            <img src={schoolImg} alt="Turon International School" className="wwa-school-img" />
          </div>
        </div>
      </section>

      {/* Asosiy raqamlar */}
      <section className="stats-section section">
        <div className="container">
          <div className="section-header center">
            <span className="section-label">Ta'sir</span>
            <h2 className="section-title">{t.stats.title}</h2>
            <div className="divider center" />
          </div>
          <div className="stats-grid">
            {[
              { val: t.stats.studentsVal, label: t.stats.students, icon: '👨‍🎓', note: null },
              { val: t.stats.teachersVal, label: t.stats.teachers, icon: '👩‍🏫', note: t.stats.teachersNote },
              { val: t.stats.programsVal, label: t.stats.programs, icon: '📚', note: null },
              { val: t.stats.universitiesVal, label: t.stats.universities, icon: '🏛️', note: null },
            ].map((s) => (
              <div key={s.label} className="stat-card glass-card">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-val">{s.val}</div>
                <div className="stat-label">{s.label}</div>
                {s.note && <div className="stat-note">{s.note}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ta'lim falsafasi */}
      <section className="section">
        <div className="container philosophy-section">
          <div className="philosophy-content">
            <span className="section-label">Falsafa</span>
            <h2 className="section-title">{t.philosophy.title}</h2>
            <div className="divider" />
            <p className="section-subtitle">{t.philosophy.text}</p>
            <Link to="/education" className="btn btn-outline" style={{ marginTop: 24 }}>Bizning yondashuvimiz →</Link>
          </div>
          <div className="philosophy-cards">
            {['STEAM', 'AI', 'Cambridge', 'Kelajak ko\'nikmalari'].map((tag) => (
              <div key={tag} className="phil-tag glass-card">{tag}</div>
            ))}
          </div>
        </div>
      </section>

      <WhyChoose />
      <Testimonials />
      <NewsSection />

      {/* CTA Banner */}
      <section className="cta-banner section">
        <div className="container">
          <div className="cta-box glass-card">
            <div className="cta-glow" />
            <h2 className="cta-title">{t.cta.title}</h2>
            <div className="cta-actions">
              <Link to="/admissions" className="btn btn-primary">{t.cta.button}</Link>
              <Link to="/contact" className="btn btn-outline">{t.cta.consult}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
