import React, { useState } from "react";
import { Check, Copy, Terminal, HardDrive, Play } from "lucide-react";
import { CodeBlock } from "../../content/types";

interface PythonCornerProps {
  blocks: CodeBlock[];
}

export const PythonCorner: React.FC<PythonCornerProps> = ({ blocks }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (code: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <section aria-label="Python Code Corner" className="my-8 space-y-4">
      <div className="flex items-center gap-2">
        <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-700 dark:text-slate-300">
          Python Corner
        </h3>
      </div>

      {blocks.map((block, idx) => {
        const isRunnable = block.type === "runnable";
        return (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 shadow-md overflow-hidden font-mono text-xs"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-950/70 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                {isRunnable ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                    <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" aria-hidden="true" />
                    Runnable anywhere (Stock Python)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-950/80 text-purple-300 border border-purple-800/80">
                    <HardDrive className="w-3 h-3 text-purple-400" aria-hidden="true" />
                    Needs 24 GB GPU (Real YuE2 API)
                  </span>
                )}
                <span className="text-slate-300 font-sans font-medium text-xs hidden sm:inline">
                  {block.title}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(block.code, idx)}
                aria-label="Copy Python code"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px]"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {block.description && (
              <p className="px-4 py-2 text-slate-400 font-sans text-xs bg-slate-950/40 border-b border-slate-800/60">
                {block.description}
              </p>
            )}

            {/* Code Body */}
            <div className="p-4 overflow-x-auto">
              <pre className="text-slate-200 leading-relaxed font-mono whitespace-pre selection:bg-cyan-900 selection:text-white">
                <code>{block.code}</code>
              </pre>
            </div>
          </div>
        );
      })}
    </section>
  );
};
