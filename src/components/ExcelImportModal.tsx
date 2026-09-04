"use client";

import { useState, useRef } from "react";
import { sounds } from "@/lib/sound";
import { ExcelPreviewResponse } from "@/types";
import { useLanguage } from "@/lib/i18n";

interface ExcelImportModalProps {
  isOpen: boolean;
  classId: string;
  className: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ExcelImportModal({
  isOpen,
  classId,
  className,
  onClose,
  onSuccess,
}: ExcelImportModalProps) {
  const { lang, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState<ExcelPreviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<string>("");

  if (!isOpen) return null;

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setLoading(true);
    sounds.playClick();

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (selectedSheet) {
      formData.append("sheet", selectedSheet);
    }

    try {
      const res = await fetch(`/api/classes/${classId}/import/preview`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || t.importParseError);
      }

      setPreview(json.data);
      if (json.data.sheetNames?.length > 0) {
        setSelectedSheet(json.data.selectedSheet);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.importParseError);
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSheetChange = async (sheet: string) => {
    if (!file) return;
    setSelectedSheet(sheet);
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sheet", sheet);

    try {
      const res = await fetch(`/api/classes/${classId}/import/preview`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setPreview(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.importParseError);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!preview || preview.uniqueStudents.length === 0) return;

    setImporting(true);
    setError(null);
    sounds.playClick();

    try {
      const res = await fetch(`/api/classes/${classId}/import/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names: preview.uniqueStudents }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || t.importSaveError);
      }

      sounds.playWin();
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.importSaveError);
    } finally {
      setImporting(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col"
        dir={t.direction}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.importModalTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.importModalDesc(className)}
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="text-xs font-semibold px-2.5 py-1 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t.close}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {!preview ? (
            /* Upload Box */
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileSelect(f);
                }}
              />

              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.importSelectFile}
                </p>
                <p className="text-xs text-slate-500">
                  {t.importSelectFileDesc}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-md text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 transition-colors disabled:opacity-50"
                >
                  {loading ? t.importAnalyzing : t.importSelectFileBtn}
                </button>
              </div>
            </div>
          ) : (
            /* Preview State */
            <div className="space-y-4">
              {/* Sheet selector if multiple sheets exist */}
              {preview.sheetNames && preview.sheetNames.length > 1 && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-md border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.currentSheetLabel}
                  </span>
                  <select
                    value={selectedSheet}
                    onChange={(e) => handleSheetChange(e.target.value)}
                    className="px-2.5 py-1 text-xs font-semibold rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  >
                    {preview.sheetNames.map((sheet) => (
                      <option key={sheet} value={sheet}>
                        {sheet}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-[11px] text-slate-500">{t.detectedColLabel}</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                    {preview.detectedColumnName}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-[11px] text-slate-500">{t.totalRowsLabel}</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                    {preview.totalRowsFound}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-[11px] text-slate-500">{t.validStudentsLabel}</div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {preview.uniqueStudents.length}
                  </div>
                </div>
              </div>

              {/* Duplicates notice */}
              {preview.duplicatesCount > 0 && (
                <div className="p-3 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs">
                  {t.duplicatesNotice(preview.duplicatesCount)}
                </div>
              )}

              {/* Preview Table */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden">
                <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  {t.previewRosterTitle(preview.uniqueStudents.length)}
                </div>
                <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {preview.uniqueStudents.map((name, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >
                      <span className="font-bold text-slate-800 dark:text-slate-200" dir="auto">
                        {name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          {preview ? (
            <button
              type="button"
              onClick={reset}
              className="px-3 py-1.5 rounded-md text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800"
            >
              {t.chooseAnotherFile}
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-md text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t.cancel}
            </button>

            {preview && (
              <button
                type="button"
                disabled={importing || preview.uniqueStudents.length === 0}
                onClick={handleConfirmImport}
                className="px-5 py-2 rounded-md text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 transition-colors disabled:opacity-50"
              >
                {importing ? t.confirmImportingBtn : t.confirmImportBtn(preview.uniqueStudents.length)}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
