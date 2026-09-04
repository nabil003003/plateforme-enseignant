"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { SafeUser } from "@/types";
import { formatDateArabic } from "@/lib/utils";
import { sounds } from "@/lib/sound";
import { useLanguage } from "@/lib/i18n";

interface SelectionItem {
  id: string;
  selectionOrder: number;
  selectedAt: string;
  student: {
    id: string;
    name: string;
  };
}

interface RoundItem {
  id: string;
  roundNumber: number;
  status: string;
  startedAt: string;
  completedAt: string | null;
  selections: SelectionItem[];
}

export default function HistoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [classItem, setClassItem] = useState<{ id: string; name: string } | null>(null);
  const [rounds, setRounds] = useState<RoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRoundId, setExpandedRoundId] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      const authRes = await fetch("/api/auth/me");
      if (!authRes.ok) {
        router.push("/login");
        return;
      }
      const auth = await authRes.json();
      setUser(auth.user);

      const res = await fetch(`/api/classes/${params.id}`);
      if (!res.ok) {
        router.push("/classes");
        return;
      }
      const data = await res.json();
      setClassItem(data.class);
      setRounds(data.class.rounds || []);

      if (data.class.rounds?.length > 0) {
        setExpandedRoundId(data.class.rounds[0].id);
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const toggleExpand = (id: string) => {
    sounds.playClick();
    setExpandedRoundId((prev) => (prev === id ? null : id));
  };

  if (loading || !classItem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-xs font-bold text-slate-500 tracking-wider">
          {t.loading}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white" dir={t.direction}>
      <Navbar user={user} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href={`/classes/${classItem.id}`} className="hover:text-slate-900 dark:hover:text-white">
            {classItem.name}
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-bold">{t.historyBreadcrumb}</span>
        </div>

        {/* Page Title */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-black">{t.historyTitle}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.historySubtitle}
            </p>
          </div>
        </div>

        {rounds.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-lg p-12 text-center border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            {t.noHistoryYet}
          </div>
        ) : (
          <div className="space-y-4">
            {rounds.map((round) => {
              const isExpanded = expandedRoundId === round.id;
              const isCompleted = round.status === "COMPLETED";

              return (
                <div
                  key={round.id}
                  className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
                >
                  <div
                    onClick={() => toggleExpand(round.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 select-none transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {t.roundPrefix(round.roundNumber)}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-bold ${
                          isCompleted
                            ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                            : "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                        }`}
                      >
                        {isCompleted ? t.roundStatusCompleted : t.roundStatusActive}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{t.selectedCountBadge(round.selections.length)}</span>
                      <span>
                        {t.startedAtLabel}:{" "}
                        {lang === "fr"
                          ? new Date(round.startedAt).toLocaleString("fr-FR")
                          : formatDateArabic(round.startedAt)}
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {isExpanded ? t.hideDetails : t.showDetails}
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {lang === "fr" ? "Ordre des passages horodatés :" : "ترتيب اختيار التلاميذ بالدقائق والثواني:"}
                      </div>

                      {round.selections.length === 0 ? (
                        <div className="text-xs text-slate-400 py-3 text-center">
                          {t.noSelectionsYetInRound}
                        </div>
                      ) : (
                        <div className="border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden bg-white dark:bg-slate-900">
                          <table className="w-full text-xs">
                            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                              <tr>
                                <th className="py-2.5 px-3 w-16 text-center">{t.roundOrderCol}</th>
                                <th className={`py-2.5 px-3 ${lang === "fr" ? "text-left" : "text-right"}`}>{t.roundStudentCol}</th>
                                <th className={`py-2.5 px-3 w-48 ${lang === "fr" ? "text-right" : "text-left"}`}>{t.roundTimestampCol}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {round.selections.map((selection) => (
                                <tr key={selection.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                  <td className="py-2 px-3 text-center font-bold text-slate-500">
                                    #{selection.selectionOrder}
                                  </td>
                                  <td className={`py-2 px-3 font-bold text-slate-900 dark:text-white ${lang === "fr" ? "text-left" : "text-right"}`} dir="auto">
                                    {selection.student.name}
                                  </td>
                                  <td className={`py-2 px-3 text-slate-400 ${lang === "fr" ? "text-right" : "text-left"}`} dir="ltr">
                                    {new Date(selection.selectedAt).toLocaleTimeString(lang === "fr" ? "fr-FR" : "ar-EG", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                    })}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
