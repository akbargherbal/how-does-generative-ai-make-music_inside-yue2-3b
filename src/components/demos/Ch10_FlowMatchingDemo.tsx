import React, { useState, useMemo, useEffect } from "react";
import { ToyBadge } from "../common/ToyBadge";
import { Cpu, Play, RotateCcw } from "lucide-react";

interface FlowPoint {
  id: number;
  noiseX: number;
  noiseY: number;
  targetX: number;
  targetY: number;
}

// Generate 150 deterministic points forming a musical acoustic waveform
function generateTargetWaveform(): FlowPoint[] {
  const points: FlowPoint[] = [];
  const count = 150;

  for (let i = 0; i < count; i++) {
    // Target position: an oscillating musical waveform across X
    const targetX = 10 + (i / (count - 1)) * 80; // 10 to 90
    // Waveform combination: fundamental sine + harmonic
    const angle = (i / count) * Math.PI * 6;
    const wave = Math.sin(angle) * 22 + Math.sin(angle * 2.5) * 8;
    const targetY = 50 + wave;

    // Pseudo-random noise coordinates (deterministic box-muller approximation)
    const seedAngle = i * 137.5;
    const radius = 15 + ((i * 17) % 35);
    const noiseX = 50 + Math.cos(seedAngle) * radius;
    const noiseY = 50 + Math.sin(seedAngle) * radius;

    points.push({
      id: i,
      noiseX: Math.max(5, Math.min(95, noiseX)),
      noiseY: Math.max(5, Math.min(95, noiseY)),
      targetX,
      targetY: Math.max(10, Math.min(90, targetY))
    });
  }
  return points;
}

export const Ch10_FlowMatchingDemo: React.FC = () => {
  const [totalSteps, setTotalSteps] = useState<number>(25); // Standard flow matching steps
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const points = useMemo(() => generateTargetWaveform(), []);

  // Compute interpolated position at current step
  const progressRatio = currentStep / totalSteps;

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps) {
          setIsAnimating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [isAnimating, totalSteps]);

  const handleStartAnimation = () => {
    setCurrentStep(0);
    setIsAnimating(true);
  };

  const handleReset = () => {
    setIsAnimating(false);
    setCurrentStep(0);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-600" />
          Interactive: Flow Matching Vector Field (Noise → Sound Wave)
        </h4>
        <ToyBadge />
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        In Non-Autoregressive flow matching, all audio frames are sculpted together in parallel. Drag the <strong>Integration Step slider</strong> or press <strong>"Animate Flow"</strong> to see 150 points move smoothly along straight velocity vectors from random Gaussian static into a structured waveform.
      </p>

      {/* 2D Canvas SVG */}
      <div className="relative aspect-square sm:aspect-16/9 w-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden select-none">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Subtle grid */}
          <line x1="0" y1="50" x2="100" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="1,1" />

          {/* Points interpolated along straight line from noise to target */}
          {points.map((p) => {
            const curX = p.noiseX + (p.targetX - p.noiseX) * progressRatio;
            const curY = p.noiseY + (p.targetY - p.noiseY) * progressRatio;

            // Color shifts from noisy amber to structured cyan
            const isFinished = currentStep === totalSteps;

            return (
              <circle
                key={p.id}
                cx={curX}
                cy={curY}
                r={isFinished ? "1.6" : "1.4"}
                fill={isFinished ? "#22d3ee" : "#f59e0b"}
                opacity={0.85}
                className="transition-all duration-75"
              />
            );
          })}
        </svg>

        <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700/80 px-3 py-1 rounded-lg text-xs font-mono text-slate-300">
          State: {currentStep === 0 ? "Pure Gaussian Noise (Static)" : currentStep === totalSteps ? "Structured Acoustic Latent (Waveform)" : `Step ${currentStep} of ${totalSteps} (Flowing)`}
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-xs">
        <div>
          <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <label htmlFor="step_slider">Integration Step: {currentStep} / {totalSteps}</label>
            <span className="font-mono text-cyan-600 dark:text-cyan-400">
              {Math.round(progressRatio * 100)}%
            </span>
          </div>
          <input
            id="step_slider"
            type="range"
            min={0}
            max={totalSteps}
            step={1}
            disabled={isAnimating}
            value={currentStep}
            onChange={(e) => setCurrentStep(parseInt(e.target.value, 10))}
            aria-label="Current flow matching step slider"
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          />
        </div>

        <div>
          <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <label htmlFor="total_steps_slider">Number of Steps (num_steps): {totalSteps}</label>
            <span className="text-[10px] text-slate-500 font-normal">
              {totalSteps <= 10 ? "Faster (rougher)" : "Default (balanced)"}
            </span>
          </div>
          <input
            id="total_steps_slider"
            type="range"
            min={5}
            max={50}
            step={5}
            disabled={isAnimating}
            value={totalSteps}
            onChange={(e) => {
              setTotalSteps(parseInt(e.target.value, 10));
              setCurrentStep(0);
            }}
            aria-label="Total flow matching steps slider"
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          disabled={isAnimating}
          onClick={handleStartAnimation}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>{isAnimating ? "Flow Matching ODE..." : "Animate Flow (Noise → Latents)"}</span>
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Noise</span>
        </button>
      </div>
    </div>
  );
};
