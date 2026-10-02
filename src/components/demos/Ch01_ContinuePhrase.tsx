import React, { useState } from "react";
import { ToyBadge } from "../common/ToyBadge";
import { RotateCcw, Plus, Sparkles } from "lucide-react";

interface WordOption {
  word: string;
  prob: number;
}

const CORPUS_TRANSITIONS: Record<string, WordOption[]> = {
  "<start>": [
    { word: "Sunlight", prob: 0.45 },
    { word: "Morning", prob: 0.25 },
    { word: "Golden", prob: 0.15 },
    { word: "Quiet", prob: 0.10 },
    { word: "Acoustic", prob: 0.05 }
  ],
  "Sunlight": [
    { word: "through", prob: 0.60 },
    { word: "on", prob: 0.20 },
    { word: "fades", prob: 0.10 },
    { word: "warm", prob: 0.07 },
    { word: "in", prob: 0.03 }
  ],
  "through": [
    { word: "the", prob: 0.70 },
    { word: "quiet", prob: 0.15 },
    { word: "open", prob: 0.08 },
    { word: "morning", prob: 0.05 },
    { word: "amber", prob: 0.02 }
  ],
  "the": [
    { word: "kitchen", prob: 0.35 },
    { word: "morning", prob: 0.30 },
    { word: "glass", prob: 0.15 },
    { word: "room", prob: 0.12 },
    { word: "shadows", prob: 0.08 }
  ],
  "kitchen": [
    { word: "glass,", prob: 0.65 },
    { word: "table,", prob: 0.20 },
    { word: "window,", prob: 0.10 },
    { word: "light,", prob: 0.05 }
  ],
  "glass,": [
    { word: "Watch", prob: 0.50 },
    { word: "Quiet", prob: 0.25 },
    { word: "Morning", prob: 0.15 },
    { word: "Listen", prob: 0.10 }
  ],
  "Watch": [
    { word: "the", prob: 0.60 },
    { word: "hours", prob: 0.20 },
    { word: "quiet", prob: 0.12 },
    { word: "morning", prob: 0.08 }
  ],
  "quiet": [
    { word: "morning", prob: 0.65 },
    { word: "room", prob: 0.15 },
    { word: "hours", prob: 0.12 },
    { word: "light", prob: 0.08 }
  ],
  "morning": [
    { word: "pass.", prob: 0.60 },
    { word: "light.", prob: 0.20 },
    { word: "fade.", prob: 0.12 },
    { word: "sing.", prob: 0.08 }
  ],
  "pass.": [
    { word: "<end>", prob: 0.85 },
    { word: "Soft", prob: 0.10 },
    { word: "While", prob: 0.05 }
  ]
};

const DEFAULT_FALLBACK: WordOption[] = [
  { word: "softly", prob: 0.40 },
  { word: "away", prob: 0.30 },
  { word: "now", prob: 0.20 },
  { word: "<end>", prob: 0.10 }
];

export const Ch01_ContinuePhrase: React.FC = () => {
  const [tokens, setTokens] = useState<string[]>(["Sunlight"]);

  const lastWord = tokens[tokens.length - 1];
  const candidates = CORPUS_TRANSITIONS[lastWord] || DEFAULT_FALLBACK;
  const isFinished = lastWord === "<end>" || lastWord === "pass.";

  const addWord = (word: string) => {
    if (word === "<end>") {
      setTokens((prev) => [...prev, "♩ (End of Verse)"]);
    } else {
      setTokens((prev) => [...prev, word]);
    }
  };

  const handleReset = () => {
    setTokens(["Sunlight"]);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-600" />
          Interactive: "Continue the Phrase" Predictor
        </h4>
        <ToyBadge />
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        Click a candidate word below to watch how next-token prediction builds lyrics one piece at a time. The percentages show the model's calculated probability distribution.
      </p>

      {/* Generated text display box */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 min-h-[70px] flex items-center flex-wrap gap-1.5 font-serif text-base sm:text-lg text-slate-900 dark:text-slate-100">
        {tokens.map((tok, idx) => (
          <span
            key={idx}
            className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 shadow-2xs border border-slate-200 dark:border-slate-600"
          >
            {tok}
          </span>
        ))}
        {!isFinished && (
          <span className="w-2 h-5 bg-cyan-500 animate-pulse ml-1 inline-block" />
        )}
      </div>

      {/* Probability Candidates List */}
      {!isFinished ? (
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            Top Predicted Next Tokens (Click to append):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {candidates.map((c, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => addWord(c.word)}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 hover:border-cyan-400 text-xs transition-all text-left group"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-700 dark:group-hover:text-cyan-300">
                    "{c.word}"
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-600 rounded-full"
                      style={{ width: `${c.prob * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 tabular-nums w-8 text-right">
                    {Math.round(c.prob * 100)}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
          ✓ Sequence completed! The model reached its stop condition.
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-500">
          Generated Tokens: <strong className="text-slate-800 dark:text-slate-200">{tokens.length}</strong>
        </span>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Phrase</span>
        </button>
      </div>
    </div>
  );
};
