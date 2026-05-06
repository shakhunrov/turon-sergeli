import { createContext, useContext, useState } from 'react';
import en from './en';
import ru from './ru';
import uz from './uz';

const translations = { en, ru, uz };
const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState('uz');
  const t = translations[lang];
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
