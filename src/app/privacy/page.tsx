"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function PrivacyPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white py-12 px-4 sm:px-6 lg:px-8" dir={t.direction}>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <Link
            href="/"
            className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-md"
          >
            {lang === "fr" ? "← Retour au portail" : "العودة للبوابة الرئيسية"}
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {lang === "fr"
                ? "Charte de confidentialité et de protection des données"
                : "ميثاق خصوصية وأمان بيانات المتعلمين"}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {lang === "fr"
                ? "Dispositions techniques et éthiques pour la protection des données pédagogiques"
                : "الضوابط المهنية والتقنية المعتمدة لحماية البيانات التربوية"}
            </p>
          </div>

          <div className="space-y-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <section className="space-y-1.5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === "fr" ? "1. Confidentialité absolue des données élèves" : "1. قدسية وسرية بيانات التلاميذ"}
              </h2>
              <p>
                {lang === "fr"
                  ? "Les noms des élèves et les listes de classe importées sont traités comme des informations strictement professionnelles et pédagogiques. Ces données sont utilisées exclusivement au sein de la classe pour effectuer les tirages et évaluations, sans aucune transmission ni utilisation commerciale."
                  : "تُعامل أسماء التلاميذ ولوائح الفصول المستوردة كبيانات مهنية وتربوية خاصة. تُستخدم هذه البيانات حصرياً داخل القسم لإجراء عمليات السحب والتقويم والمشاركة الصفية، ولا يتم نشرها أو تصديرها أو استخدامها لأي غرض تجاري أو إعلاني."}
              </p>
            </section>

            <section className="space-y-1.5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === "fr" ? "2. Isolation étanche des comptes enseignants" : "2. عزل حسابات الأطر التربوية"}
              </h2>
              <p>
                {lang === "fr"
                  ? "La base de données applique des règles strictes de partitionnement : aucun enseignant ne peut accéder aux classes, élèves ou historiques d'un autre utilisateur. Les mots de passe sont chiffrés selon les standards de l'art."
                  : "تخضع قاعدة البيانات لقواعد أمان وعزل صارمة؛ حيث لا يمكن لأي أستاذ الاطلاع على فصول أو بيانات أو سجلات أستاذ آخر، ويتم تخزين كلمات المرور بتشفير قياسي معتمد."}
              </p>
            </section>

            <section className="space-y-1.5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === "fr" ? "3. Traitement des fichiers Excel" : "3. معالجة ملفات Excel"}
              </h2>
              <p>
                {lang === "fr"
                  ? "Les tableurs Excel importés sont analysés pour en extraire les noms des élèves uniquement. Aucun fichier source n'est stocké sur le serveur après importation."
                  : "تتم معالجة ملفات Excel المرفوعة لتحليل الأسماء فقط وإدراجها ضمن الفصل المحدد. لا يتم الاحتفاظ بنسخ من الملفات الأصلية بعد اكتمال الاستيراد."}
              </p>
            </section>

            <section className="space-y-1.5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === "fr" ? "4. Droit de rectification et de suppression" : "4. حق مسح وتعديل البيانات"}
              </h2>
              <p>
                {lang === "fr"
                  ? "L'enseignant dispose à tout moment du droit de modifier le nom d'un élève, de supprimer une classe ou de purger définitivement son compte et toutes ses données depuis l'onglet Paramètres."
                  : "يحتفظ الأستاذ بكامل الصلاحية لتعديل أسماء المتعلمين، حذف الفصول، أو مسح الحساب بالكامل وكافة السجلات المرتبطة به في أي وقت من خلال لوحة الإعدادات."}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
