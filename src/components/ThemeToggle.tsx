"use client";

import { useEffect, useState } from "react";
import { sounds } from "@/lib/sound";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const updateThemeState = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };

    updateThemeState();
    window.addEventListener("themechange", updateThemeState);
    return () => window.removeEventListener("themechange", updateThemeState);
  }, []);

  const toggleTheme = () => {
    sounds.playClick();
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    const nextTheme = isCurrentlyDark ? "light" : "dark";
    setTheme(nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("picker_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("picker_theme", "light");
    }

    window.dispatchEvent(new Event("themechange"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 px-2.5 rounded-md text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
      title={theme === "light" ? "Mode Sombre / الوضع الليلي" : "Mode Clair / الوضع النهاري"}
      aria-label="Toggle Theme"
    >
      <span className="text-sm leading-none">{theme === "light" ? "🌙" : "☀️"}</span>
      <span className="text-[11px] hidden sm:inline font-bold">
        {theme === "light" ? "Sombre" : "Clair"}
      </span>
    </button>
  );
}
