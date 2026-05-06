import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLang } from '../../shared/i18n';
import LanguageSwitcher from '../../features/language-switcher/LanguageSwitcher';
import './Navbar.css';
import logo from "../../shared/assets/logo/turonLogo.png"

const navLinks = (t) => [
  { label: t.nav.home, href: '/' },
  {
    label: t.nav.about, href: '/about',
    children: [
      { label: t.nav.campus, href: '/about/campus' },
      { label: t.nav.vision, href: '/about/vision' },
      { label: t.nav.leadership, href: '/about/leadership' },
      { label: t.nav.whyTis, href: '/about/why-tis' },
    ],
  },
  { label: t.nav.education, href: '/education' },
  { label: t.nav.partnerships, href: '/partnerships' },
  { label: t.nav.careers, href: '/careers' },
  { label: t.nav.news, href: '/news' },
  { label: t.nav.admissions, href: '/admissions' },
  { label: t.nav.contact, href: '/contact' },
];

export default function Navbar() {
  const { t } = useLang();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); setDropdown(null); }, [location.pathname]);

  const links = navLinks(t);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
              <img  width={70} src={logo} alt=""/>
          </div>
          <div className="logo-text">
            <span className="logo-name">TURON</span>
            <span className="logo-sub">International School</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-links">
          {links.map((link) => (
            <div
              key={link.href}
              className="nav-item"
              onMouseEnter={() => link.children && setDropdown(link.href)}
              onMouseLeave={() => setDropdown(null)}
            >
              <Link
                to={link.href}
                className={`nav-link ${location.pathname === link.href || location.pathname.startsWith(link.href + '/') ? 'active' : ''}`}
              >
                {link.label}
                {link.children && <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{marginLeft:4}}><path d="M2 4l4 4 4-4"/></svg>}
              </Link>
              {link.children && dropdown === link.href && (
                <div className="nav-dropdown">
                  {link.children.map((child) => (
                    <Link key={child.href} to={child.href} className="nav-dropdown-item">
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right side */}
        <div className="navbar-right">
          <LanguageSwitcher />
          <Link to="/admissions" className="btn btn-primary btn-sm">
            {t.hero.apply}
          </Link>
          <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="mobile-menu">
          {links.map((link) => (
            <div key={link.href}>
              <Link to={link.href} className="mobile-link">{link.label}</Link>
              {link.children && link.children.map((child) => (
                <Link key={child.href} to={child.href} className="mobile-link mobile-link-sub">{child.label}</Link>
              ))}
            </div>
          ))}
          <LanguageSwitcher />
        </div>
      )}
    </header>
  );
}
