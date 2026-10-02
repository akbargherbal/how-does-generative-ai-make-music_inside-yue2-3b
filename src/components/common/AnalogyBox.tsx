import React from "react";
import { Sparkles, AlertTriangle } from "lucide-react";

interface AnalogyBoxProps {
  title: string;
  body: string;
  breaksDown: string;
}

export const AnalogyBox: React.FC<AnalogyBoxProps> = ({ title, body, breaksDown }) => {
  return (
    <section
      aria-label="Conceptual analogy and limitations"
      className="my-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs overflow-hidden"
    >
      <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" aria-hidden="true" />
          <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-600 dark:text-slate-400">
            Analogy First: {title}
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">Golden Rule G2</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
        {/* Left Column: The Everyday Analogy */}
        <div className="p-5 md:p-6 bg-linear-to-b from-transparent to-amber-50/20 dark:to-amber-950/10">
          <div className="flex items-center gap-2 mb-2 text-slate-900 dark:text-slate-100 font-medium text-sm">
            <span>How to Picture It</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            {body}
          </p>
        </div>

        {/* Right Column: Where the Analogy Breaks */}
        <div className="p-5 md:p-6 bg-slate-50/40 dark:bg-slate-800/20">
          <div className="flex items-center gap-2 mb-2 text-rose-800 dark:text-rose-300 font-medium text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" aria-hidden="true" />
            <span>Where the Analogy Breaks</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {breaksDown}
          </p>
        </div>
      </div>
    </section>
  );
};
