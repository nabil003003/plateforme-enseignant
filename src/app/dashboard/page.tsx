"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ClassCard } from "@/components/ClassCard";
import { CreateClassModal } from "@/components/CreateClassModal";
import { ExcelImportModal } from "@/components/ExcelImportModal";
import { ClassItem, SafeUser } from "@/types";
import { sounds } from "@/lib/sound";
import { useLanguage } from "@/lib/i18n";

export default function DashboardPage() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [excelModalClass, setExcelModalClass] = useState<{ id: string; name: string } | null>(null);

  // Delete modal
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");

  const fetchData = useCallback(async () => {
    try {
      const authRes = await fetch("/api/auth/me");
      if (!authRes.ok) {
        router.push("/login");
        return;
      }
      const authData = await authRes.json();
      setUser(authData.user);

      const classesRes = await fetch("/api/classes");
      if (classesRes.ok) {
        const classesData = await classesRes.json();
        setClasses(classesData.classes || []);
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteClass = async () => {
    if (!deleteId) return;
    sounds.playClick();

    try {
      const res = await fetch(`/api/classes/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setClasses((prev) => prev.filter((c) => c.id !== deleteId));
        setDeleteId(null);
      }
    } catch {
      alert(lang === "fr" ? "Impossible de supprimer la classe" : "تعذر حذف الفصل");
    }
  };

  // Compute stats
  const totalClasses = classes.length;
  const totalStudents = classes.reduce((sum, c) => sum + (c._count?.students || 0), 0);
  const totalRounds = classes.reduce((sum, c) => sum + (c._count?.rounds || 0), 0);

  if (loading) {
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
      <Navbar user={user} onOpenCreateClass={() => setCreateModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Welcome Header */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
              {lang === "fr" ? "Espace Enseignant Agréé" : "فضاء المدرس المعتمد"}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {t.welcomeTeacher}, {user?.name || (lang === "fr" ? "Professeur" : "الأستاذ")}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.teacherSpaceDesc}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                setCreateModalOpen(true);
              }}
              className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-md font-bold text-xs transition-colors shadow-sm"
            >
              {t.newClass}
            </button>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.statsClasses}
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {totalClasses}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">{t.statsClassesSubtitle}</div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.statsStudents}
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {totalStudents}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">{t.statsStudentsSubtitle}</div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.statsRounds}
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {totalRounds}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">{t.statsRoundsSubtitle}</div>
          </div>
        </div>

        {/* Classes Section Header */}
        <div className="flex items-center justify-between pt-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.classesDirectoryTitle}
            </h2>
            <p className="text-xs text-slate-500">{t.classesDirectoryDesc}</p>
          </div>

          <Link
            href="/classes"
            className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-md"
          >
            {t.viewAll} ({classes.length})
          </Link>
        </div>

        {/* Classes List */}
        {classes.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              {t.noClassesYet}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {t.noClassesDesc}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCreateModalOpen(true)}
                className="px-5 py-2.5 rounded-md text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 transition-colors"
              >
                {t.addClassNow}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((c) => (
              <ClassCard
                key={c.id}
                classItem={c}
                onDelete={(id, name) => {
                  setDeleteId(id);
                  setDeleteName(name);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Class Modal */}
      <CreateClassModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchData}
      />

      {/* Excel Import Modal */}
      {excelModalClass && (
        <ExcelImportModal
          isOpen={true}
          classId={excelModalClass.id}
          className={excelModalClass.name}
          onClose={() => setExcelModalClass(null)}
          onSuccess={fetchData}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.confirmDeleteClassTitle}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {lang === "fr"
                ? `Êtes-vous sûr de vouloir supprimer la classe "${deleteName}" ? Tous ses élèves et historiques seront définitivement effacés.`
                : `هل أنت متأكد من رغبتك في حذف فصل "${deleteName}"؟ سيؤدي هذا الإجراء إلى حذف جميع بيانات التلاميذ وسجل الجولات المرتبطة به بشكل نهائي.`}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-md text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDeleteClass}
                className="px-5 py-2 rounded-md text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
