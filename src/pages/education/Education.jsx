import { useState, useEffect } from 'react';
import { useLang } from '../../shared/i18n';
import { getPageSections } from '../../shared/api/pageSections';
import './Education.css';

export default function Education() {
  const { t, lang } = useLang();
  const e = t.education;
  const branchId = localStorage.getItem('globalBranchId');

  const [sections, setSections] = useState({
    hero: {
      label: 'Ta\'lim',
      title: e.title,
    },
    truth: {
      num: '01',
      title: e.truthTitle,
      text: e.truthText,
    },
    approach: {
      title: e.approachTitle,
      text: e.approachText,
    },
    skills: {
      title: e.skillsTitle,
      skills: e.skills,
    },
    classroom: {
      title: e.classroomTitle || 'Ko\'nikmalar → Sinf amaliyoti',
      skillLabel: e.classroomSkillLabel || 'Ko\'nikma',
      practiceLabel: e.classroomPracticeLabel || 'Sinfda qanday ko\'rinadi',
    },
    assessment: {
      title: e.assessTitle,
      text: e.assessText,
    },
    curriculum: {
      title: e.curriculumTitle,
      curricula: e.curricula,
    },
    closing: {
      title: e.closingTitle,
      text: e.closingText,
    },
  });

  useEffect(() => {
    const loadSections = async () => {
      try {
        const data = await getPageSections({ branch: branchId, page: 'education' });
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
  }, [branchId, lang, e]);

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
          {/* Truth about education */}
          <div className="edu-truth glass-card">
            <div className="edu-truth-num">{sections.truth.num}</div>
            <div>
              <h2 className="edu-truth-title">{sections.truth.title}</h2>
              <p className="edu-truth-text">{sections.truth.text}</p>
            </div>
          </div>

          {/* Educational Approach */}
          <div className="edu-approach">
            <h2 className="section-title">{sections.approach.title}</h2>
            <div className="divider" />
            <p className="section-subtitle">{sections.approach.text}</p>
          </div>

          {/* Future Skills */}
          <div className="skills-section">
            <h2 className="section-title">{sections.skills.title}</h2>
            <div className="divider" />
            <div className="skills-grid">
              {sections.skills.skills.map((skill, i) => (
                <div key={i} className="skill-card glass-card">
                  <div className="skill-icon">{skill.icon}</div>
                  <h3 className="skill-title">{skill.title}</h3>
                  <p className="skill-desc">{skill.desc}</p>
                  <div className="skill-how">
                    <span className="skill-how-label">How:</span> {skill.how}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills → Classroom table */}
          <div className="classroom-section">
            <h2 className="section-title">{sections.classroom.title}</h2>
            <div className="divider" />
            <div className="classroom-table glass-card">
              <div className="classroom-header">
                <span>{sections.classroom.skillLabel}</span>
                <span>{sections.classroom.practiceLabel}</span>
              </div>
              {sections.skills.skills.map((skill) => (
                <div key={skill.title} className="classroom-row">
                  <span className="classroom-skill">{skill.title}</span>
                  <span className="classroom-practice">{skill.how}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assessment */}
          <div className="assess-section glass-card">
            <h2 className="assess-title">{sections.assessment.title}</h2>
            <p className="assess-text">{sections.assessment.text}</p>
          </div>

          {/* Curriculum */}
          <div className="curriculum-section">
            <h2 className="section-title">{sections.curriculum.title}</h2>
            <div className="divider" />
            <div className="curriculum-grid">
              {sections.curriculum.curricula.map((c, i) => (
                <div key={i} className="curriculum-card glass-card">
                  <span className="curriculum-icon">📋</span>
                  <span className="curriculum-name">{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Closing */}
          <div className="edu-closing glass-card">
            <h2 className="edu-closing-title">{sections.closing.title}</h2>
            <p className="edu-closing-text">{sections.closing.text}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
