import { createContext, useContext, useMemo, useState } from "react";
import en from "./en.json";
import yo from "./yo.json";
import ig from "./ig.json";
import ha from "./ha.json";
import fr from "./fr.json";

export const LANGUAGES = {
  en: { label: "English", dict: en },
  yo: { label: "Yorùbá", dict: yo },
  ig: { label: "Igbo", dict: ig },
  ha: { label: "Hausa", dict: ha },
  fr: { label: "Français", dict: fr },
};

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("collabo-lang") || "en");

  const t = useMemo(() => {
    const dict = LANGUAGES[lang]?.dict || en;
    return (key) => dict[key] || en[key] || key;
  }, [lang]);

  const changeLang = (code) => {
    if (!LANGUAGES[code]) return;
    localStorage.setItem("collabo-lang", code);
    setLang(code);
  };

  return <I18nContext.Provider value={{ lang, t, setLang: changeLang, languages: LANGUAGES }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
