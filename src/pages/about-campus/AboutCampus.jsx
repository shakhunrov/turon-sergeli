import { useState, useEffect } from 'react';
import { useLang } from '../../shared/i18n';
import { getPageSections } from '../../shared/api/pageSections';
import './AboutCampus.css';

const TABS = ['education', 'houses', 'sports'];

const tabData = (t) => [
  {
    key: 'education',
    label: t.about.campus.educationTitle,
    icon: '📚',
    desc: t.about.campus.educationDesc,
  },
  {
    key: 'houses',
    label: t.about.campus.housesTitle,
    icon: '🏡',
    desc: t.about.campus.housesDesc,
  },
  {
    key: 'sports',
    label: t.about.campus.sportsTitle,
    icon: '🏆',
    desc: t.about.campus.sportsDesc,
  },
];

export default function AboutCampus() {
  const { t, lang } = useLang();
  const branchId = localStorage.getItem('globalBranchId');
  const [activeTab, setActiveTab] = useState('education');

  const [sections, setSections] = useState({
    hero: {
      label: 'Biz haqimizda',
      title: t.about.campus.title,
    },
    education: {
      label: t.about.campus.educationTitle,
      icon: '📚',
      desc: t.about.campus.educationDesc,
      images: [],
    },
    houses: {
      label: t.about.campus.housesTitle,
      icon: '🏡',
      desc: t.about.campus.housesDesc,
      images: [],
    },
    sports: {
      label: t.about.campus.sportsTitle,
      icon: '🏆',
      desc: t.about.campus.sportsDesc,
      images: [],
    },
  });

  // Backend'dan ma'lumotlarni yuklash
  useEffect(() => {
    const loadSections = async () => {
      try {
        const data = await getPageSections({ branch: branchId, page: 'about-campus' });
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
                loadedSections[section.section_id] = { ...content };
              }

              // Rasmlarni qo'shish
              if (section.images && section.images.length > 0) {
                if (!loadedSections[section.section_id]) {
                  loadedSections[section.section_id] = {};
                }
                loadedSections[section.section_id].images = section.images.sort((a, b) => a.order - b.order);
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
  }, [branchId, lang, t]);

  const tabs = [
    { key: 'education', ...sections.education },
    { key: 'houses', ...sections.houses },
    { key: 'sports', ...sections.sports },
  ];

  const current = tabs.find((tb) => tb.key === activeTab);
  const currentImages = current?.images || [];

  return (
    <div className="page">
      <div className="page-hero glass-card campus-hero">
        <div className="container">
          <span className="section-label">{sections.hero.label}</span>
          <h1 className="section-title">{sections.hero.title}</h1>
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

            {/* Photo grid - backend'dan yuklangan rasmlar */}
            {currentImages.length > 0 ? (
              <div className="campus-photo-grid">
                {currentImages.map((img, i) => (
                  <div key={img.id} className={`campus-photo glass-card campus-photo-${i % 6}`}>
                    <img
                      src={img.image}
                      alt={`Campus ${i + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '12px',
                      }}
                    />
                    <div className="campus-photo-overlay" />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
                Rasmlar mavjud emas
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
