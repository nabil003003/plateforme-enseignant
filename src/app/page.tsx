"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SoundToggle } from "@/components/SoundToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { sounds } from "@/lib/sound";
import { useLanguage } from "@/lib/i18n";

export default function AcademicPortalHome() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            router.replace("/dashboard");
            return;
          }
        }
      } catch {
        // Not logged in
      } finally {
        setChecking(false);
      }
    }
    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950" dir={t.direction}>
        <div className="text-xs font-bold text-slate-500 tracking-wider">
          {t.loading}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-slate-800 selection:text-white" dir={t.direction}>
      {/* Institutional Top Bar */}
      <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t.portalTitle}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {t.portalSubtitle}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <SoundToggle />
            <ThemeToggle />
            <Link
              href="/login"
              onClick={() => sounds.playClick()}
              className="px-3.5 py-1.5 text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {t.login}
            </Link>
            <Link
              href="/register"
              onClick={() => sounds.playClick()}
              className="px-3.5 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-md transition-colors shadow-sm"
            >
              {t.register}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Institutional Mission Banner */}
        <section className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm space-y-6">
          <div className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-bold text-slate-700 dark:text-slate-300">
            {t.homeBadge}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
            {t.homeHeroTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {t.homeHeroDesc}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/login"
              onClick={() => sounds.playClick()}
              className="px-6 py-2.5 rounded-md text-sm font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 transition-colors shadow-sm"
            >
              {t.homeEnterWorkspace}
            </Link>
            <Link
              href="/register"
              onClick={() => sounds.playClick()}
              className="px-6 py-2.5 rounded-md text-sm font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t.homeCreateAccount}
            </Link>
          </div>
        </section>

        {/* Institutional Specifications */}
        <section className="space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.homeStandardsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-400 mb-1">{t.standard1Badge}</div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                {t.standard1Title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.standard1Desc}
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-400 mb-1">{t.standard2Badge}</div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                {t.standard2Title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.standard2Desc}
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-400 mb-1">{t.standard3Badge}</div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                {t.standard3Title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.standard3Desc}
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-400 mb-1">{t.standard4Badge}</div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                {t.standard4Title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.standard4Desc}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>{t.homeFooterText}</div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-800 dark:hover:text-slate-200">
              {t.homePrivacyLink}
            </Link>
            <Link href="/login" className="hover:text-slate-800 dark:hover:text-slate-200">
              {t.login}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
