import { useState } from 'react';
import { useLang } from '../../shared/i18n';
import AdmissionModal from '../../features/admission-modal/AdmissionModal';
import './Admissions.css';

export default function Admissions() {
  const { t } = useLang();
  const a = t.admissions;
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="page">
      <div className="page-hero-simple">
        <div className="container">
          <span className="section-label">Ro'yxatdan o'tish</span>
          <h1 className="section-title">{a.title}</h1>
          <div className="divider" />
          <p className="section-subtitle">{a.subtitle}</p>
        </div>
      </div>

      <section className="section">
        <div className="container admissions-center">
          <div className="school-card glass-card">
            <div className="school-card-img">🏫</div>
            <div className="school-card-body">
              <h2 className="school-card-name">{a.schoolCard.name}</h2>
              <div className="school-card-infos">
                <div className="school-card-info">
                  <span className="info-icon">📍</span>
                  <span>{a.schoolCard.location}</span>
                </div>
                <div className="school-card-info">
                  <span className="info-icon">🎂</span>
                  <span>{a.schoolCard.ageRange}</span>
                </div>
                <div className="school-card-info">
                  <span className="info-icon">📚</span>
                  <span>{a.schoolCard.curriculum}</span>
                </div>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                onClick={() => setShowModal(true)}
              >
                {a.applyBtn} →
              </button>
            </div>
          </div>

          <div className="admission-steps">
            <h2 className="section-title">{a.howToApply}</h2>
            <div className="divider" />
            {a.steps.map((step, i) => (
              <div key={i} className="step-item glass-card">
                <div className="step-num">{i + 1}</div>
                <p className="step-text">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showModal && <AdmissionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
