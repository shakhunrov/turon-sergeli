import { useState, useEffect } from 'react';
import { useLang } from '../../shared/i18n';
import { getPageSections } from '../../shared/api/pageSections';
import directorImg from '../../shared/assets/img/director.png';
import './AboutLeadership.css';

export default function AboutLeadership() {
  const { t, lang } = useLang();
  const l = t.about.leadership;
  const branchId = localStorage.getItem('globalBranchId');

  const [sections, setSections] = useState({
    hero: {
      label: 'Biz haqimizda',
      title: l.title,
    },
    director: {
      name: l.directorName,
      title: l.directorTitle,
      message: l.directorMessage,
      image: directorImg,
    },
    board: {
      title: l.boardTitle,
      desc: l.boardDesc,
      members: [
        { name: 'Board Member 1', role: 'Academic Advisor' },
        { name: 'Board Member 2', role: 'Academic Advisor' },
        { name: 'Board Member 3', role: 'Academic Advisor' },
        { name: 'Board Member 4', role: 'Academic Advisor' },
      ],
    },
  });

  useEffect(() => {
    const loadSections = async () => {
      try {
        const data = await getPageSections({ branch: branchId, page: 'about-leadership' });
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

                if (section.image) {
                  loadedSections[section.section_id].image = section.image;
                }
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
  }, [branchId, lang, l]);

  return (
    <div className="page">
      <div className="page-hero-simple">
        <div className="container">
          <span className="section-label">{sections.hero.label}</span>
          <h1 className="section-title">{sections.hero.title}</h1>
          <div className="divider" />
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Director */}
          <div className="director-section">
            <div className="director-avatar-area">
              <div className="director-avatar">
                <img
                  src={typeof sections.director.image === 'string' ? sections.director.image : directorImg}
                  alt={sections.director.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              </div>
              <div className="director-badge">
                <span className="badge badge-cyan">{sections.director.title}</span>
              </div>
              <h2 className="director-name">{sections.director.name}</h2>
            </div>
            <div className="director-message glass-card">
              <div className="quote-mark">"</div>
              <p className="director-text">{sections.director.message}</p>
              <div className="director-sig">— {sections.director.name}</div>
            </div>
          </div>

          {/* Advisory Board */}
          <div className="board-section">
            <h2 className="section-title">{sections.board.title}</h2>
            <div className="divider" />
            <div className="board-desc glass-card">
              <p>{sections.board.desc}</p>
            </div>
            <div className="board-members">
              {sections.board.members.map((m, i) => (
                <div key={i} className="board-card glass-card">
                  <div className="board-avatar">👤</div>
                  <div className="board-name">{m.name}</div>
                  <div className="board-role">{m.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
