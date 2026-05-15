import { useState, useEffect } from 'react';
import { useLang } from '../../shared/i18n';
import { getPageSections } from '../../shared/api/pageSections';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import './Testimonials.css';

export default function Testimonials() {
  const { t, lang } = useLang();
  const branchId = localStorage.getItem('globalBranchId');
  const [idx, setIdx] = useState(0);

  const [section, setSection] = useState({
    label: 'Jamiyat',
    title: t.testimonials.title,
    items: t.testimonials.items,
  });

  useEffect(() => {
    const loadSection = async () => {
      try {
        const data = await getPageSections({ branch: branchId, page: 'testimonials' });
        if (data && data.length > 0) {
          const mainSection = data.find(s => s.section_id === 'main');
          if (mainSection) {
            try {
              const contentField = `content_${lang}`;
              let content = mainSection[contentField];

              if (typeof content === 'string') {
                content = JSON.parse(content);
              }

              if (content && Object.keys(content).length > 0) {
                setSection(prev => ({ ...prev, ...content }));
              }
            } catch (e) {
              console.error('Testimonials section parse error:', e);
            }
          }
        }
      } catch (error) {
        console.error('Testimonials ma\'lumotlarini yuklashda xatolik:', error);
      }
    };
    loadSection();
  }, [branchId, lang, t]);

  const items = section.items;
  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);
  const next = () => setIdx((i) => (i + 1) % items.length);

  return (
    <section className="testimonials section">
      <div className="container">
        <div className="section-header center">
          <span className="section-label">{section.label}</span>
          <h2 className="section-title">{section.title}</h2>
          <div className="divider center" />
        </div>

        <div className="testimonial-wrapper">
          <button className="testi-nav prev" onClick={prev}><ChevronLeft size={20} /></button>

          <div className="testimonial-card glass-card">
            <Quote size={36} className="testi-quote-icon" />
            <p className="testi-text">{items[idx]?.text}</p>
            <div className="testi-author">
              <div className="testi-avatar">{items[idx]?.name?.[0]}</div>
              <div>
                <div className="testi-name">{items[idx]?.name}</div>
                <div className="testi-role">{items[idx]?.role}</div>
              </div>
            </div>
          </div>

          <button className="testi-nav next" onClick={next}><ChevronRight size={20} /></button>
        </div>

        <div className="testi-dots">
          {items.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className={`testi-dot ${i === idx ? 'active' : ''}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
