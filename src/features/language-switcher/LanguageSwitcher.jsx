import { useLang } from '../../shared/i18n';
import './LanguageSwitcher.css';
import uzFlag from '../../shared/assets/flags/uz.svg';
import ruFlag from '../../shared/assets/flags/ru.svg';
import gbFlag from '../../shared/assets/flags/gb.svg';

const LANGS = [
  { code: 'uz', flag: uzFlag, name: "O'zbekcha" },
  { code: 'ru', flag: ruFlag, name: 'Русский' },
  { code: 'en', flag: gbFlag, name: 'English' },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div className="lang-switcher">
      {LANGS.map(({ code, flag, name }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`lang-btn ${lang === code ? 'active' : ''}`}
          title={name}
        >
          <img src={flag} alt={name} className="flag-img" />
        </button>
      ))}
    </div>
  );
}
