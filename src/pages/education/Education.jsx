import { useLang } from '../../shared/i18n';
import './Education.css';

export default function Education() {
  const { t } = useLang();
  const e = t.education;

  return (
    <div className="page">
      <div className="page-hero-simple">
        <div className="container">
          <span className="section-label">Ta'lim</span>
          <h1 className="section-title">{e.title}</h1>
          <div className="divider" />
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Truth about education */}
          <div className="edu-truth glass-card">
            <div className="edu-truth-num">01</div>
            <div>
              <h2 className="edu-truth-title">{e.truthTitle}</h2>
              <p className="edu-truth-text">{e.truthText}</p>
            </div>
          </div>

          {/* Educational Approach */}
          <div className="edu-approach">
            <h2 className="section-title">{e.approachTitle}</h2>
            <div className="divider" />
            <p className="section-subtitle">{e.approachText}</p>
          </div>

          {/* Future Skills */}
          <div className="skills-section">
            <h2 className="section-title">{e.skillsTitle}</h2>
            <div className="divider" />
            <div className="skills-grid">
              {e.skills.map((skill, i) => (
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
            <h2 className="section-title">{e.classroomTitle || 'Ko\'nikmalar → Sinf amaliyoti'}</h2>
            <div className="divider" />
            <div className="classroom-table glass-card">
              <div className="classroom-header">
                <span>{e.classroomSkillLabel || 'Ko\'nikma'}</span>
                <span>{e.classroomPracticeLabel || 'Sinfda qanday ko\'rinadi'}</span>
              </div>
              {e.skills.map((skill) => (
                <div key={skill.title} className="classroom-row">
                  <span className="classroom-skill">{skill.title}</span>
                  <span className="classroom-practice">{skill.how}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assessment */}
          <div className="assess-section glass-card">
            <h2 className="assess-title">{e.assessTitle}</h2>
            <p className="assess-text">{e.assessText}</p>
          </div>

          {/* Curriculum */}
          <div className="curriculum-section">
            <h2 className="section-title">{e.curriculumTitle}</h2>
            <div className="divider" />
            <div className="curriculum-grid">
              {e.curricula.map((c, i) => (
                <div key={i} className="curriculum-card glass-card">
                  <span className="curriculum-icon">📋</span>
                  <span className="curriculum-name">{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Closing */}
          <div className="edu-closing glass-card">
            <h2 className="edu-closing-title">{e.closingTitle}</h2>
            <p className="edu-closing-text">{e.closingText}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
