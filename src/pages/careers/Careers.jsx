import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLang } from '../../shared/i18n';
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

export default function Careers() {
  const { t } = useLang();
  const c = t.careers;
  const dispatch = useDispatch();

  const positions = useSelector(selectPositions);
  const positionsLoading = useSelector(selectPositionsLoading);
  const applySuccess = useSelector(selectApplySuccess);
  const applyLoading = useSelector(selectApplicationsLoading);
  const branchId = localStorage.getItem("globalBranchId")
  const [applyModal, setApplyModal] = useState(null); // position object or null
  const [applyForm, setApplyForm] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    dispatch(fetchPositions({ branch: branchId }));
  }, [dispatch]);

  useEffect(() => {
    if (applySuccess) {
      // Auto-close after 2s
      const timer = setTimeout(() => {
        setApplyModal(null);
        dispatch(resetApplyStatus());
        setApplyForm({ name: '', email: '', phone: '' });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [applySuccess, dispatch]);

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
      <div className="page-hero-simple">
        <div className="container">
          <span className="section-label">Biz bilan ishlang</span>
          <h1 className="section-title">{c.title}</h1>
          <p className="section-subtitle" style={{ marginTop: 16 }}>{c.subtitle}</p>
          <div className="divider" />
        </div>
      </div>

      <section className="section">
        <div className="container">
          <p className="section-subtitle" style={{ marginBottom: 64, maxWidth: 700 }}>{c.intro}</p>

          {/* Why Work With Us */}
          <div className="careers-section">
            <h2 className="section-title">{c.whyTitle}</h2>
            <div className="divider" />
            <div className="why-grid-careers">
              {c.whyItems.map((item, i) => (
                <div key={i} className="why-career-card glass-card">
                  <span className="why-career-icon">{item.icon}</span>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Career Pathway */}
          <div className="pathway-section glass-card">
            <h2 className="pathway-title">{c.pathwayTitle}</h2>
            <div className="pathway-steps">
              {c.pathway.split(' → ').map((step, i, arr) => (
                <div key={i} className="pathway-step-wrapper">
                  <div className="pathway-step">{step}</div>
                  {i < arr.length - 1 && <span className="pathway-arrow">→</span>}
                </div>
              ))}
            </div>
          </div>

          {/* ═══ Open Positions from API ═══ */}
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
          <div className="process-section">
            <h2 className="section-title">{c.processTitle}</h2>
            <div className="divider" />
            <div className="process-steps">
              {c.process.map((step, i) => (
                <div key={i} className="process-step glass-card">
                  <div className="process-num">{i + 1}</div>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="careers-cta glass-card">
            <h2 className="careers-cta-title">{c.joinTitle}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>{c.joinSubtitle}</p>
          </div>
        </div>
      </section>

      {/* ═══ Apply Modal ═══ */}
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
