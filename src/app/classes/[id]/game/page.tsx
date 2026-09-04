"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RoulettePicker } from "@/components/RoulettePicker";
import { StudentItem, RoundDetail } from "@/types";
import { useLanguage } from "@/lib/i18n";

export default function GamePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [classItem, setClassItem] = useState<{ id: string; name: string; description: string | null } | null>(null);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [activeRound, setActiveRound] = useState<RoundDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGameData = useCallback(async () => {
    try {
      const authRes = await fetch("/api/auth/me");
      if (!authRes.ok) {
        router.push("/login");
        return;
      }

      const res = await fetch(`/api/classes/${params.id}/rounds`);
      if (!res.ok) {
        router.push("/classes");
        return;
      }

      const data = await res.json();
      setClassItem(data.class);
      setStudents(data.students);
      setActiveRound(data.activeRound);
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    fetchGameData();
  }, [fetchGameData]);

  if (loading || !classItem || !activeRound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white" dir={t.direction}>
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider">
          {t.gameLoadingNotice}
        </div>
      </div>
    );
  }

  // If no students in class yet
  if (students.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-4" dir={t.direction}>
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4 shadow-xl">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.noStudentsGameTitle}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {t.noStudentsGameDesc}
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href={`/classes/${classItem.id}`}
              className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 py-2.5 px-4 rounded-md font-bold text-xs transition-colors"
            >
              {t.goToClassRosterBtn}
            </Link>
            <Link
              href="/dashboard"
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-1"
            >
              {t.backToDashboardBtn}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RoulettePicker
      classItem={classItem}
      initialStudents={students}
      initialRound={activeRound}
      onExitGame={() => router.push(`/classes/${classItem.id}`)}
    />
  );
}
