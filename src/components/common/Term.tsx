import React, { useState, useRef, useEffect } from "react";
import { GLOSSARY, GlossaryEntry } from "../../content/glossary";
import { BookOpen, X, Code2 } from "lucide-react";

interface TermProps {
  id: string;
  children?: React.ReactNode;
  onNavigateToGlossary?: (termId: string) => void;
}

export const Term: React.FC<TermProps> = ({ id, children, onNavigateToGlossary }) => {
  const [isOpen, setIsOpen] = useState(false);
  const entry: GlossaryEntry | undefined = GLOSSARY[id];
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!entry) {
    return <span>{children || id}</span>;
  }

  const displayText = children || entry.term;

  return (
    <span className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Definition for ${entry.term}`}
        className="text-cyan-700 dark:text-cyan-300 font-medium underline decoration-dotted decoration-cyan-400 dark:decoration-cyan-600 underline-offset-4 hover:decoration-solid hover:text-cyan-900 dark:hover:text-cyan-100 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-500 rounded-xs"
      >
        {displayText}
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label={entry.term}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl text-left text-xs animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
              {entry.term}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              aria-label="Close popover"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="mt-2 text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {entry.definition}
          </p>

          <div className="mt-2.5 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="font-semibold text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
              Everyday Analogy:
            </span>
            <p className="text-slate-600 dark:text-slate-300 italic text-[11px] leading-snug">
              "{entry.analogy}"
            </p>
          </div>

          <div className="mt-2 flex items-start gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-1.5 rounded border border-emerald-200 dark:border-emerald-800/60">
            <Code2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              <strong>Python idea:</strong> {entry.pythonAnalogy}
            </span>
          </div>

          {onNavigateToGlossary && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onNavigateToGlossary(entry.id);
                }}
                className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
              >
                More in Glossary →
              </button>
            </div>
          )}
        </div>
      )}
    </span>
  );
};
