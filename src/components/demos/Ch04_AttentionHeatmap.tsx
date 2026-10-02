import React, { useState } from "react";
import { ToyBadge } from "../common/ToyBadge";
import { Grid, EyeOff, Sparkles } from "lucide-react";

const TOKENS = ["The", "singer", "dropped", "the", "guitar", "because", "it", "was"];

// Pre-computed hand-authored attention weights (percentages)
// Rows: Looking token (Query); Columns: Attended token (Key)
const FULL_ATTENTION_MATRIX: number[][] = [
  // The
  [0.60, 0.30, 0.03, 0.01, 0.03, 0.01, 0.01, 0.01],
  // singer
  [0.05, 0.55, 0.25, 0.02, 0.08, 0.01, 0.02, 0.02],
  // dropped
  [0.02, 0.35, 0.40, 0.02, 0.18, 0.01, 0.01, 0.01],
  // the
  [0.01, 0.02, 0.02, 0.45, 0.45, 0.02, 0.01, 0.02],
  // guitar
  [0.01, 0.12, 0.22, 0.05, 0.52, 0.02, 0.04, 0.02],
  // because
  [0.02, 0.08, 0.28, 0.02, 0.20, 0.30, 0.05, 0.05],
  // it -> highlights 'guitar' heavily!
  [0.01, 0.04, 0.10, 0.02, 0.72, 0.03, 0.06, 0.02],
  // was
  [0.01, 0.05, 0.12, 0.02, 0.20, 0.05, 0.25, 0.30]
];

export const Ch04_AttentionHeatmap: React.FC = () => {
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number>(6); // "it"
  const [useCausalMask, setUseCausalMask] = useState<boolean>(false);

  // Apply causal mask if enabled
  const getWeightsForRow = (rowIdx: number): number[] => {
    const raw = FULL_ATTENTION_MATRIX[rowIdx];
    if (!useCausalMask) return raw;

    // Mask out column > rowIdx
    const masked = raw.map((w, colIdx) => (colIdx > rowIdx ? 0 : w));
    const sum = masked.reduce((acc, curr) => acc + curr, 0);
    return sum > 0 ? masked.map((m) => Math.round((m / sum) * 100) / 100) : masked;
  };

  const currentWeights = getWeightsForRow(selectedTokenIdx);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Grid className="w-4 h-4 text-cyan-600" />
          Interactive: Attention Heatmap & Causal Masking
        </h4>
        <ToyBadge />
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        Click any token below to inspect who it pays attention to. Notice how the token <strong>"it"</strong> directs <strong>72% of its attention</strong> to <strong>"guitar"</strong> to resolve its meaning.
      </p>

      {/* Causal Mask Toggle */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
        <div className="flex items-center gap-2">
          <EyeOff className="w-4 h-4 text-slate-500" />
          <div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              Causal Mask (Autoregressive Generator Mode)
            </span>
            <span className="text-[11px] text-slate-500">
              When ON, tokens can only look back at past words; future tokens are forbidden (0%).
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setUseCausalMask((prev) => !prev)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            useCausalMask
              ? "bg-purple-600 text-white"
              : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
          }`}
        >
          {useCausalMask ? "Mask ON" : "Mask OFF (Full)"}
        </button>
      </div>

      {/* Sentence Word Selector */}
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
          Select Query Token (Who is listening?):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {TOKENS.map((tok, idx) => {
            const isSelected = idx === selectedTokenIdx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedTokenIdx(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  isSelected
                    ? "bg-cyan-600 text-white shadow-md ring-2 ring-cyan-400/40"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {tok}
              </button>
            );
          })}
        </div>
      </div>

      {/* Attention Heatmap Visualization */}
      <div className="space-y-2 pt-2">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
          Attention paid by "{TOKENS[selectedTokenIdx]}" to all tokens:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {TOKENS.map((tok, colIdx) => {
            const weight = currentWeights[colIdx] || 0;
            const isSelf = colIdx === selectedTokenIdx;
            const isFuture = useCausalMask && colIdx > selectedTokenIdx;

            return (
              <div
                key={colIdx}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isFuture
                    ? "bg-slate-100/50 dark:bg-slate-900 border-dashed border-slate-300 dark:border-slate-800 opacity-40"
                    : weight > 0.3
                    ? "bg-cyan-100 dark:bg-cyan-950/80 border-cyan-400 dark:border-cyan-700 text-cyan-950 dark:text-cyan-100 font-semibold"
                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="font-mono text-xs">{tok}</div>
                <div className="text-[11px] font-mono mt-1 tabular-nums">
                  {isFuture ? "BLOCKED" : `${Math.round(weight * 100)}%`}
                </div>
                {weight > 0.5 && (
                  <span className="text-[9px] uppercase tracking-wider text-cyan-700 dark:text-cyan-400 block font-semibold mt-0.5">
                    Primary focus
                  </span>
                )}
                {isSelf && (
                  <span className="text-[9px] text-slate-400 block mt-0.5">
                    (Self)
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Insight banner */}
      <div className="p-3 bg-cyan-50/70 dark:bg-cyan-950/30 rounded-xl border border-cyan-200/80 dark:border-cyan-800/50 text-xs text-cyan-950 dark:text-cyan-200 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
        <p>
          {selectedTokenIdx === 6 ? (
            <span>
              <strong>Semantic resolution:</strong> The pronoun <em>"it"</em> assigns 72% of its attention weight to <em>"guitar"</em>, allowing the model to know what was heavy without human programmer rules!
            </span>
          ) : (
            <span>
              Token <em>"{TOKENS[selectedTokenIdx]}"</em> blends meanings from related tokens in proportion to these softmax percentages.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
