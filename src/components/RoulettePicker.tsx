"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StudentItem, RoundDetail } from "@/types";
import { sounds } from "@/lib/sound";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "@/lib/i18n";

interface RoulettePickerProps {
  classItem: {
    id: string;
    name: string;
    description: string | null;
  };
  initialStudents: StudentItem[];
  initialRound: RoundDetail;
  onExitGame?: () => void;
}

export function RoulettePicker({
  classItem,
  initialStudents,
  initialRound,
  onExitGame,
}: RoulettePickerProps) {
  const { lang, t } = useLanguage();
  const [students] = useState<StudentItem[]>(initialStudents);
  const [round, setRound] = useState<RoundDetail>(initialRound);
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(
    () => new Set((initialRound?.selections || []).map((s) => s.student?.id || s.studentId).filter(Boolean))
  );

  const [isSpinning, setIsSpinning] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<StudentItem | null>(null);
  const [displayName, setDisplayName] = useState<string>(t.readyToDraw);
  const [animationSpeed, setAnimationSpeed] = useState<"fast" | "normal" | "slow">("normal");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [soundActive, setSoundActive] = useState(true);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync displayName with language when ready
  useEffect(() => {
    if (!currentWinner && !isSpinning) {
      setDisplayName(t.readyToDraw);
    }
  }, [lang, t.readyToDraw, currentWinner, isSpinning]);

  // Read saved settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setSoundActive(data.settings.soundEnabled ?? true);
            setAnimationSpeed(data.settings.animationSpeed || "normal");
          }
        }
      } catch {
        // Fallback to defaults
      }
    }
    loadSettings();
  }, []);

  // Update sound controller
  const toggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    sounds.setEnabled(next);
    if (next) sounds.playClick();
  };

  // Remaining eligible students
  const remainingStudents = students.filter((s) => !selectedStudentIds.has(s.id));
  const totalCount = students.length;
  const selectedCount = selectedStudentIds.size;
  const progressPercent = totalCount > 0 ? Math.round((selectedCount / totalCount) * 100) : 0;

  // Toggle fullscreen
  const toggleFullscreen = () => {
    sounds.playClick();
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Keyboard shortcut: Spacebar to draw
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isSpinning && !showResetModal && !showCompleteModal) {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return;
        }
        e.preventDefault();
        handleDraw();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Execute Draw
  const handleDraw = async () => {
    if (isSpinning || remainingStudents.length === 0) return;

    sounds.playClick();
    setIsSpinning(true);
    setCurrentWinner(null);
    setSuccessNotice(null);

    try {
      // 1. Request winner from backend
      const response = await fetch(`/api/rounds/${round.id}/draw`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.drawErrorMessage);
      }

      const winner: StudentItem = data.selection?.student || data.selectedStudent;
      if (!winner) {
        throw new Error(data.error || t.drawErrorMessage);
      }
      const updatedRound: RoundDetail = data.round || {
        ...round,
        selections: [
          ...(round?.selections || []),
          {
            id: data.selection?.id || String(Date.now()),
            studentId: winner.id,
            selectionOrder: data.selectionOrder || ((round?.selections?.length || 0) + 1),
            selectedAt: new Date().toISOString(),
            student: winner,
          },
        ],
      };

      // 2. Compute dynamic spin duration
      const totalSteps = animationSpeed === "fast" ? 18 : animationSpeed === "slow" ? 40 : 28;
      let currentStep = 0;

      // Pool for shuffling display
      const pool = students.length > 1 ? students : [winner];

      const runSpinStep = () => {
        const randomIndex = Math.floor(Math.random() * pool.length);
        setDisplayName(pool[randomIndex].name);
        sounds.playTick(0.8 + (currentStep / totalSteps) * 0.8);

        currentStep++;

        if (currentStep < totalSteps) {
          const progress = currentStep / totalSteps;
          const delay = 40 + Math.pow(progress, 2.5) * 260;
          spinIntervalRef.current = setTimeout(runSpinStep, delay);
        } else {
          // Final Winner Announced
          setDisplayName(winner.name);
          setCurrentWinner(winner);
          setIsSpinning(false);
          setSelectedStudentIds((prev) => new Set([...Array.from(prev), winner.id]));
          setRound(updatedRound);
          sounds.playWin();

          // If round is completed
          if (updatedRound.status === "COMPLETED" || selectedCount + 1 >= totalCount) {
            setTimeout(() => {
              setShowCompleteModal(true);
            }, 1200);
          }
        }
      };

      runSpinStep();
    } catch (err: unknown) {
      setIsSpinning(false);
      alert(err instanceof Error ? err.message : t.drawErrorMessage);
    }
  };

  // Reset / Clear History and Round
  const handleResetRound = async (clearAllHistory = true) => {
    sounds.playClick();
    try {
      const response = await fetch(`/api/rounds/${round.id}/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clearAllHistory }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.resetErrorMessage);
      }

      const activeRoundData = data.round || data.newRound;

      setRound({
        id: activeRoundData.id,
        classId: classItem.id,
        roundNumber: activeRoundData.roundNumber || 1,
        status: activeRoundData.status || "ACTIVE",
        startedAt: activeRoundData.startedAt,
        completedAt: null,
        selections: [],
      });

      // Clear selection states immediately
      setSelectedStudentIds(new Set());
      setCurrentWinner(null);
      setDisplayName(t.readyToDraw);
      setShowResetModal(false);
      setShowCompleteModal(false);

      // Display explicit success notice
      setSuccessNotice(`✅ ${t.resetSuccessMessage}`);
      setTimeout(() => {
        setSuccessNotice(null);
      }, 6000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : t.resetErrorMessage);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-150 select-none ${
        isFullscreen ? "p-4 sm:p-6" : "p-4 sm:p-6"
      }`}
      dir={t.direction}
    >
      {/* Organized Header Area */}
      <header className="w-full max-w-6xl mx-auto space-y-3 pb-3 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xs p-3 sm:p-4 rounded-xl shadow-xs">
        {/* Row 1: Navigation + Title + Badges + Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Class Identity & Back Button */}
          <div className="flex items-center gap-3">
            {onExitGame && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onExitGame();
                }}
                className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>{lang === "fr" ? "←" : "→"}</span>
                <span>{t.backToClass}</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-wide">
                {classItem.name}
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                {t.roundNumber} {round.roundNumber}
              </span>
            </div>
          </div>

          {/* Reorganized Toolbar: Controls & Toggles */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Language Switcher */}
            <LanguageToggle />

            {/* Dark/Light Mode with Emoji */}
            <ThemeToggle />

            {/* Sound Toggle with Emoji */}
            <button
              onClick={toggleSound}
              className="p-1.5 px-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
              title={soundActive ? t.soundEnabled : t.soundDisabled}
            >
              <span>{soundActive ? "🔊" : "🔇"}</span>
              <span className="text-[11px] hidden md:inline font-bold">
                {soundActive ? (lang === "fr" ? "Son" : "صوت") : (lang === "fr" ? "Muet" : "كتم")}
              </span>
            </button>

            {/* Speed Pills */}
            <div className="flex items-center border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md p-0.5 text-xs font-semibold">
              <button
                onClick={() => {
                  sounds.playClick();
                  setAnimationSpeed("fast");
                }}
                className={`px-2 py-1 rounded transition-colors text-[11px] ${
                  animationSpeed === "fast"
                    ? "bg-slate-900 text-white dark:bg-slate-700 dark:text-white font-bold"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {t.speedFast}
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setAnimationSpeed("normal");
                }}
                className={`px-2 py-1 rounded transition-colors text-[11px] ${
                  animationSpeed === "normal"
                    ? "bg-slate-900 text-white dark:bg-slate-700 dark:text-white font-bold"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {t.speedNormal}
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setAnimationSpeed("slow");
                }}
                className={`px-2 py-1 rounded transition-colors text-[11px] ${
                  animationSpeed === "slow"
                    ? "bg-slate-900 text-white dark:bg-slate-700 dark:text-white font-bold"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {t.speedSlow}
              </button>
            </div>

            {/* Reset Round with distinct warning/reset outline */}
            <button
              onClick={() => {
                sounds.playClick();
                setShowResetModal(true);
              }}
              className="px-2.5 py-1.5 rounded-md border border-amber-300 dark:border-amber-600/70 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span>{t.resetRoundBtn}</span>
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 text-xs font-black transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>⛶</span>
              <span>{isFullscreen ? t.fullscreenExit : t.fullscreenEnter}</span>
            </button>
          </div>
        </div>

        {/* Subtitle / Breadcrumb Info */}
        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          {t.drawTitle} — {totalCount} {t.studentsRegisteredLabel}
        </div>
      </header>

      {/* Prominent Success Notification Banner */}
      <AnimatePresence>
        {successNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-3xl mx-auto mt-3 p-3.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/90 border border-emerald-300 dark:border-emerald-500 text-emerald-900 dark:text-emerald-100 text-xs sm:text-sm font-bold text-center shadow-md flex items-center justify-between gap-2"
          >
            <span>{successNotice}</span>
            <button
              onClick={() => setSuccessNotice(null)}
              className="px-2 py-0.5 rounded text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800 text-xs border border-emerald-400 dark:border-emerald-600"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Focus: Academic Draw Display */}
      <main className="flex-1 max-w-5xl w-full mx-auto flex flex-col justify-center items-center py-4 sm:py-8 space-y-6">
        {/* Progress & Stat Header */}
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg p-3 sm:p-4 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>
              {t.progressRate} : {progressPercent}% ({selectedCount} / {totalCount})
            </span>
            <div className="flex items-center gap-3">
              <span className="text-amber-600 dark:text-amber-400">
                {t.waitingCount}: {remainingStudents.length}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {t.participatedCount}: {selectedCount}
              </span>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700">
            <div
              className="h-full bg-slate-900 dark:bg-slate-200 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Central Card: Student Name Frame */}
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-800 rounded-xl p-8 sm:p-12 shadow-lg dark:shadow-2xl text-center relative overflow-hidden">
          {/* Status Label */}
          <div className="mb-4">
            {isSpinning ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700 animate-pulse">
                {t.spinning}
              </span>
            ) : currentWinner ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                {t.selectedStudentLabel}
              </span>
            ) : (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                {t.readyToDraw}
              </span>
            )}
          </div>

          {/* Large Projector Name Display */}
          <div className="min-h-[130px] sm:min-h-[160px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={displayName}
                initial={{ opacity: 0.7, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.7, scale: 1.02 }}
                transition={{ duration: 0.12 }}
                className="w-full"
              >
                <div
                  className={`font-black tracking-tight select-all leading-tight ${
                    displayName.length > 25
                      ? "text-2xl sm:text-4xl"
                      : displayName.length > 18
                      ? "text-3xl sm:text-5xl"
                      : "text-4xl sm:text-6xl"
                  } ${
                    isSpinning
                      ? "text-slate-500 dark:text-slate-400"
                      : currentWinner
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                  dir="auto"
                >
                  {displayName}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Subtext */}
          {currentWinner && !isSpinning && (
            <div className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              {t.recordedNotice}
            </div>
          )}

          {/* Primary Action Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleDraw}
              disabled={isSpinning || remainingStudents.length === 0}
              className={`px-8 py-3.5 rounded-lg text-sm sm:text-base font-black transition-all shadow-md active:scale-98 cursor-pointer ${
                remainingStudents.length === 0
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700"
                  : isSpinning
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-wait border border-slate-300 dark:border-slate-700"
                  : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              }`}
            >
              {remainingStudents.length === 0
                ? t.allCompletedBtn
                : isSpinning
                ? t.spinning
                : selectedCount > 0
                ? t.drawNextBtn
                : t.startDrawBtn}
            </button>
          </div>
        </div>

        {/* Reorganized Bottom Lists: Side-by-side */}
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Waiting List */}
          <div className="bg-white dark:bg-slate-900/80 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {t.waitingListTitle}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-amber-800 dark:text-amber-300 font-bold">
                {remainingStudents.length}
              </span>
            </div>

            {remainingStudents.length === 0 ? (
              <div className="text-xs text-slate-400 dark:text-slate-500 py-6 text-center">
                {t.noStudentsWaiting}
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {remainingStudents.map((student, idx) => (
                  <div
                    key={student.id}
                    className="py-1.5 flex items-center justify-between text-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-1 rounded"
                  >
                    <span className="font-semibold" dir="auto">{student.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">#{idx + 1}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Participated List */}
          <div className="bg-white dark:bg-slate-900/80 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {t.participatedListTitle}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 text-emerald-800 dark:text-emerald-300 font-bold">
                {round.selections.length}
              </span>
            </div>

            {round.selections.length === 0 ? (
              <div className="text-xs text-slate-400 dark:text-slate-500 py-6 text-center">
                {t.noStudentsParticipated}
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {[...round.selections].reverse().map((sel) => (
                  <div
                    key={sel.id}
                    className="py-1.5 flex items-center justify-between text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-1 rounded"
                  >
                    <span className="font-semibold" dir="auto">{sel.student?.name || "-"}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      #{sel.selectionOrder}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto pt-3 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        {t.drawSubtitle}
      </footer>

      {/* Reorganized Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xl">🔄</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.resetModalTitle}
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.resetModalDesc}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-md text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => handleResetRound(true)}
                className="px-4 py-2 rounded-md text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition-colors"
              >
                {t.confirmResetBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.roundCompletedTitle} ({round.roundNumber})
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.roundCompletedDesc}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="px-4 py-2 rounded-md text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {t.close}
              </button>
              <button
                onClick={() => handleResetRound(false)}
                className="px-4 py-2 rounded-md text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                {t.startNextRoundBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
