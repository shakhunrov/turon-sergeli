import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../shared/i18n';
import { getPageSections } from '../../shared/api/pageSections';
import './HeroBanner.css';

export default function HeroBanner() {
  const { t, lang } = useLang();
  const branchId = localStorage.getItem('globalBranchId');

  const [heroData, setHeroData] = useState({
    subtitle: t.hero.subtitle,
    vision: t.hero.vision,
    text: t.whoWeAre.text,
    cta: t.hero.cta,
    apply: t.hero.apply,
  });

  const [statsData, setStatsData] = useState({
    students: { val: t.stats.studentsVal, label: t.stats.students },
    teachers: { val: t.stats.teachersVal, label: t.stats.teachers },
    universities: { val: t.stats.universitiesVal, label: t.stats.universities },
    languages: { val: '3', label: 'Languages' },
  });

  // Backend'dan ma'lumotlarni yuklash
  useEffect(() => {
    const loadHeroData = async () => {
      try {
        const data = await getPageSections({ branch: branchId, page: 'home' });
        if (data && data.length > 0) {
          const heroSection = data.find(section => section.section_id === 'hero');
          if (heroSection) {
            try {
              const contentField = `content_${lang}`;
              let content = heroSection[contentField];

              if (typeof content === 'string') {
                content = JSON.parse(content);
              }

              if (content && Object.keys(content).length > 0) {
                if (heroSection.image) {
                  content.image = heroSection.image;
                }
                setHeroData(prev => ({ ...prev, ...content }));
              }
            } catch (e) {
              console.error('Hero section parse error:', e);
            }
          }

          const statsSection = data.find(section => section.section_id === 'hero-stats');
          if (statsSection) {
            try {
              const contentField = `content_${lang}`;
              let content = statsSection[contentField];

              if (typeof content === 'string') {
                content = JSON.parse(content);
              }

              if (content && Object.keys(content).length > 0) {
                setStatsData(prev => ({
                  students: content.students || prev.students,
                  teachers: content.teachers || prev.teachers,
                  universities: content.universities || prev.universities,
                  languages: content.languages || prev.languages,
                }));
              }
            } catch (e) {
              console.error('Stats section parse error:', e);
            }
          }
        }
      } catch (error) {
        console.error('Hero ma\'lumotlarini yuklashda xatolik:', error);
      }
    };
    loadHeroData();
  }, [branchId, lang, t]);

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
          <span className="badge badge-cyan">🎓 {heroData.subtitle}</span>
        </div>

        <h1 className="hero-title fade-up-d1">
          {heroData.vision.split(' ').slice(0, 5).join(' ')}{' '}
          <span className="text-gradient">{heroData.vision.split(' ').slice(5, 9).join(' ')}</span>{' '}
          {heroData.vision.split(' ').slice(9).join(' ')}
        </h1>

        <p className="hero-sub fade-up-d2">{heroData.text}</p>

        <div className="hero-actions fade-up-d3">
          <Link to="/about/vision" className="btn btn-primary">
            {heroData.cta} →
          </Link>
          <Link to="/admissions" className="btn btn-outline">
            {heroData.apply}
          </Link>
        </div>

        {/* Stats row */}
        <div className="hero-stats fade-up-d3">
          {[
            statsData.students,
            statsData.teachers,
            statsData.universities,
            statsData.languages,
          ].map((s, idx) => (
            <div key={idx} className="hero-stat">
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
