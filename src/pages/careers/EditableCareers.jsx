import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLang } from '../../shared/i18n';
import { EditableSection, EditableList } from '../../shared/editable';
import { getPageSections, savePageSection } from '../../shared/api/pageSections';
import {
  fetchPositions,
  selectPositions,
  selectPositionsLoading,
  applyForPosition,
  resetApplyStatus,
  selectApplySuccess,
  selectApplicationsLoading,
} from '../../features/careers';
import { Briefcase, Calendar, CheckCircle, Send, X } from 'lucide-react';
import './Careers.css';

export default function EditableCareers() {
  const { t, lang } = useLang();
  const c = t.careers;
  const dispatch = useDispatch();
  const branchId = localStorage.getItem('globalBranchId');

  const positions = useSelector(selectPositions);
  const positionsLoading = useSelector(selectPositionsLoading);
  const applySuccess = useSelector(selectApplySuccess);
  const applyLoading = useSelector(selectApplicationsLoading);

  const [applyModal, setApplyModal] = useState(null);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', phone: '' });

  const [sections, setSections] = useState({
    hero: {
      label: 'Biz bilan ishlang',
      title: c.title,
      subtitle: c.subtitle,
    },
    intro: {
      text: c.intro,
    },
    why: {
      title: c.whyTitle,
      items: c.whyItems,
    },
    pathway: {
      title: c.pathwayTitle,
      pathway: c.pathway,
    },
    process: {
      title: c.processTitle,
      steps: c.process,
    },
    join: {
      title: c.joinTitle,
      subtitle: c.joinSubtitle,
    },
  });

  useEffect(() => {
    dispatch(fetchPositions({ branch: branchId }));
  }, [dispatch, branchId]);

  useEffect(() => {
    if (applySuccess) {
      const timer = setTimeout(() => {
        setApplyModal(null);
        dispatch(resetApplyStatus());
        setApplyForm({ name: '', email: '', phone: '' });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [applySuccess, dispatch]);

  // Backend'dan ma'lumotlarni yuklash
  useEffect(() => {
    const loadSections = async () => {
      try {
        const data = await getPageSections({ branch: branchId, page: 'careers' });
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
  }, [branchId, lang]);

  // Section'ni saqlash
  const handleSaveSection = async (sectionId, data) => {
    try {
      const contentField = `content_${lang}`;
      await savePageSection({
        branch: branchId,
        page: 'careers',
        section_id: sectionId,
        [contentField]: JSON.stringify(data),
      });
      setSections(prev => ({ ...prev, [sectionId]: data }));
      alert('Section muvaffaqiyatli saqlandi!');
    } catch (error) {
      console.error('Section saqlashda xatolik:', error);
      alert('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    }
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (!applyModal) return;
    dispatch(applyForPosition({
      ...applyForm,
      position: applyModal.id,
    }));
  };

  const activePositions = positions.filter((p) => p.is_active);

  return (
    <div className="page">
      {/* Hero */}
      <EditableSection
        sectionId="hero"
        data={sections.hero}
        onSave={(data) => handleSaveSection('hero', data)}
      >
        <div className="page-hero-simple">
          <div className="container">
            <span className="section-label">{sections.hero.label}</span>
            <h1 className="section-title">{sections.hero.title}</h1>
            <p className="section-subtitle" style={{ marginTop: 16 }}>{sections.hero.subtitle}</p>
            <div className="divider" />
          </div>
        </div>
      </EditableSection>

      <section className="section">
        <div className="container">
          {/* Intro */}
          <EditableSection
            sectionId="intro"
            data={sections.intro}
            onSave={(data) => handleSaveSection('intro', data)}
          >
            <p className="section-subtitle" style={{ marginBottom: 64, maxWidth: 700 }}>{sections.intro.text}</p>
          </EditableSection>

          {/* Why Work With Us */}
          <EditableSection
            sectionId="why"
            data={sections.why}
            onSave={(data) => handleSaveSection('why', data)}
          >
            <div className="careers-section">
              <h2 className="section-title">{sections.why.title}</h2>
              <div className="divider" />
              <div className="why-grid-careers">
                <EditableList
                  items={sections.why.items || []}
                  onSave={(newItems) => {
                    handleSaveSection('why', { ...sections.why, items: newItems });
                  }}
                  renderItem={(item) => (
                    <div className="why-career-card glass-card">
                      <span className="why-career-icon">{item.icon}</span>
                      <p>{item.text}</p>
                    </div>
                  )}
                  defaultItem={{ icon: '📚', text: '' }}
                  itemName="Item"
                />
              </div>
            </div>
          </EditableSection>

          {/* Career Pathway */}
          <EditableSection
            sectionId="pathway"
            data={sections.pathway}
            onSave={(data) => handleSaveSection('pathway', data)}
          >
            <div className="pathway-section glass-card">
              <h2 className="pathway-title">{sections.pathway.title}</h2>
              <div className="pathway-steps">
                {sections.pathway.pathway?.split(' → ').map((step, i, arr) => (
                  <div key={i} className="pathway-step-wrapper">
                    <div className="pathway-step">{step}</div>
                    {i < arr.length - 1 && <span className="pathway-arrow">→</span>}
                  </div>
                ))}
              </div>
            </div>
          </EditableSection>

          {/* Open Positions from API */}
          <div className="positions-section">
            <h2 className="section-title">{c.rolesTitle || 'Open Positions'}</h2>
            <div className="divider" />

            {positionsLoading ? (
              <div className="positions-loading">
                <div className="al-spinner" style={{ borderTopColor: 'var(--accent-cyan, #4f46e5)' }} />
                <p>Loading positions…</p>
              </div>
            ) : activePositions.length === 0 ? (
              <div className="positions-empty glass-card">
                <Briefcase size={32} style={{ color: 'var(--text-muted, #94a3b8)', marginBottom: 12 }} />
                <p>No open positions at the moment. Check back soon!</p>
              </div>
            ) : (
              <div className="positions-grid">
                {activePositions.map((pos) => (
                  <div key={pos.id} className="position-card glass-card">
                    <div className="position-card-header">
                      <h3 className="position-card-title">{pos.title}</h3>
                      <span className={`position-type-badge ${pos.type === 'Academic' ? 'academic' : 'non-academic'}`}>
                        {pos.type}
                      </span>
                    </div>
                    <p className="position-card-desc">{pos.description}</p>
                    <div className="position-card-meta">
                      <span className="position-meta-item">
                        <Briefcase size={14} /> {pos.employment_type}
                      </span>
                      {pos.deadline && (
                        <span className="position-meta-item">
                          <Calendar size={14} /> Deadline: {pos.deadline}
                        </span>
                      )}
                    </div>
                    {pos.requirements?.length > 0 && (
                      <div className="position-card-requirements">
                        {pos.requirements.map((req, i) => (
                          <span key={i} className="requirement-tag">{req}</span>
                        ))}
                      </div>
                    )}
                    <button className="btn btn-primary position-apply-btn"
                      onClick={() => { setApplyModal(pos); dispatch(resetApplyStatus()); setApplyForm({ name: '', email: '', phone: '' }); }}>
                      <Send size={14} /> Apply Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recruitment Process */}
          <EditableSection
            sectionId="process"
            data={sections.process}
            onSave={(data) => handleSaveSection('process', data)}
          >
            <div className="process-section">
              <h2 className="section-title">{sections.process.title}</h2>
              <div className="divider" />
              <div className="process-steps">
                {sections.process.steps?.map((step, i) => (
                  <div key={i} className="process-step glass-card">
                    <div className="process-num">{i + 1}</div>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </EditableSection>

          {/* CTA - Jamoamizga qo'shiling */}
          <EditableSection
            sectionId="join"
            data={sections.join}
            onSave={(data) => handleSaveSection('join', data)}
          >
            <div className="careers-cta glass-card">
              <h2 className="careers-cta-title">{sections.join.title}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>{sections.join.subtitle}</p>
            </div>
          </EditableSection>
        </div>
      </section>

      {/* Apply Modal */}
      {applyModal && (
        <div className="modal-overlay" onClick={() => { setApplyModal(null); dispatch(resetApplyStatus()); }}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setApplyModal(null); dispatch(resetApplyStatus()); }}>
              <X size={20} />
            </button>
            <div className="modal-header">
              <div className="modal-icon">📝</div>
              <h2 className="modal-title">Apply: {applyModal.title}</h2>
            </div>
            {applySuccess ? (
              <div className="modal-success">
                <div className="success-icon"><CheckCircle size={40} style={{ color: '#10b981' }} /></div>
                <p>Your application has been submitted successfully!</p>
              </div>
            ) : (
              <form className="modal-form" onSubmit={handleApply}>
                <div className="form-group">
                  <input className="form-input" placeholder="Full Name" value={applyForm.name}
                    onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <input className="form-input" type="email" placeholder="Email" value={applyForm.email}
                    onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <input className="form-input" type="tel" placeholder="Phone" value={applyForm.phone}
                    onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={applyLoading}>
                  {applyLoading ? 'Submitting…' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
