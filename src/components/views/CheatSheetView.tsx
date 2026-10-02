import React from "react";
import { CHEAT_SHEET_STAGES, CHEAT_SHEET_FACTS } from "../../content/cheatSheet";
import { FileSpreadsheet, Printer, ArrowRight, HardDrive } from "lucide-react";

interface CheatSheetViewProps {
  onSelectChapter: (chapterId: number) => void;
}

export const CheatSheetView: React.FC<CheatSheetViewProps> = ({ onSelectChapter }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8 print:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 print:border-b-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              YuE2-3B Architecture Cheat Sheet
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A single-page architectural reference from lyrics prompt to 48 kHz stereo audio.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 font-medium text-xs shadow-md transition-all print:hidden self-start"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Verified Core Facts Card */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
        {CHEAT_SHEET_FACTS.map((f, idx) => (
          <div key={idx} className="p-2.5">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono block mb-0.5">
              {f.label}
            </span>
            <strong className="text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
              {f.value}
            </strong>
          </div>
        ))}
      </div>

      {/* 5-Stage Pipeline Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          The 5 Pipeline Stages at a Glance
        </h2>

        <div className="space-y-4">
          {CHEAT_SHEET_STAGES.map((s) => (
            <div
              key={s.step}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {s.step}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                    {s.name}
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold text-cyan-700 dark:text-cyan-400">
                  {s.dataSize}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <span className="font-semibold text-slate-500 block mb-0.5">Input:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono">{s.input}</span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <span className="font-semibold text-slate-500 block mb-0.5">Output:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono">{s.output}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div className="text-slate-700 dark:text-slate-300">
                  <strong>Mechanism:</strong> {s.mechanism}
                </div>
              </div>

              {/* Code */}
              <div className="p-2.5 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto">
                <code>{s.codeSnippet}</code>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                "{s.keyTakeaway}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer attribution */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex flex-wrap justify-between gap-2">
        <span>YuE2-3B by M-A-P · Creative Commons CC BY-NC 4.0</span>
        <span>Reference Paper: arXiv:2609.33757</span>
      </div>
    </div>
  );
};
