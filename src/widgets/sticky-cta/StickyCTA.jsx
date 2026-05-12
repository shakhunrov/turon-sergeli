import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../../shared/i18n';
import { Phone, GraduationCap, MapPin } from 'lucide-react';
import './StickyCTA.css';

export default function StickyCTA() {
  const { t } = useLang();
  const location = useLocation();

  // Editable rejimda ekanligini aniqlash
  const isEditableMode = location.pathname.startsWith('/editable');
  const basePrefix = isEditableMode ? '/editable' : '';

  return (
    <div className="sticky-cta">
      <Link to={basePrefix + "/admissions"} className="sticky-cta-btn primary">
        <GraduationCap size={14} /> {t.sticky.consult}
      </Link>
      <Link to={basePrefix + "/admissions"} className="sticky-cta-btn">
        <GraduationCap size={14} /> {t.sticky.admission}
      </Link>
      <Link to={basePrefix + "/contact"} className="sticky-cta-btn">
        <MapPin size={14} /> {t.sticky.tour}
      </Link>
    </div>
  );
}
