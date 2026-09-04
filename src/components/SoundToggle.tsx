"use client";

import { useState, useEffect } from "react";
import { sounds } from "@/lib/sound";

export function SoundToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(sounds.isEnabled());
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    sounds.setEnabled(next);
    if (next) {
      sounds.playClick();
    }
  };

  return (
    <button
      onClick={toggle}
      className="p-1.5 px-2.5 rounded-md text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-xs"
      title={enabled ? "Désactiver le son / كتم الصوت" : "Activer le son / تفعيل الصوت"}
      aria-label="Toggle Sound"
    >
      <span className="text-sm leading-none">{enabled ? "🔊" : "🔇"}</span>
      <span className="text-[11px] hidden sm:inline font-bold">
        {enabled ? "Son" : "Muet"}
      </span>
    </button>
  );
}
