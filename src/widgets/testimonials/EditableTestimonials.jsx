import { useState } from 'react';
import { useLang } from '../../shared/i18n';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { EditableSection, EditableList } from '../../shared/editable';
import { useEditableSections } from '../../shared/api/useEditableSections';
import './Testimonials.css';

export default function EditableTestimonials() {
  const { t } = useLang();
  const [idx, setIdx] = useState(0);

  const { sections, handleSaveSection } = useEditableSections('testimonials', {
    main: {
      label: 'Jamiyat',
      title: t.testimonials.title,
      items: t.testimonials.items,
    },
  });

  const items = sections.main.items;
  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);
  const next = () => setIdx((i) => (i + 1) % items.length);

  return (
    <EditableSection
      sectionId="main"
      data={sections.main}
      onSave={(data) => handleSaveSection('main', data)}
    >
      <section className="testimonials section">
        <div className="container">
          <div className="section-header center">
            <span className="section-label">{sections.main.label}</span>
            <h2 className="section-title">{sections.main.title}</h2>
            <div className="divider center" />
          </div>

          <div className="testimonial-wrapper">
            <button className="testi-nav prev" onClick={prev}><ChevronLeft size={20} /></button>

            <div className="testimonial-card glass-card" style={{ position: 'relative' }}>
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

          {/* Editable List for managing testimonials */}
          <div style={{ marginTop: 40 }}>
            <EditableList
              items={items}
              onSave={(newItems) => {
                handleSaveSection('main', { ...sections.main, items: newItems });
                if (idx >= newItems.length) setIdx(0);
              }}
              renderItem={(item) => (
                <div className="testimonial-card glass-card" style={{ marginBottom: 16 }}>
                  <Quote size={24} className="testi-quote-icon" />
                  <p className="testi-text" style={{ fontSize: 14 }}>{item.text}</p>
                  <div className="testi-author">
                    <div className="testi-avatar">{item.name?.[0]}</div>
                    <div>
                      <div className="testi-name">{item.name}</div>
                      <div className="testi-role">{item.role}</div>
                    </div>
                  </div>
                </div>
              )}
              defaultItem={{ icon: '', name: '', role: '', text: '' }}
              itemName="Fikr"
            />
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
