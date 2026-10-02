import React, { useState, useEffect } from "react";
import { CHAPTERS, getChapterById } from "./content/chapters";
import { TopBar } from "./components/common/TopBar";
import { PipelineMap } from "./components/common/PipelineMap";
import { ChapterView } from "./components/views/ChapterView";
import { ChaptersIndexView } from "./components/views/ChaptersIndexView";
import { PipelineMapView } from "./components/views/PipelineMapView";
import { GlossaryView } from "./components/views/GlossaryView";
import { CheatSheetView } from "./components/views/CheatSheetView";
import { FinalQuizView } from "./components/views/FinalQuizView";

import {
  BookOpen,
  FileSpreadsheet,
  Award,
  CheckCircle2,
  Menu,
  X,
  ExternalLink,
  Layers,
  ChevronRight
} from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<string>("chapter-0");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [glossaryTargetTerm, setGlossaryTargetTerm] = useState<string | undefined>(undefined);

  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("yue2_theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  // Track completed quizzes
  const [completedMap, setCompletedMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Read quiz completion states from localStorage
    const map: Record<number, boolean> = {};
    CHAPTERS.forEach((ch) => {
      const isDone = localStorage.getItem(`yue2_quiz_ch_${ch.id}_submitted`) === "true";
      if (isDone) map[ch.id] = true;
    });
    setCompletedMap(map);
  }, [currentView]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("yue2_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("yue2_theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Chapter navigation helpers
  const handleSelectChapter = (id: number) => {
    setCurrentView(`chapter-${id}`);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateToGlossary = (termId?: string) => {
    setGlossaryTargetTerm(termId);
    setCurrentView("glossary");
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Determine active chapter if in chapter view
  const isChapterView = currentView.startsWith("chapter-");
  const activeChapterId = isChapterView ? parseInt(currentView.replace("chapter-", ""), 10) : 0;
  const activeChapter = getChapterById(activeChapterId) || CHAPTERS[0];

  const completedCount = Object.keys(completedMap).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-cyan-500/20 selection:text-cyan-900 dark:selection:text-cyan-200">
      {/* 3-Zone Top Bar */}
      <TopBar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        completedCount={completedCount}
        totalChapters={CHAPTERS.length}
      />

      {/* Persistent Pipeline Spine */}
      <PipelineMap
        currentStage={activeChapter.pipelineStage}
        currentChapterId={activeChapter.id}
        onSelectChapter={handleSelectChapter}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Mobile Sidebar Toggle Button */}
        <div className="lg:hidden fixed bottom-5 right-5 z-40">
          <button
            type="button"
            onClick={() => setSidebarOpen((p) => !p)}
            aria-label="Toggle Navigation Menu"
            className="w-12 h-12 rounded-full bg-cyan-600 text-white shadow-xl flex items-center justify-center hover:bg-cyan-500 transition-all active:scale-95"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Collapsible Left Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 lg:w-64 lg:shrink-0 lg:bg-transparent lg:border-r lg:dark:border-slate-800 lg:p-0 lg:py-8 ${
            sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:shadow-none"
          }`}
        >
          <div className="space-y-6 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
            {/* Quick Links */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold px-2 block mb-1">
                Explore
              </span>
              <button
                type="button"
                onClick={() => {
                  setCurrentView("chapters-index");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  currentView === "chapters-index"
                    ? "bg-cyan-50 dark:bg-cyan-950/80 text-cyan-900 dark:text-cyan-200 font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>All 16 Chapters</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">Index</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentView("pipeline-map");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  currentView === "pipeline-map"
                    ? "bg-cyan-50 dark:bg-cyan-950/80 text-cyan-900 dark:text-cyan-200 font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>The Big Picture</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">Map</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigateToGlossary()}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  currentView === "glossary"
                    ? "bg-cyan-50 dark:bg-cyan-950/80 text-cyan-900 dark:text-cyan-200 font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Plain-English Glossary</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">65 terms</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentView("cheat-sheet");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  currentView === "cheat-sheet"
                    ? "bg-cyan-50 dark:bg-cyan-950/80 text-cyan-900 dark:text-cyan-200 font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Architecture Cheat Sheet</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">1 page</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentView("final-quiz");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  currentView === "final-quiz"
                    ? "bg-cyan-50 dark:bg-cyan-950/80 text-cyan-900 dark:text-cyan-200 font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Comprehensive Final Exam</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">10 Qs</span>
              </button>
            </div>

            {/* Chapter Checklist */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold px-2 block mb-1">
                Chapters Progression
              </span>
              <div className="space-y-0.5">
                {CHAPTERS.map((ch) => {
                  const isActive = isChapterView && activeChapterId === ch.id;
                  const isDone = completedMap[ch.id];
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => handleSelectChapter(ch.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                        isActive
                          ? "bg-cyan-600 text-white font-semibold shadow-2xs"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                      }`}
                    >
                      <span className="truncate pr-2">
                        {ch.id}. {ch.title}
                      </span>
                      {isDone && (
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isActive ? "text-white" : "text-emerald-500"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-20 lg:hidden"
          />
        )}

        {/* Main Content Pane */}
        <main className="flex-1 w-full min-w-0 py-4 sm:py-8 lg:px-8">
          {currentView === "chapters-index" && (
            <ChaptersIndexView
              onSelectChapter={handleSelectChapter}
              completedMap={completedMap}
            />
          )}

          {currentView === "pipeline-map" && (
            <PipelineMapView onSelectChapter={handleSelectChapter} />
          )}

          {currentView === "glossary" && (
            <GlossaryView
              onSelectChapter={handleSelectChapter}
              initialTermId={glossaryTargetTerm}
            />
          )}

          {currentView === "cheat-sheet" && (
            <CheatSheetView onSelectChapter={handleSelectChapter} />
          )}

          {currentView === "final-quiz" && (
            <FinalQuizView onSelectChapter={handleSelectChapter} />
          )}

          {isChapterView && (
            <ChapterView
              chapter={activeChapter}
              onNavigateChapter={handleSelectChapter}
              onNavigateToGlossary={handleNavigateToGlossary}
              isFirst={activeChapter.id === 0}
              isLast={activeChapter.id === CHAPTERS.length - 1}
            />
          )}
        </main>
      </div>

      {/* Attribution & Legal Footer (§4.4) */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 px-4 sm:px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              YuE2-3B by M-A-P (Multimodal Art Projection)
            </p>
            <p>
              Model weights licensed under{" "}
              <strong className="text-slate-700 dark:text-slate-300">
                Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
              </strong>
              . Non-commercial study & educational use only.
            </p>
            <p className="text-[11px] text-slate-400">
              This app is an independent educational project and is not affiliated with M-A-P or Hugging Face.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <a
              href="https://arxiv.org/abs/2609.33757"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-600 transition-colors flex items-center gap-1"
            >
              <span>arXiv:2609.33757</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="https://huggingface.co/m-a-p/YuE2-3B"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-600 transition-colors flex items-center gap-1"
            >
              <span>Hugging Face Model Card</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="https://github.com/multimodal-art-projection/YuE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-600 transition-colors flex items-center gap-1"
            >
              <span>YuE GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
