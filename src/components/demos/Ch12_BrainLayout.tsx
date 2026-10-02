import React, { useState } from "react";
import { ToyBadge } from "../common/ToyBadge";
import { Network, ArrowRight, Check, Zap } from "lucide-react";

export const Ch12_BrainLayout: React.FC = () => {
  const [activeStage, setActiveStage] = useState<"stage1" | "stage2" | "stage3">("stage1");

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Network className="w-4 h-4 text-cyan-600" />
          Interactive: AR–NAR Mixture-of-Transformers Architecture
        </h4>
        <ToyBadge />
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        Click the stages below to see how YuE2's single unified backbone switches between <strong>Sequential Autoregression (AR)</strong> and <strong>Parallel Flow Matching (NAR)</strong> without duplicating neural weights.
      </p>

      {/* Stage Selector Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs">
        <button
          type="button"
          onClick={() => setActiveStage("stage1")}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg font-medium transition-all ${
            activeStage === "stage1"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-semibold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          1. Plan (ABC Score)
        </button>

        <button
          type="button"
          onClick={() => setActiveStage("stage2")}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg font-medium transition-all ${
            activeStage === "stage2"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-semibold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          2. Semantic Draft
        </button>

        <button
          type="button"
          onClick={() => setActiveStage("stage3")}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg font-medium transition-all ${
            activeStage === "stage3"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-semibold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          3. Acoustic Latents
        </button>
      </div>

      {/* Interactive Backbone Diagram Box */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 space-y-5">
        {/* Top: Inputs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              activeStage === "stage1"
                ? "bg-cyan-950/80 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/40"
                : "bg-slate-900 border-slate-800 text-slate-400 opacity-60"
            }`}
          >
            Lyrics & Style Text Tokens
          </div>

          <div
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              activeStage === "stage2"
                ? "bg-cyan-950/80 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/40"
                : "bg-slate-900 border-slate-800 text-slate-400 opacity-60"
            }`}
          >
            ABC Plan + Lyrics Conditioning
          </div>

          <div
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              activeStage === "stage3"
                ? "bg-cyan-950/80 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/40"
                : "bg-slate-900 border-slate-800 text-slate-400 opacity-60"
            }`}
          >
            Semantic Tokens + Gaussian Noise
          </div>
        </div>

        <div className="flex justify-center text-slate-600">
          <ArrowRight className="w-5 h-5 rotate-90" />
        </div>

        {/* Center: The Shared Transformer Backbone */}
        <div className="p-5 rounded-xl bg-slate-900 border-2 border-cyan-500/80 shadow-lg space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-cyan-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Shared Transformer Backbone (~3–4 Billion Parameters)
            </span>
            <span className="font-mono text-xs text-slate-400">
              7.3 GB SafeTensors in BF16
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Shared deep self-attention layers & harmonic representations common to music composition and sound physics.
          </p>

          {/* Operating Mode Indicator */}
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Current Attention Routing:</span>
            {activeStage === "stage3" ? (
              <span className="font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Non-Autoregressive (Bidirectional Attention Across All Frames)
              </span>
            ) : (
              <span className="font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Autoregressive (Causal Triangular Mask — Left to Right)
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-center text-slate-600">
          <ArrowRight className="w-5 h-5 rotate-90" />
        </div>

        {/* Bottom: Outputs */}
        <div className="flex justify-center">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-center max-w-sm">
            <span className="font-mono text-xs text-slate-400 block mb-0.5">Stage Output:</span>
            {activeStage === "stage1" && (
              <span className="font-bold text-sm text-cyan-300">
                Readable ABC Sheet Music Score
              </span>
            )}
            {activeStage === "stage2" && (
              <span className="font-bold text-sm text-cyan-300">
                Discrete Semantic Tokens (~25–50 tok/s)
              </span>
            )}
            {activeStage === "stage3" && (
              <span className="font-bold text-sm text-amber-300">
                Acoustic Latents (sent to VAE decoder → 48 kHz Stereo)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
