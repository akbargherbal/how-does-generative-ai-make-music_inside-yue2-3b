import React from "react";
import { Moon, Sun, BookOpen, FileSpreadsheet, Award, Layers } from "lucide-react";

interface TopBarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  completedCount: number;
  totalChapters: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentView,
  onNavigate,
  isDark,
  onToggleTheme,
  completedCount,
  totalChapters
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element Brand mark */}
        <button
          type="button"
          onClick={() => onNavigate("chapter-0")}
          className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-left"
        >
          Inside YuE2-3B
        </button>

        {/* Zone 2: 4-6 Clean text navigation links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
          <button
            type="button"
            onClick={() => onNavigate("chapters-index")}
            className={`hover:text-slate-900 dark:hover:text-slate-100 transition-colors ${
              currentView.startsWith("chapter") || currentView === "chapters-index" ? "text-cyan-600 dark:text-cyan-400 font-semibold" : ""
            }`}
          >
            Chapters
          </button>

          <button
            type="button"
            onClick={() => onNavigate("pipeline-map")}
            className={`hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center gap-1.5 ${
              currentView === "pipeline-map" ? "text-cyan-600 dark:text-cyan-400 font-semibold" : ""
            }`}
          >
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Big Picture</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("glossary")}
            className={`hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center gap-1.5 ${
              currentView === "glossary" ? "text-cyan-600 dark:text-cyan-400 font-semibold" : ""
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Glossary</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("cheat-sheet")}
            className={`hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center gap-1.5 ${
              currentView === "cheat-sheet" ? "text-cyan-600 dark:text-cyan-400 font-semibold" : ""
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Cheat Sheet</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("final-quiz")}
            className={`hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center gap-1.5 ${
              currentView === "final-quiz" ? "text-cyan-600 dark:text-cyan-400 font-semibold" : ""
            }`}
          >
            <Award className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Final Quiz</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary actions */}
        <div className="flex items-center gap-3">
          {/* Progress (Clean unboxed text metadata) */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Progress:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
              {completedCount}/{totalChapters}
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
