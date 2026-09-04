"use client";

import { useEffect, useState } from "react";
import { Language, getInitialLanguage, setStoredLanguage } from "@/lib/i18n";
import { sounds } from "@/lib/sound";

export function LanguageToggle() {
  const [lang, setLang] = useState<Language>("ar");

  useEffect(() => {
    const current = getInitialLanguage();
    setLang(current);
    document.documentElement.lang = current;
    document.documentElement.dir = current === "ar" ? "rtl" : "ltr";
  }, []);

  const toggleLanguage = () => {
    sounds.playClick();
    const next: Language = lang === "ar" ? "fr" : "ar";
    setLang(next);
    setStoredLanguage(next);
    window.dispatchEvent(new Event("languagechange"));
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-2.5 py-1.5 rounded-md text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      title="Changer de langue / تغيير لغة المنظومة"
      aria-label="تبديل اللغة"
    >
      {lang === "ar" ? "Français" : "العربية"}
    </button>
  );
}
