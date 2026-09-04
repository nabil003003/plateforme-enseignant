"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { SafeUser } from "@/types";
import { sounds } from "@/lib/sound";
import { useLanguage } from "@/lib/i18n";

export default function SettingsPage() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Preferences
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState<"fast" | "normal" | "slow">("normal");

  // Account profile
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingAccount, setSavingAccount] = useState(false);
  const [accountSuccess, setAccountSuccess] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);

  // Danger zone
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const requiredPhrase = lang === "fr" ? "supprimer mon compte" : "حذف حسابي";

  useEffect(() => {
    async function loadData() {
      try {
        const authRes = await fetch("/api/auth/me");
        if (!authRes.ok) {
          router.push("/login");
          return;
        }
        const data = await authRes.json();
        setUser(data.user);
        setName(data.user.name);

        const settingsRes = await fetch("/api/settings");
        if (settingsRes.ok) {
          const sData = await settingsRes.json();
          if (sData.settings) {
            setTheme(sData.settings.theme || "system");
            setSoundEnabled(sData.settings.soundEnabled ?? true);
            setAnimationSpeed(sData.settings.animationSpeed || "normal");
          }
        }
      } catch {
        // Error
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
    sounds.playClick();
    setTheme(newTheme);
    localStorage.setItem("picker_theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: newTheme }),
    });
  };

  const handleSoundChange = async (enabled: boolean) => {
    setSoundEnabled(enabled);
    sounds.setEnabled(enabled);
    if (enabled) sounds.playClick();

    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ soundEnabled: enabled }),
    });
  };

  const handleSpeedChange = async (speed: "fast" | "normal" | "slow") => {
    sounds.playClick();
    setAnimationSpeed(speed);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ animationSpeed: speed }),
    });
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAccount(true);
    setAccountSuccess(null);
    setAccountError(null);
    sounds.playClick();

    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (lang === "fr" ? "Impossible d'enregistrer les modifications" : "تعذر حفظ التغييرات"));
      }

      sounds.playWin();
      setAccountSuccess(t.settingsProfileSuccess);
      setCurrentPassword("");
      setNewPassword("");
      if (data.user) {
        setUser(data.user);
      }
    } catch (err: unknown) {
      setAccountError(err instanceof Error ? err.message : (lang === "fr" ? "Une erreur est survenue" : "حدث خطأ أثناء الحفظ"));
    } finally {
      setSavingAccount(false);
    }
  };

  const handleDeleteAccount = async () => {
    const trimmed = deleteConfirmText.trim().toLowerCase();
    if (trimmed !== "حذف حسابي" && trimmed !== "supprimer mon compte") {
      setDeleteError(t.settingsDeleteMismatchError);
      return;
    }

    setDeletingAccount(true);
    setDeleteError(null);
    sounds.playClick();

    try {
      const res = await fetch("/api/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmationText: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || (lang === "fr" ? "Impossible de supprimer le compte" : "تعذر حذف الحساب"));
      }

      router.push("/login");
      router.refresh();
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : (lang === "fr" ? "Une erreur est survenue" : "حدث خطأ أثناء الحذف"));
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950" dir={t.direction}>
        <div className="text-xs font-bold text-slate-500 tracking-wider">
          {t.loading}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white" dir={t.direction}>
      <Navbar user={user} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h1 className="text-2xl font-black">{t.settingsTitle}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.settingsSubtitle}
          </p>
        </div>

        {/* Section 1: System Preferences */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.settingsSec1Title}
            </h2>
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.settingsThemeLabel}
            </label>
            <div className="grid grid-cols-3 gap-2 max-w-sm">
              <button
                type="button"
                onClick={() => handleThemeChange("light")}
                className={`py-2 px-3 rounded-md text-xs font-semibold border transition-colors ${
                  theme === "light"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 font-bold"
                    : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {t.themeLightText}
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange("dark")}
                className={`py-2 px-3 rounded-md text-xs font-semibold border transition-colors ${
                  theme === "dark"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 font-bold"
                    : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {t.themeDarkText}
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange("system")}
                className={`py-2 px-3 rounded-md text-xs font-semibold border transition-colors ${
                  theme === "system"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 font-bold"
                    : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {t.themeSystemText}
              </button>
            </div>
          </div>

          {/* Sound */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.settingsSoundLabel}
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSoundChange(true)}
                className={`py-1.5 px-3 rounded-md text-xs font-semibold border transition-colors ${
                  soundEnabled
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 font-bold"
                    : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {t.soundEnableBtn}
              </button>
              <button
                type="button"
                onClick={() => handleSoundChange(false)}
                className={`py-1.5 px-3 rounded-md text-xs font-semibold border transition-colors ${
                  !soundEnabled
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 font-bold"
                    : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {t.soundMuteBtn}
              </button>
            </div>
          </div>

          {/* Animation Speed */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.settingsSpeedLabel}
            </label>
            <div className="grid grid-cols-3 gap-2 max-w-sm">
              <button
                type="button"
                onClick={() => handleSpeedChange("fast")}
                className={`py-1.5 px-3 rounded-md text-xs font-semibold border transition-colors ${
                  animationSpeed === "fast"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 font-bold"
                    : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {t.speedFastOption}
              </button>
              <button
                type="button"
                onClick={() => handleSpeedChange("normal")}
                className={`py-1.5 px-3 rounded-md text-xs font-semibold border transition-colors ${
                  animationSpeed === "normal"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 font-bold"
                    : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {t.speedNormalOption}
              </button>
              <button
                type="button"
                onClick={() => handleSpeedChange("slow")}
                className={`py-1.5 px-3 rounded-md text-xs font-semibold border transition-colors ${
                  animationSpeed === "slow"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 font-bold"
                    : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {t.speedSlowOption}
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Account Details */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.settingsSec2Title}
            </h2>
          </div>

          {accountSuccess && (
            <div className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              {accountSuccess}
            </div>
          )}

          {accountError && (
            <div className="p-3 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 text-xs font-semibold">
              {accountError}
            </div>
          )}

          <form onSubmit={handleSaveAccount} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.settingsNameLabel}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-1 focus:ring-slate-900 outline-none"
                dir="auto"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.settingsEmailLabel}
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500 text-xs cursor-not-allowed"
                dir="ltr"
              />
              <span className="text-[10px] text-slate-400">{t.settingsEmailSecurityNotice}</span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.settingsPasswordSectionLabel}
              </label>
              <div className="space-y-2">
                <input
                  type="password"
                  placeholder={t.settingsCurrentPasswordPlaceholder}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-1 focus:ring-slate-900 outline-none"
                  dir="ltr"
                />
                <input
                  type="password"
                  placeholder={t.settingsNewPasswordPlaceholder}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-1 focus:ring-slate-900 outline-none"
                  dir="ltr"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingAccount}
              className="px-5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold transition-colors disabled:opacity-50"
            >
              {savingAccount ? t.settingsSavingBtn : t.settingsSaveBtn}
            </button>
          </form>
        </div>

        {/* Section 3: Danger Zone */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-rose-200 dark:border-rose-900/40 p-6 shadow-sm space-y-4">
          <div className="border-b border-rose-100 dark:border-rose-900/40 pb-3">
            <h2 className="text-sm font-bold text-rose-700 dark:text-rose-400">
              {t.settingsSec3Title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.settingsDangerDesc}
            </p>
          </div>

          {deleteError && (
            <div className="p-3 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 text-xs font-semibold">
              {deleteError}
            </div>
          )}

          <div className="space-y-3 max-w-md">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {t.settingsDeletePrompt}
              <br />
              <strong className="text-rose-600 dark:text-rose-400 select-all">{requiredPhrase}</strong>
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder={t.settingsDeletePlaceholder}
              className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none focus:ring-1 focus:ring-rose-500"
              dir="auto"
            />
            <button
              type="button"
              disabled={deletingAccount || deleteConfirmText.trim().toLowerCase() !== requiredPhrase}
              onClick={handleDeleteAccount}
              className="px-4 py-2 rounded-md bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 disabled:opacity-40 transition-colors"
            >
              {deletingAccount ? t.settingsDeletingBtn : t.settingsDeleteBtn}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
