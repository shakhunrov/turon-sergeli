import { useState, useEffect } from 'react';
import { useLang } from '../../shared/i18n';
import { getPageSections } from '../../shared/api/pageSections';
import './WhyChoose.css';

const icons = ['🌍', '🔬', '👨‍🏫', '❤️', '🎓', '🏫', '💻', '🤖'];

export default function WhyChoose() {
  const { t, lang } = useLang();
  const branchId = localStorage.getItem('globalBranchId');

  const [section, setSection] = useState({
    label: 'TIS afzalliklari',
    title: t.whyChoose.title,
    items: t.whyChoose.items.map((item, i) => ({ text: item, icon: icons[i] })),
  });

  useEffect(() => {
    const loadSection = async () => {
      try {
        const data = await getPageSections({ branch: branchId, page: 'why-choose' });
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
              console.error('WhyChoose section parse error:', e);
            }
          }
        }
      } catch (error) {
        console.error('WhyChoose ma\'lumotlarini yuklashda xatolik:', error);
      }
    };
    loadSection();
  }, [branchId, lang, t]);

  return (
    <section className="why-choose section">
      <div className="container">
        <div className="section-header center">
          <span className="section-label">{section.label}</span>
          <h2 className="why-choose-title">{section.title}</h2>
          <div className="divider center" />
        </div>

        <div className="why-grid">
          {section.items.map((item, i) => (
            <div key={i} className="why-card glass-card">
              <div className="why-icon">{item.icon}</div>
              <p className="why-text">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
