"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { SoundToggle } from "./SoundToggle";
import { LanguageToggle } from "./LanguageToggle";
import { sounds } from "@/lib/sound";
import { Language, translations, getInitialLanguage } from "@/lib/i18n";

interface NavbarProps {
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
  onOpenCreateClass?: () => void;
}

export function Navbar({ user, onOpenCreateClass }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<Language>("ar");

  useEffect(() => {
    setLang(getInitialLanguage());
    const onLangChange = () => setLang(getInitialLanguage());
    window.addEventListener("languagechange", onLangChange);
    return () => window.removeEventListener("languagechange", onLangChange);
  }, []);

  const t = translations[lang];

  const handleLogout = async () => {
    sounds.playClick();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      // Failed to logout
    }
  };

  const navLinks = [
    { href: "/dashboard", label: t.dashboard },
    { href: "/classes", label: t.classes },
    { href: "/settings", label: t.settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm" dir={t.direction}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex flex-col focus:outline-none"
            onClick={() => sounds.playClick()}
          >
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t.portalTitle}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {t.portalSubtitle}
            </span>
          </Link>

          {/* Desktop navigation */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => sounds.playClick()}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                      isActive
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user && onOpenCreateClass && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenCreateClass();
              }}
              className="hidden sm:inline-flex items-center bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 px-3 py-1.5 rounded-md text-xs font-bold transition-colors shadow-sm"
            >
              {t.newClass}
            </button>
          )}

          <LanguageToggle />
          <SoundToggle />
          <ThemeToggle />

          {user ? (
            <div className="hidden md:flex items-center gap-3 px-3 border-x border-slate-200 dark:border-slate-800 mx-1">
              <div className="leading-tight">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate max-w-[130px]">
                  {user.email}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title={t.logout}
              >
                {t.logout}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 transition-colors"
              >
                {t.login}
              </Link>
              <Link
                href="/register"
                className="px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-md transition-colors"
              >
                {t.register}
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          {user && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden px-2.5 py-1.5 text-xs font-bold border border-slate-300 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label={lang === "fr" ? "Menu" : "القائمة"}
            >
              {mobileOpen ? t.close : "..."}
            </button>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {user && mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  setMobileOpen(false);
                  sounds.playClick();
                }}
                className={`block px-3 py-2 rounded-md text-sm font-bold ${
                  isActive
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {onOpenCreateClass && (
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenCreateClass();
              }}
              className="w-full text-center bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-2 rounded-md text-sm font-bold mt-1"
            >
              {t.newClass}
            </button>
          )}

          <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-400">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 px-3 py-1.5 border border-rose-200 dark:border-rose-900 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              {t.logout}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
