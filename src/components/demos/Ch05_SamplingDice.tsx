import React, { useState, useMemo } from "react";
import { ToyBadge } from "../common/ToyBadge";
import { Dices, RotateCcw, Sparkles } from "lucide-react";

interface Candidate {
  token: string;
  logit: number;
}

const CANDIDATES: Candidate[] = [
  { token: "C4 (Tonic)", logit: 2.8 },
  { token: "E4 (Third)", logit: 2.2 },
  { token: "G4 (Fifth)", logit: 1.9 },
  { token: "A4 (Sixth)", logit: 0.8 },
  { token: "D4 (Second)", logit: 0.3 },
  { token: "F#4 (Tritone)", logit: -1.5 }
];

// Simple Mulberry32 pseudo-random number generator for seeded reproducibility
function createPrng(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const Ch05_SamplingDice: React.FC = () => {
  const [temperature, setTemperature] = useState<number>(0.8);
  const [topK, setTopK] = useState<number>(4);
  const [seed, setSeed] = useState<number>(1234);
  const [rollHistory, setRollHistory] = useState<string[]>([]);

  // Calculate filtered probabilities
  const distribution = useMemo(() => {
    // Sort descending by logit
    const sorted = [...CANDIDATES].sort((a, b) => b.logit - a.logit);
    // Keep top-k
    const top = sorted.slice(0, topK);

    // Apply temperature scaling
    const scaled = top.map((c) => c.logit / Math.max(temperature, 0.05));
    const maxVal = Math.max(...scaled);
    const exps = scaled.map((v) => Math.exp(v - maxVal));
    const totalExp = exps.reduce((a, b) => a + b, 0);

    return top.map((c, idx) => ({
      token: c.token,
      prob: exps[idx] / totalExp
    }));
  }, [temperature, topK]);

  const handleRoll = () => {
    // Derive random value from current seed and roll history length
    const prng = createPrng(seed + rollHistory.length * 997);
    const rand = prng();

    let cumulative = 0;
    let chosen = distribution[0].token;
    for (const item of distribution) {
      cumulative += item.prob;
      if (rand <= cumulative) {
        chosen = item.token;
        break;
      }
    }

    setRollHistory((prev) => [...prev, chosen]);
  };

  const handleResetSameSeed = () => {
    setRollHistory([]);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Dices className="w-4 h-4 text-cyan-600" />
          Interactive: Sampling Dice, Temperature & Random Seed
        </h4>
        <ToyBadge />
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        Adjust <strong>temperature</strong> (adventurousness) and <strong>top-k</strong> (filtering). Click <strong>"Roll Dice"</strong> to sample notes. Then hit <strong>"Replay with Same Seed"</strong> to observe how pseudo-random generators yield the exact same notes every single time!
      </p>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
        {/* Temperature */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <label htmlFor="temp_slider">Temperature: {temperature.toFixed(2)}</label>
            <span className="text-[10px] text-slate-500 font-normal">
              {temperature < 0.5 ? "Safe / Repetitive" : temperature > 1.2 ? "Wild / Jazzy" : "Balanced"}
            </span>
          </div>
          <input
            id="temp_slider"
            type="range"
            min={0.1}
            max={2.0}
            step={0.05}
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            aria-label="Temperature slider"
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          />
        </div>

        {/* Top-K */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <label htmlFor="topk_slider">Top-k Filter: {topK}</label>
            <span className="text-[10px] text-slate-500 font-normal">
              {topK === 1 ? "Greedy (Only #1)" : `Top ${topK} notes`}
            </span>
          </div>
          <input
            id="topk_slider"
            type="range"
            min={1}
            max={CANDIDATES.length}
            step={1}
            value={topK}
            onChange={(e) => setTopK(parseInt(e.target.value, 10))}
            aria-label="Top-K slider"
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          />
        </div>

        {/* Seed */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <label htmlFor="seed_input">Seed Number:</label>
            <span className="text-[10px] text-slate-500 font-normal">Deterministic RNG</span>
          </div>
          <input
            id="seed_input"
            type="number"
            value={seed}
            onChange={(e) => {
              setSeed(parseInt(e.target.value, 10) || 0);
              setRollHistory([]);
            }}
            className="w-full px-2.5 py-1 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Probability Bars */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
          Current Probability Distribution (Dice Faces):
        </span>
        <div className="space-y-1.5">
          {distribution.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span className="w-28 font-mono text-slate-700 dark:text-slate-300 truncate">
                {item.token}
              </span>
              <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                <div
                  className="h-full bg-linear-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-150"
                  style={{ width: `${item.prob * 100}%` }}
                />
              </div>
              <span className="font-mono text-slate-500 tabular-nums w-12 text-right">
                {(item.prob * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons & Roll History */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleRoll}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Dices className="w-4 h-4" />
            <span>Roll Dice & Sample Note</span>
          </button>

          <button
            type="button"
            onClick={handleResetSameSeed}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Same Seed</span>
          </button>
        </div>

        <span className="text-xs text-slate-500">
          Rolls Count: <strong className="text-slate-800 dark:text-slate-200">{rollHistory.length}</strong>
        </span>
      </div>

      {/* Generated Sequence Output */}
      {rollHistory.length > 0 && (
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/80">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            Sampled Melody Sequence:
          </span>
          <div className="flex flex-wrap gap-1.5 font-mono text-xs">
            {rollHistory.map((note, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-900 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-800 shadow-2xs"
              >
                {note.split(" ")[0]}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
