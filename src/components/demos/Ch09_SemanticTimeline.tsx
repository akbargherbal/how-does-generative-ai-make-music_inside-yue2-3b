import React, { useState, useEffect } from "react";
import { ToyBadge } from "../common/ToyBadge";
import { Layers, Play, RotateCcw, Sliders } from "lucide-react";

interface SemanticBlock {
  id: number;
  timeSec: number;
  phoneme: string;
  note: string;
  instrumentHint: string;
  color: string;
}

const TIMELINE_DATA: SemanticBlock[] = [
  { id: 1, timeSec: 0.0, phoneme: "[intro]", note: "C3", instrumentHint: "Acoustic strum", color: "bg-blue-500" },
  { id: 2, timeSec: 0.5, phoneme: "[intro]", note: "E3", instrumentHint: "Guitar pick", color: "bg-blue-500" },
  { id: 3, timeSec: 1.0, phoneme: "Sun-", note: "C4", instrumentHint: "Soft vocal + kick", color: "bg-cyan-500" },
  { id: 4, timeSec: 1.5, phoneme: "-light", note: "E4", instrumentHint: "Vocal vibrato", color: "bg-cyan-500" },
  { id: 5, timeSec: 2.0, phoneme: "through", note: "G4", instrumentHint: "Guitar + hi-hat", color: "bg-emerald-500" },
  { id: 6, timeSec: 2.5, phoneme: "the", note: "A4", instrumentHint: "Bass drop", color: "bg-emerald-500" },
  { id: 7, timeSec: 3.0, phoneme: "kit-", note: "G4", instrumentHint: "Vocal resonance", color: "bg-purple-500" },
  { id: 8, timeSec: 3.5, phoneme: "-chen", note: "E4", instrumentHint: "Snare tap", color: "bg-purple-500" },
  { id: 9, timeSec: 4.0, phoneme: "glass,", note: "C4", instrumentHint: "Held vocal note", color: "bg-amber-500" }
];

export const Ch09_SemanticTimeline: React.FC = () => {
  const [streamProgress, setStreamProgress] = useState<number>(0);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [cfgScale, setCfgScale] = useState<number>(1.0); // Defaults to 1.0 in model card

  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setStreamProgress((prev) => {
        if (prev >= TIMELINE_DATA.length) {
          setIsStreaming(false);
          return prev;
        }
        return prev + 1;
      });
    }, 350);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const handleStartStream = () => {
    setStreamProgress(0);
    setIsStreaming(true);
  };

  const handleReset = () => {
    setIsStreaming(false);
    setStreamProgress(0);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-600" />
          Interactive: Semantic Rough Draft & CFG Guidance
        </h4>
        <ToyBadge />
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        Watch how the model streams discrete <strong>semantic tokens</strong> sequentially from left to right. These tokens act as a storyboard: they specify phonemes, note pitches, and instruments without generating raw audio waves yet.
      </p>

      {/* CFG Guidance Slider */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-cyan-600" />
            <label htmlFor="cfg_slider">Classifier-Free Guidance (CFG Scale): {cfgScale.toFixed(2)}</label>
          </div>
          <span className="text-[11px] text-cyan-700 dark:text-cyan-400 font-medium">
            {cfgScale === 1.0
              ? "1.0 (Official Model Card Default for full/melody)"
              : cfgScale < 1.0
              ? "Sub-normal adherence"
              : cfgScale > 3.0
              ? "High (risk of acoustic saturation)"
              : "Moderate push"}
          </span>
        </div>

        <input
          id="cfg_slider"
          type="range"
          min={0.5}
          max={4.0}
          step={0.1}
          value={cfgScale}
          onChange={(e) => setCfgScale(parseFloat(e.target.value))}
          aria-label="CFG Scale slider"
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
        />

        <p className="text-[11px] text-slate-500">
          CFG compares conditional vs unconditional predictions. Setting CFG to 1.0 (the default when planning is used) relies on the sheet music plan to guide the song without artificial distortion.
        </p>
      </div>

      {/* Timeline Stream Box */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-slate-500">
          <span>Song Timeline (0.0s to 4.5s)</span>
          <span>{streamProgress}/{TIMELINE_DATA.length} tokens generated</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto min-h-[140px] flex items-center gap-2">
          {TIMELINE_DATA.map((block, idx) => {
            const isRevealed = idx < streamProgress;
            return (
              <div
                key={block.id}
                className={`min-w-[75px] sm:min-w-[85px] p-2.5 rounded-xl border text-center transition-all duration-300 ${
                  isRevealed
                    ? "bg-slate-800/90 border-slate-700 text-slate-100 opacity-100 translate-y-0 shadow-md"
                    : "bg-slate-950/40 border-slate-800/40 text-slate-600 opacity-20 translate-y-1"
                }`}
              >
                <span className="text-[10px] font-mono text-slate-400 block mb-1">
                  {block.timeSec.toFixed(1)}s
                </span>
                <span className="font-bold text-sm text-cyan-300 block">
                  {block.phoneme}
                </span>
                <span className="text-xs font-mono text-amber-300 block">
                  {block.note}
                </span>
                <span className="text-[9px] text-slate-400 truncate block mt-1">
                  {block.instrumentHint}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          disabled={isStreaming}
          onClick={handleStartStream}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>{isStreaming ? "Streaming Tokens..." : "Generate Semantic Stream"}</span>
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Timeline</span>
        </button>
      </div>
    </div>
  );
};
