import { useLang } from '../../shared/i18n';
import directorImg from '../../shared/assets/img/director.png';
import './AboutLeadership.css';

export default function AboutLeadership() {
  const { t } = useLang();
  const l = t.about.leadership;

  return (
    <div className="page">
      <div className="page-hero-simple">
        <div className="container">
          <span className="section-label">Biz haqimizda</span>
          <h1 className="section-title">{l.title}</h1>
          <div className="divider" />
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Director */}
          <div className="director-section">
            <div className="director-avatar-area">
              <div className="director-avatar">
                <img src={directorImg} alt={l.directorName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
              <div className="director-badge">
                <span className="badge badge-cyan">{l.directorTitle}</span>
              </div>
              <h2 className="director-name">{l.directorName}</h2>
            </div>
            <div className="director-message glass-card">
              <div className="quote-mark">"</div>
              <p className="director-text">{l.directorMessage}</p>
              <div className="director-sig">— {l.directorName}</div>
            </div>
          </div>

          {/* Advisory Board */}
          <div className="board-section">
            <h2 className="section-title">{l.boardTitle}</h2>
            <div className="divider" />
            <div className="board-desc glass-card">
              <p>{l.boardDesc}</p>
            </div>
            <div className="board-members">
              {['Board Member 1', 'Board Member 2', 'Board Member 3', 'Board Member 4'].map((m, i) => (
                <div key={i} className="board-card glass-card">
                  <div className="board-avatar">👤</div>
                  <div className="board-name">{m}</div>
                  <div className="board-role">Academic Advisor</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
