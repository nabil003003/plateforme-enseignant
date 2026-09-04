"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ExcelImportModal } from "@/components/ExcelImportModal";
import { AddStudentModal } from "@/components/AddStudentModal";
import { SafeUser } from "@/types";
import { sounds } from "@/lib/sound";
import { formatStudentCountArabic, formatDateArabic } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

interface StudentData {
  id: string;
  name: string;
  createdAt: string;
  selectionCount?: number;
}

interface ClassDetailData {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  students: StudentData[];
  rounds: {
    id: string;
    roundNumber: number;
    status: string;
  }[];
}

export default function ClassDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [classData, setClassData] = useState<ClassDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals
  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const [addStudentOpen, setAddStudentOpen] = useState(false);

  // Edit in place
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // Delete student
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null);
  const [deleteStudentName, setDeleteStudentName] = useState("");

  const fetchClass = useCallback(async () => {
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
      setClassData(data.class);
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    fetchClass();
  }, [fetchClass]);

  const handleSaveStudentName = async (studentId: string) => {
    if (!editName.trim()) return;
    sounds.playClick();

    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });

      if (res.ok) {
        setClassData((prev) =>
          prev
            ? {
                ...prev,
                students: prev.students.map((s) =>
                  s.id === studentId ? { ...s, name: editName.trim() } : s
                ),
              }
            : null
        );
        setEditingStudentId(null);
      }
    } catch {
      alert(lang === "fr" ? "Impossible de modifier le nom" : "تعذر تعديل الاسم");
    }
  };

  const handleDeleteStudent = async () => {
    if (!deleteStudentId) return;
    sounds.playClick();

    try {
      const res = await fetch(`/api/students/${deleteStudentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setClassData((prev) =>
          prev
            ? {
                ...prev,
                students: prev.students.filter((s) => s.id !== deleteStudentId),
              }
            : null
        );
        setDeleteStudentId(null);
      }
    } catch {
      alert(lang === "fr" ? "Impossible de supprimer l'élève" : "تعذر حذف التلميذ");
    }
  };

  if (loading || !classData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-xs font-bold text-slate-500 tracking-wider">
          {t.loading}
        </div>
      </div>
    );
  }

  const filteredStudents = classData.students.filter((s) =>
    s.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white" dir={t.direction}>
      <Navbar user={user} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/classes" className="hover:text-slate-900 dark:hover:text-white">
            {t.classes}
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-bold">{classData.name}</span>
        </div>

        {/* Class Overview Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">{classData.name}</h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                {lang === "fr" ? `${classData.students.length} élèves` : formatStudentCountArabic(classData.students.length)}
              </span>
            </div>
            {classData.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {classData.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/classes/${classData.id}/game`}
              onClick={() => sounds.playClick()}
              className="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold transition-colors shadow-sm"
            >
              {t.enterDrawSession}
            </Link>

            <button
              onClick={() => {
                sounds.playClick();
                setExcelModalOpen(true);
              }}
              className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {t.importExcelBtn}
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setAddStudentOpen(true);
              }}
              className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {t.addStudentBtn}
            </button>

            <Link
              href={`/classes/${classData.id}/history`}
              onClick={() => sounds.playClick()}
              className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {t.historyBtn}
            </Link>
          </div>
        </div>

        {/* Filter and Students Table */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Table Header Controls */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.officialRosterTitle} ({filteredStudents.length})
              </h2>
              <p className="text-[11px] text-slate-400">{t.rosterSubtitle}</p>
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchStudentPlaceholder}
                className="w-full px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Students Table Content */}
          {filteredStudents.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              {search ? t.noStudentsFound : t.emptyRosterNotice}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">{t.colIndex}</th>
                    <th className="py-3 px-4 text-start">{t.colStudentName}</th>
                    <th className="py-3 px-4 w-40 text-center">{t.colParticipationCount}</th>
                    <th className="py-3 px-4 w-40 text-start">{t.colEnrollmentDate}</th>
                    <th className="py-3 px-4 w-32 text-center">{t.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.map((student, idx) => (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 text-center text-slate-400 font-mono">
                        {idx + 1}
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white text-start">
                        {editingStudentId === student.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="px-2 py-1 rounded border border-slate-400 bg-white dark:bg-slate-800 text-xs"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveStudentName(student.id)}
                              className="px-2 py-1 bg-slate-900 text-white rounded text-[10px] font-bold"
                            >
                              {t.save}
                            </button>
                            <button
                              onClick={() => setEditingStudentId(null)}
                              className="px-2 py-1 border border-slate-300 rounded text-[10px]"
                            >
                              {t.cancel}
                            </button>
                          </div>
                        ) : (
                          <span>{student.name}</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                          {student.selectionCount || 0} {t.timesCount}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-400 text-start">
                        {lang === "fr" ? new Date(student.createdAt).toLocaleDateString("fr-FR") : formatDateArabic(student.createdAt)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              sounds.playClick();
                              setEditingStudentId(student.id);
                              setEditName(student.name);
                            }}
                            className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:underline"
                          >
                            {t.edit}
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            onClick={() => {
                              sounds.playClick();
                              setDeleteStudentId(student.id);
                              setDeleteStudentName(student.name);
                            }}
                            className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                          >
                            {t.delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Excel Import Modal */}
      <ExcelImportModal
        isOpen={excelModalOpen}
        classId={classData.id}
        className={classData.name}
        onClose={() => setExcelModalOpen(false)}
        onSuccess={fetchClass}
      />

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={addStudentOpen}
        classId={classData.id}
        onClose={() => setAddStudentOpen(false)}
        onSuccess={fetchClass}
      />

      {/* Delete Student Confirmation Modal */}
      {deleteStudentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {lang === "fr" ? "Supprimer l'élève" : "تأكيد حذف التلميذ"}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {lang === "fr"
                ? `Êtes-vous sûr de vouloir supprimer l'élève "${deleteStudentName}" de cette classe ?`
                : `هل أنت متأكد من رغبتك في حذف التلميذ "${deleteStudentName}" من لائحة هذا الفصل؟`}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setDeleteStudentId(null)}
                className="px-4 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDeleteStudent}
                className="px-4 py-1.5 rounded-md bg-rose-600 text-white text-xs font-bold"
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
