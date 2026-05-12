import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../../shared/i18n';
import LanguageSwitcher from '../../features/language-switcher/LanguageSwitcher';
import { MessageCircle, ExternalLink, Play, MapPin, Mail, Phone } from 'lucide-react';
import './Footer.css';
import logo from "../../shared/assets/logo/turonLogo.png"

export default function Footer() {
  const { t } = useLang();
  const location = useLocation();

  // Editable rejimda ekanligini aniqlash
  const isEditableMode = location.pathname.startsWith('/editable');
  const basePrefix = isEditableMode ? '/editable' : '';

  const quickLinks = [
    { label: t.nav.home, href: basePrefix + '/' },
    { label: t.nav.about, href: basePrefix + '/about/vision' },
    { label: t.nav.education, href: basePrefix + '/education' },
    { label: t.nav.partnerships, href: basePrefix + '/partnerships' },
    { label: t.nav.careers, href: basePrefix + '/careers' },
    { label: t.nav.news, href: basePrefix + '/news' },
    { label: t.nav.admissions, href: basePrefix + '/admissions' },
    { label: t.nav.contact, href: basePrefix + '/contact' },
  ];

  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="container footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
              <img width={70} src={logo} alt=""/>
            <div>
              <div className="footer-logo-name">TURON</div>
              <div className="footer-logo-sub">International School · Sergeli</div>
            </div>
          </div>
          <p className="footer-tagline">{t.footer.tagline}</p>
          <div className="footer-contact-items">
            <a href="https://maps.google.com" className="footer-contact-item" target="_blank" rel="noreferrer">
              <MapPin size={14} /> {t.contact.address}
            </a>
            <a href={`mailto:${t.contact.email}`} className="footer-contact-item">
              <Mail size={14} /> {t.contact.email}
            </a>
            <a href={`tel:${t.contact.phone}`} className="footer-contact-item">
              <Phone size={14} /> {t.contact.phone}
            </a>
          </div>
          <div className="footer-social">
            <a href="#" className="social-btn" aria-label="Instagram"><MessageCircle size={18} /></a>
            <a href="#" className="social-btn" aria-label="Telegram"><ExternalLink size={18} /></a>
            <a href="#" className="social-btn" aria-label="YouTube"><Play size={18} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">{t.footer.links}</h4>
          <ul className="footer-links-list">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link to={l.href} className="footer-link">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Accreditations & Lang */}
        <div className="footer-col">
          <h4 className="footer-col-title">{t.footer.accreditation}</h4>
          <div className="accreditation-badges">
            <div className="accred-badge">
              <span className="accred-icon">🎓</span>
              <span>Cambridge Assessment International Education</span>
            </div>
            <div className="accred-badge">
              <span className="accred-icon">🌐</span>
              <span>STEAM Certified</span>
            </div>
            <div className="accred-badge">
              <span className="accred-icon">🤖</span>
              <span>AI-Integrated Learning</span>
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>{t.footer.rights}</span>
          <div className="footer-policy-links">
            <Link to="/policies#privacy">{t.footer.policies}</Link>
            <Link to="/policies#safeguarding">{t.footer.safeguarding}</Link>
            <Link to="/policies#terms">{t.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
