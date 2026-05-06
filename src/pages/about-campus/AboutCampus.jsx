import { useState } from 'react';
import { useLang } from '../../shared/i18n';
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

export default function AboutCampus() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState('education');
  const tabs = tabData(t);
  const current = tabs.find((tb) => tb.key === activeTab);

  return (
    <div className="page">
      <div className="page-hero glass-card campus-hero">
        <div className="container">
          <span className="section-label">Biz haqimizda</span>
          <h1 className="section-title">{t.about.campus.title}</h1>
          <div className="divider" />
        </div>
      </div>

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
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
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
        </div>
      </section>
    </div>
  );
}
