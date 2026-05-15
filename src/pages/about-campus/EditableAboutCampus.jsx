import { useState, useEffect, useRef } from 'react';
import { useLang } from '../../shared/i18n';
import { EditableSection } from '../../shared/editable';
import { useEditableSections } from '../../shared/api/useEditableSections';
import { getPageSections, uploadSectionImages, deleteSectionImage } from '../../shared/api/pageSections';
import { Upload, Trash2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
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

export default function EditableAboutCampus() {
  const { t } = useLang();
  const location = useLocation();
  const isEditableMode = location.pathname.startsWith('/editable');
  const branchId = localStorage.getItem('globalBranchId');
  const [activeTab, setActiveTab] = useState('education');
  const tabs = tabData(t);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [sectionImages, setSectionImages] = useState({
    education: [],
    houses: [],
    sports: [],
  });
  const [sectionIds, setSectionIds] = useState({
    education: null,
    houses: null,
    sports: null,
  });

  const { sections, handleSaveSection } = useEditableSections('about-campus', {
    hero: {
      label: 'Biz haqimizda',
      title: t.about.campus.title,
    },
    education: {
      label: tabs[0].label,
      icon: tabs[0].icon,
      desc: tabs[0].desc,
    },
    houses: {
      label: tabs[1].label,
      icon: tabs[1].icon,
      desc: tabs[1].desc,
    },
    sports: {
      label: tabs[2].label,
      icon: tabs[2].icon,
      desc: tabs[2].desc,
    },
  });

  // Backend'dan rasmlarni yuklash
  useEffect(() => {
    const loadImages = async () => {
      try {
        const data = await getPageSections({ branch: branchId, page: 'about-campus' });
        if (data && data.length > 0) {
          const newSectionImages = { education: [], houses: [], sports: [] };
          const newSectionIds = { education: null, houses: null, sports: null };

          data.forEach(section => {
            if (TABS.includes(section.section_id)) {
              newSectionIds[section.section_id] = section.id;
              if (section.images && section.images.length > 0) {
                newSectionImages[section.section_id] = section.images.sort((a, b) => a.order - b.order);
              }
            }
          });

          setSectionImages(newSectionImages);
          setSectionIds(newSectionIds);
        }
      } catch (error) {
        console.error('Rasmlarni yuklashda xatolik:', error);
      }
    };
    loadImages();
  }, [branchId]);

  // Rasmlarni yuklash
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const sectionId = sectionIds[activeTab];
    if (!sectionId) {
      alert('Avval section ma\'lumotlarini saqlang!');
      return;
    }

    setUploading(true);
    try {
      const response = await uploadSectionImages(sectionId, files);
      if (response.images) {
        setSectionImages(prev => ({
          ...prev,
          [activeTab]: response.images.sort((a, b) => a.order - b.order),
        }));
      }
      alert('Rasmlar muvaffaqiyatli yuklandi!');
    } catch (error) {
      console.error('Rasmlarni yuklashda xatolik:', error);
      alert('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Rasmni o'chirish
  const handleDeleteImage = async (imageId) => {
    if (!confirm('Rasmni o\'chirmoqchimisiz?')) return;

    try {
      await deleteSectionImage(imageId);
      setSectionImages(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(img => img.id !== imageId),
      }));
      alert('Rasm o\'chirildi!');
    } catch (error) {
      console.error('Rasmni o\'chirishda xatolik:', error);
      alert('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    }
  };

  const current = sections[activeTab] || tabs.find((tb) => tb.key === activeTab);
  const currentImages = sectionImages[activeTab] || [];

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

              {/* Upload button - faqat editable rejimda */}
              {isEditableMode && (
                <div style={{ marginBottom: 20, textAlign: 'center' }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload size={16} />
                    {uploading ? ' Yuklanmoqda...' : ' Rasmlar yuklash'}
                  </button>
                </div>
              )}

              {/* Photo grid - chiroyli avtomatik grid */}
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
                      {isEditableMode && (
                        <button
                          className="campus-photo-delete"
                          onClick={() => handleDeleteImage(img.id)}
                          title="O'chirish"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <div className="campus-photo-overlay" />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
                  {isEditableMode ? 'Rasmlar yuklash uchun yuqoridagi tugmani bosing' : 'Rasmlar mavjud emas'}
                </div>
              )}
            </div>
          </EditableSection>
        </div>
      </section>
    </div>
  );
}
