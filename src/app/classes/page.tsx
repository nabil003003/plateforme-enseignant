"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ClassCard } from "@/components/ClassCard";
import { CreateClassModal } from "@/components/CreateClassModal";
import { ClassItem, SafeUser } from "@/types";
import { sounds } from "@/lib/sound";
import { useLanguage } from "@/lib/i18n";

export default function ClassesPage() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");

  const fetchData = async () => {
    try {
      const authRes = await fetch("/api/auth/me");
      if (!authRes.ok) {
        router.push("/login");
        return;
      }
      const authData = await authRes.json();
      setUser(authData.user);

      const res = await fetch("/api/classes");
      if (res.ok) {
        const data = await res.json();
        setClasses(data.classes || []);
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    sounds.playClick();
    try {
      const res = await fetch(`/api/classes/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setClasses((prev) => prev.filter((c) => c.id !== deleteId));
        setDeleteId(null);
      }
    } catch {
      alert(lang === "fr" ? "Impossible de supprimer la classe" : "تعذر حذف الفصل");
    }
  };

  const filteredClasses = classes.filter((c) =>
    c.name.toLowerCase().includes(search.trim().toLowerCase())
  );

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-black">{t.classesDirectoryTitle}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.classesDirectoryDesc}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "fr" ? "Filtrer par nom..." : "تصفية بالاسم..."}
              className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none focus:ring-1 focus:ring-slate-900"
            />

            <button
              onClick={() => {
                sounds.playClick();
                setCreateModalOpen(true);
              }}
              className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 px-3.5 py-1.5 rounded-md font-bold text-xs transition-colors"
            >
              {t.newClass}
            </button>
          </div>
        </div>

        {filteredClasses.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 text-xs">
            {search ? (lang === "fr" ? "Aucune classe ne correspond à votre recherche." : "لم يتم العثور على فصول مطابقة لبحثك.") : t.noClassesYet}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map((c) => (
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

      <CreateClassModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchData}
      />

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.confirmDeleteClassTitle}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === "fr"
                ? `Êtes-vous sûr de vouloir supprimer la classe "${deleteName}" et tous ses élèves ?`
                : `هل أنت متأكد من حذف فصل "${deleteName}" وكافة سجلاته وتلاميذه؟`}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-md border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-md bg-rose-600 text-white text-xs font-bold"
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
