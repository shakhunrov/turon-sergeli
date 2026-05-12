import { useState, useEffect } from 'react';
import { useLang } from '../../shared/i18n';
import { EditableSection } from '../../shared/editable';
import { useEditableSections } from '../../shared/api/useEditableSections';
import './AboutCampus.css';

const TABS = ['education', 'houses', 'sports'];

const tabData = (t) => [
  {
    key: 'education',
    label: t.about.campus.educationTitle,
    icon: '📚',
    desc: t.about.campus.educationDesc,
    imgs: ['🏫', '📖', '🔬', '🎨', '💻', '🌍'],
  },
  {
    key: 'houses',
    label: t.about.campus.housesTitle,
    icon: '🏡',
    desc: t.about.campus.housesDesc,
    imgs: ['🏡', '⭐', '🔥', '🌊', '🌿', '🦅'],
  },
  {
    key: 'sports',
    label: t.about.campus.sportsTitle,
    icon: '🏆',
    desc: t.about.campus.sportsDesc,
    imgs: ['⚽', '🏀', '🎾', '🏊', '🏃', '🤸'],
  },
];

export default function EditableAboutCampus() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState('education');
  const tabs = tabData(t);

  const { sections, handleSaveSection } = useEditableSections('about-campus', {
    hero: {
      label: 'Biz haqimizda',
      title: t.about.campus.title,
    },
    education: {
      label: tabs[0].label,
      icon: tabs[0].icon,
      desc: tabs[0].desc,
      imgs: tabs[0].imgs,
    },
    houses: {
      label: tabs[1].label,
      icon: tabs[1].icon,
      desc: tabs[1].desc,
      imgs: tabs[1].imgs,
    },
    sports: {
      label: tabs[2].label,
      icon: tabs[2].icon,
      desc: tabs[2].desc,
      imgs: tabs[2].imgs,
    },
  });

  const current = sections[activeTab] || tabs.find((tb) => tb.key === activeTab);

  return (
    <div className="page">
      <EditableSection
        sectionId="hero"
        data={sections.hero}
        onSave={(data) => handleSaveSection('hero', data)}
      >
        <div className="page-hero glass-card campus-hero">
          <div className="container">
            <span className="section-label">{sections.hero.label}</span>
            <h1 className="section-title">{sections.hero.title}</h1>
            <div className="divider" />
          </div>
        </div>
      </EditableSection>

      <section className="section">
        <div className="container">
          {/* Tabs */}
          <div className="campus-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`campus-tab ${activeTab === tab.key ? 'active' : ''}`}
              >
                <span>{sections[tab.key]?.icon || tab.icon}</span> {sections[tab.key]?.label || tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <EditableSection
            sectionId={activeTab}
            data={current}
            onSave={(data) => handleSaveSection(activeTab, data)}
          >
            <div className="campus-content">
              <div className="campus-desc glass-card">
                <h2 className="campus-desc-title">{current.label}</h2>
                <p>{current.desc}</p>
              </div>

              {/* Photo grid with emoji placeholders */}
              <div className="campus-photo-grid">
                {current.imgs.map((img, i) => (
                  <div key={i} className={`campus-photo glass-card campus-photo-${i % 3}`}>
                    <span className="campus-photo-icon">{img}</span>
                    <div className="campus-photo-overlay" />
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
