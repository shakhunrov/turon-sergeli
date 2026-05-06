import { Link } from 'react-router-dom';
import { useLang } from '../../shared/i18n';
import { Phone, GraduationCap, MapPin } from 'lucide-react';
import './StickyCTA.css';

export default function StickyCTA() {
  const { t } = useLang();
  return (
    <div className="sticky-cta">
      <Link to="/admissions" className="sticky-cta-btn primary">
        <GraduationCap size={14} /> {t.sticky.consult}
      </Link>
      <Link to="/admissions" className="sticky-cta-btn">
        <GraduationCap size={14} /> {t.sticky.admission}
      </Link>
      <Link to="/contact" className="sticky-cta-btn">
        <MapPin size={14} /> {t.sticky.tour}
      </Link>
    </div>
  );
}
