import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLang } from '../../shared/i18n';
import {
  createContact,
  resetContactStatus,
  selectContactLoading,
  selectContactError,
  selectSubmitSuccess,
} from '../../features/contact';
import { useState } from 'react';
import './Contact.css';

export default function Contact() {
  const { t } = useLang();
  const c = t.contact;
  const dispatch = useDispatch();

  const loading = useSelector(selectContactLoading);
  const error = useSelector(selectContactError);
  const submitSuccess = useSelector(selectSubmitSuccess);
  const branchId = localStorage.getItem('globalBranchId');

  const [form, setForm] = useState({ name: '', email: '', message: '' });

  // Reset status on unmount
  useEffect(() => {
    return () => dispatch(resetContactStatus());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createContact({ ...form, branch: branchId }));
  };

  return (
    <div className="page">
      <div className="page-hero-simple">
        <div className="container">
          <span className="section-label">Bog'lanish</span>
          <h1 className="section-title">{c.title}</h1>
          <div className="divider" />
        </div>
      </div>

      <section className="section">
        <div className="container contact-grid">
          {/* Info */}
          <div className="contact-info">
            <h2 className="section-title" style={{ fontSize: '1.5rem' }}>{c.schoolName || 'TIS Sergeli'}</h2>
            <div className="divider" />
            {[
              { icon: '📍', label: c.address },
              { icon: '📧', label: c.email },
              { icon: '📞', label: c.phone },
            ].map((item) => (
              <div key={item.label} className="contact-info-item glass-card">
                <span className="contact-info-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}

            {/* Map placeholder */}
            <div className="map-placeholder glass-card">
              <div className="map-icon">🗺️</div>
              <p>{c.mapTitle || 'Sergeli, Tashkent Region'}</p>
              <a href="https://maps.app.goo.gl/PgHEEa95VYGmd5ow7" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: 13 }}>
                {c.openMap || 'Open in Google Maps'} →
              </a>
            </div>
          </div>

          {/* Partnership Form */}
          <div className="contact-form-area">
            <h2 className="section-title" style={{ fontSize: '1.5rem' }}>{c.partnershipTitle}</h2>
            <div className="divider" />
            <p className="section-subtitle" style={{ marginBottom: 32 }}>{c.partnershipDesc}</p>

            {submitSuccess ? (
              <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 16 }}>✅</div>
                <p style={{ color: 'var(--text-secondary)' }}>{c.form.success || "Rahmat! Tez orada siz bilan bog'lanamiz."}</p>
              </div>
            ) : (
              <form className="contact-form glass-card" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">{c.form.name}</label>
                  <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">{c.form.email}</label>
                  <input className="form-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">{c.form.message}</label>
                  <textarea className="form-input" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                </div>

                {error && (
                  <div style={{ color: '#e74c3c', fontSize: 14, marginBottom: 12 }}>
                    {typeof error === 'string' ? error : "Xatolik yuz berdi. Qaytadan urinib ko'ring."}
                  </div>
                )}

                <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }} disabled={loading}>
                  {loading ? 'Yuborilmoqda…' : `${c.form.submit} →`}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
