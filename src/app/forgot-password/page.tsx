"use client";

import { useState } from "react";
import Link from "next/link";
import { sounds } from "@/lib/sound";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/lib/i18n";

export default function ForgotPasswordPage() {
  const { lang, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    sounds.playClick();

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (lang === "fr" ? "Impossible d'envoyer la demande" : "تعذر إرسال الطلب"));
      }

      sounds.playWin();
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : (lang === "fr" ? "Une erreur est survenue" : "حدث خطأ أثناء معالجة الطلب"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-4 sm:p-8" dir={t.direction}>
      <div className="flex items-center justify-between max-w-md mx-auto w-full">
        <Link
          href="/"
          onClick={() => sounds.playClick()}
          className="flex flex-col focus:outline-none"
        >
          <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
            {t.portalTitle}
          </span>
          <span className="block text-[10px] text-slate-500">{t.portalSubtitle}</span>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.forgotPasswordTitle}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.forgotPasswordSubtitle}
            </p>
          </div>

          {submitted ? (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold leading-relaxed">
                {t.forgotPasswordSuccess}
              </div>
              <Link
                href="/login"
                className="block w-full py-2.5 px-4 text-center rounded-md text-sm font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 transition-colors"
              >
                {t.backToLoginBtn}
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 text-xs font-semibold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.loginEmailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none"
                    dir="ltr"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 px-4 rounded-md text-sm font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 transition-colors disabled:opacity-50"
                >
                  {loading ? t.forgotPasswordSending : t.forgotPasswordSubmitBtn}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  {t.backToLoginBtn}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 py-4">
        {t.portalTitle} — {t.portalSubtitle}
      </div>
    </div>
  );
}
