import React, { useState } from "react";
import { ToyBadge } from "../common/ToyBadge";
import { Disc3, CheckCircle, Info } from "lucide-react";

export const Ch11_VaeCompression: React.FC = () => {
  const [downsampleFactor, setDownsampleFactor] = useState<number>(8);
  const [selectedVae, setSelectedVae] = useState<"default" | "legacy">("default");

  // Generate a continuous sine + harmonic waveform
  const numSamples = 200;
  const originalWaveform = Array.from({ length: numSamples }, (_, i) => {
    const t = (i / numSamples) * Math.PI * 8;
    return Math.sin(t) * 0.7 + Math.sin(t * 3) * 0.2 + Math.cos(t * 5) * 0.1;
  });

  // Reconstructed downsampled waveform
  const reconstructedWaveform = originalWaveform.map((val, i) => {
    // Quantize index to step
    const stepIdx = Math.floor(i / downsampleFactor) * downsampleFactor;
    const baseVal = originalWaveform[stepIdx];
    // Add small simulated VAE smoothing interpolation
    const nextIdx = Math.min(numSamples - 1, stepIdx + downsampleFactor);
    const fraction = (i - stepIdx) / downsampleFactor;
    return baseVal + (originalWaveform[nextIdx] - baseVal) * fraction;
  });

  const compressionRatio = downsampleFactor;
  const numbersPerSecond = Math.round(96000 / downsampleFactor);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Disc3 className="w-4 h-4 text-cyan-600" />
          Interactive: VAE Latent Compression & Decoder Checkpoints
        </h4>
        <ToyBadge />
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        The VAE acts as a neural compression bridge. Adjust the <strong>Compression Factor slider</strong> to see how downsampling audio into a small latent footprint preserves overall contour while discarding bit-level micro-noise.
      </p>

      {/* Waveform Visualization SVG */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Continuous Waveform vs Decoded Approximation:</span>
          <span>Blue = Original | Cyan = VAE Reconstruction</span>
        </div>

        <div className="relative aspect-3/1 w-full bg-slate-950 rounded-xl border border-slate-800 p-2 overflow-hidden select-none">
          <svg className="w-full h-full" viewBox="0 0 200 100">
            {/* Center zero line */}
            <line x1="0" y1="50" x2="200" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />

            {/* Original continuous audio wave (Blue) */}
            <path
              d={originalWaveform
                .map((y, x) => `${x === 0 ? "M" : "L"} ${x} ${50 - y * 40}`)
                .join(" ")}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="0.8"
              opacity="0.4"
            />

            {/* Reconstructed wave from downsampled latents (Cyan) */}
            <path
              d={reconstructedWaveform
                .map((y, x) => `${x === 0 ? "M" : "L"} ${x} ${50 - y * 40}`)
                .join(" ")}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="1.6"
            />
          </svg>
        </div>
      </div>

      {/* Downsample slider */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Compression Factor: {compressionRatio}x
          </span>
          <span className="font-mono text-cyan-700 dark:text-cyan-400">
            {numbersPerSecond.toLocaleString()} latent floats / sec (vs 96,000 raw)
          </span>
        </div>

        <input
          type="range"
          min={1}
          max={32}
          step={1}
          value={downsampleFactor}
          onChange={(e) => setDownsampleFactor(parseInt(e.target.value, 10))}
          aria-label="Compression factor slider"
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
        />

        <div className="flex justify-between text-[11px] text-slate-500">
          <span>1x (Lossless Raw Waveform)</span>
          <span>8x (YuE2-Vae Sweetspot)</span>
          <span>32x (Heavy Compression)</span>
        </div>
      </div>

      {/* VAE Checkpoint A vs B Selector */}
      <div className="space-y-2 pt-1">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
          YuE2's Two Pretrained Decoder Options (Model Card Fact):
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Default */}
          <button
            type="button"
            onClick={() => setSelectedVae("default")}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              selectedVae === "default"
                ? "bg-cyan-50 dark:bg-cyan-950/60 border-cyan-500 ring-1 ring-cyan-500"
                : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                YuE2-Vae (Default)
              </span>
              {selectedVae === "default" && (
                <CheckCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Trained for superior perceptual fidelity. Best high-frequency vocal clarity and acoustic sparkle to human listeners.
            </p>
          </button>

          {/* Legacy */}
          <button
            type="button"
            onClick={() => setSelectedVae("legacy")}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              selectedVae === "legacy"
                ? "bg-cyan-50 dark:bg-cyan-950/60 border-cyan-500 ring-1 ring-cyan-500"
                : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                YuE2-Vae-legacy
              </span>
              {selectedVae === "legacy" && (
                <CheckCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Earlier checkpoint scoring slightly higher on automated musicality benchmarks, but with slightly more compression artifacts.
            </p>
          </button>
        </div>
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
        <Info className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
        <p>
          <strong>In your Python code:</strong> YuE2 automatically loads the default <code>YuE2-Vae</code> during <code>pipe.decode(latents)</code>. You can switch to legacy with <code>YuE2Pipeline.from_pretrained(vae_checkpoint="YuE2-Vae-legacy")</code>.
        </p>
      </div>
    </div>
  );
};
