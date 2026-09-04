"use client";

import Link from "next/link";
import { ClassItem } from "@/types";
import { sounds } from "@/lib/sound";
import { formatStudentCountArabic, formatDateArabic } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

interface ClassCardProps {
  classItem: ClassItem;
  onDelete: (id: string, name: string) => void;
}

export function ClassCard({ classItem, onDelete }: ClassCardProps) {
  const { lang, t } = useLanguage();
  const studentCount = classItem._count?.students || 0;
  const latestRound = classItem.latestRound;

  return (
    <div
      className="bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-400 dark:hover:border-slate-600 transition-colors flex flex-col justify-between"
      dir={t.direction}
    >
      <div>
        {/* Top header & badges */}
        <div className="flex items-start justify-between gap-3 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            {t.classCardBadge}
          </span>

          <div>
            {latestRound ? (
              <span
                className={`text-xs px-2 py-0.5 rounded font-bold ${
                  latestRound.status === "ACTIVE"
                    ? "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                    : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                }`}
              >
                {t.roundNumber} {latestRound.roundNumber} ({latestRound.status === "ACTIVE" ? t.roundStatusActive : t.roundStatusCompleted})
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                {t.noRoundsYet}
              </span>
            )}
          </div>
        </div>

        {/* Title and description */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
          {classItem.name}
        </h3>

        {classItem.description ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {classItem.description}
          </p>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">
            {lang === "fr" ? "Aucune description" : "لا يوجد وصف مسجل للفصل"}
          </p>
        )}

        {/* Stats */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 py-2.5 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-slate-400 ml-1 mr-1">{t.studentCountLabel}:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {lang === "fr" ? `${studentCount} élève${studentCount > 1 ? "s" : ""}` : formatStudentCountArabic(studentCount)}
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            {lang === "fr" ? `Màj : ${new Date(classItem.updatedAt).toLocaleDateString("fr-FR")}` : `آخر تحديث: ${formatDateArabic(classItem.updatedAt)}`}
          </div>
        </div>
      </div>

      {/* Card actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <Link
          href={`/classes/${classItem.id}/game`}
          onClick={() => sounds.playClick()}
          className="flex-1 text-center bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 py-2 px-3 rounded-md text-xs font-bold transition-colors"
        >
          {t.enterDrawSession}
        </Link>

        <Link
          href={`/classes/${classItem.id}`}
          onClick={() => sounds.playClick()}
          className="py-2 px-3 rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
        >
          {t.manageRoster}
        </Link>

        <button
          onClick={() => {
            sounds.playClick();
            onDelete(classItem.id, classItem.name);
          }}
          className="py-2 px-2.5 rounded-md border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors"
        >
          {t.delete}
        </button>
      </div>
    </div>
  );
}
