import { useState } from 'react';
import { useLang } from '../../shared/i18n';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import './Testimonials.css';

export default function Testimonials() {
  const { t } = useLang();
  const items = t.testimonials.items;
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);
  const next = () => setIdx((i) => (i + 1) % items.length);

  return (
    <section className="testimonials section">
      <div className="container">
        <div className="section-header center">
          <span className="section-label">Jamiyat</span>
          <h2 className="section-title">{t.testimonials.title}</h2>
          <div className="divider center" />
        </div>

        <div className="testimonial-wrapper">
          <button className="testi-nav prev" onClick={prev}><ChevronLeft size={20} /></button>

          <div className="testimonial-card glass-card">
            <Quote size={36} className="testi-quote-icon" />
            <p className="testi-text">{items[idx].text}</p>
            <div className="testi-author">
              <div className="testi-avatar">{items[idx].name[0]}</div>
              <div>
                <div className="testi-name">{items[idx].name}</div>
                <div className="testi-role">{items[idx].role}</div>
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
