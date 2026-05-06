import { useLang } from '../../shared/i18n';
import './WhyChoose.css';

const icons = ['🌍', '🔬', '👨‍🏫', '❤️', '🎓', '🏫', '💻', '🤖'];

export default function WhyChoose() {
  const { t } = useLang();

  return (
    <section className="why-choose section">
      <div className="container">
        <div className="section-header center">
          <span className="section-label">TIS afzalliklari</span>
          <h2 className="why-choose-title">{t.whyChoose.title}</h2>
          <div className="divider center" />
        </div>

        <div className="why-grid">
          {t.whyChoose.items.map((item, i) => (
            <div key={i} className="why-card glass-card">
              <div className="why-icon">{icons[i]}</div>
              <p className="why-text">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
