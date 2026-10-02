import React, { useState, useMemo } from "react";
import { GLOSSARY, GlossaryEntry } from "../../content/glossary";
import { Search, BookOpen, Code2, Sparkles, ArrowRight } from "lucide-react";

interface GlossaryViewProps {
  onSelectChapter: (chapterId: number) => void;
  initialTermId?: string;
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({ onSelectChapter, initialTermId }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLetter, setSelectedLetter] = useState<string>("ALL");

  const termsList = useMemo(() => {
    return Object.values(GLOSSARY).sort((a, b) => a.term.localeCompare(b.term));
  }, []);

  const alphabet = useMemo(() => {
    const letters = new Set<string>();
    termsList.forEach((t) => {
      const first = t.term[0].toUpperCase();
      if (/[A-Z]/.test(first)) letters.add(first);
    });
    return Array.from(letters).sort();
  }, [termsList]);

  const filteredTerms = useMemo(() => {
    return termsList.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.analogy.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLetter =
        selectedLetter === "ALL" || item.term[0].toUpperCase() === selectedLetter;

      return matchesSearch && matchesLetter;
    });
  }, [termsList, searchQuery, selectedLetter]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <BookOpen className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Plain-English Glossary
          </h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Every technical term used in the YuE2-3B explainer, defined with zero unexplained jargon, an everyday analogy, and a Python developer parallel. (Golden Rules G1 & G3).
        </p>
      </div>

      {/* Search and Alphabet Filter Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search all 65 terms, analogies, or Python concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-cyan-500 shadow-2xs"
          />
        </div>

        {/* Alphabet filter chips */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setSelectedLetter("ALL")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              selectedLetter === "ALL"
                ? "bg-cyan-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            All ({termsList.length})
          </button>
          {alphabet.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => setSelectedLetter(letter)}
              className={`w-7 h-7 rounded-md text-xs font-mono font-medium transition-colors flex items-center justify-center ${
                selectedLetter === letter
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Grid */}
      <div className="space-y-6">
        {filteredTerms.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
            No terms found matching "{searchQuery}".
          </div>
        ) : (
          filteredTerms.map((item) => (
            <article
              key={item.id}
              id={`term-${item.id}`}
              className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs space-y-3.5 transition-all hover:border-cyan-300 dark:hover:border-cyan-800"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  {item.term}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span>First seen in</span>
                  <button
                    type="button"
                    onClick={() => onSelectChapter(item.firstChapter)}
                    className="font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    Chapter {item.firstChapter}
                  </button>
                </div>
              </div>

              {/* Definition */}
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {item.definition}
              </p>

              {/* Analogy & Python Parallel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {/* Analogy */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Everyday Analogy:</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed">
                    "{item.analogy}"
                  </p>
                </div>

                {/* Python Idea */}
                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/50 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                    <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Python Parallel:</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px] leading-relaxed">
                    {item.pythonAnalogy}
                  </p>
                </div>
              </div>

              {/* Related chapters */}
              {item.relatedChapters.length > 1 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                  <span>Also covered in chapters:</span>
                  {item.relatedChapters.map((chNum) => (
                    <button
                      key={chNum}
                      type="button"
                      onClick={() => onSelectChapter(chNum)}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950 text-slate-700 dark:text-slate-300 hover:text-cyan-600"
                    >
                      Ch {chNum}
                    </button>
                  ))}
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
};
