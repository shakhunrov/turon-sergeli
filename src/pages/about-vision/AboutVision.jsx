import { useState, useEffect } from 'react';
import { useLang } from '../../shared/i18n';
import { getPageSections } from '../../shared/api/pageSections';
import './AboutVision.css';

export default function AboutVision() {
  const { t, lang } = useLang();
  const v = t.about.vision;
  const branchId = localStorage.getItem('globalBranchId');

  const [sections, setSections] = useState({
    hero: {
      label: 'Biz haqimizda',
      title: v.title,
    },
    vision: {
      icon: '🌟',
      title: v.vision,
      text: v.visionText,
    },
    values: {
      title: v.valuesTitle,
      values: v.values,
    },
    outcomes: {
      title: v.outcomesTitle,
      outcomes: v.outcomes,
    },
  });

  useEffect(() => {
    const loadSections = async () => {
      try {
        const data = await getPageSections({ branch: branchId, page: 'about-vision' });
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
  }, [branchId, lang, v]);

  return (
    <div className="page">
      <div className="page-hero">
        <div className="container">
          <span className="section-label">{sections.hero.label}</span>
          <h1 className="section-title">{sections.hero.title}</h1>
          <div className="divider" />
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Vision */}
          <div className="vision-block glass-card">
            <div className="vision-icon">{sections.vision.icon}</div>
            <h2 className="vision-block-title">{sections.vision.title}</h2>
            <p className="vision-text">{sections.vision.text}</p>
          </div>

          {/* Values */}
          <div className="vision-values-section">
            <h2 className="section-title">{sections.values.title}</h2>
            <div className="divider" />
            <div className="values-grid">
              {sections.values.values.map((val, i) => (
                <div key={i} className="value-tag glass-card">
                  <span className="value-dot" />
                  {val}
                </div>
              ))}
            </div>
          </div>

          {/* Student Outcomes */}
          <div className="outcomes-section">
            <h2 className="section-title">{sections.outcomes.title}</h2>
            <div className="divider" />
            <div className="outcomes-list">
              {sections.outcomes.outcomes.map((o, i) => (
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
