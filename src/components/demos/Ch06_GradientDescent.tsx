import React, { useState, useEffect } from "react";
import { ToyBadge } from "../common/ToyBadge";
import { Play, RotateCcw, TrendingDown } from "lucide-react";

interface DataPoint {
  x: number;
  y: number;
}

const DATA: DataPoint[] = [
  { x: 1, y: 2.4 },
  { x: 2, y: 5.1 },
  { x: 3, y: 7.6 },
  { x: 4, y: 9.8 },
  { x: 5, y: 12.5 }
];

export const Ch06_GradientDescent: React.FC = () => {
  const [paramW, setParamW] = useState<number>(0.5);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [lossHistory, setLossHistory] = useState<number[]>([]);

  // Calculate Mean Squared Error Loss
  const computeLoss = (w: number) => {
    let sumErr = 0;
    for (const pt of DATA) {
      const pred = w * pt.x;
      sumErr += Math.pow(pred - pt.y, 2);
    }
    return sumErr / DATA.length;
  };

  const currentLoss = computeLoss(paramW);

  // Gradient of MSE w.r.t w
  const computeGradient = (w: number) => {
    let grad = 0;
    for (const pt of DATA) {
      const pred = w * pt.x;
      grad += 2 * (pred - pt.y) * pt.x;
    }
    return grad / DATA.length;
  };

  useEffect(() => {
    if (!isTraining) return;

    const interval = setInterval(() => {
      setParamW((prevW) => {
        const grad = computeGradient(prevW);
        const lr = 0.04;
        const nextW = prevW - lr * grad;
        const newLoss = computeLoss(nextW);

        setLossHistory((hist) => [...hist.slice(-19), newLoss]);

        // Stop condition
        if (Math.abs(grad) < 0.05) {
          setIsTraining(false);
          return Math.round(nextW * 100) / 100;
        }
        return nextW;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isTraining]);

  const handleStartTraining = () => {
    setLossHistory([currentLoss]);
    setIsTraining(true);
  };

  const handleReset = () => {
    setIsTraining(false);
    setParamW(0.5);
    setLossHistory([]);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-cyan-600" />
          Interactive: Gradient Descent & Loss Minimization
        </h4>
        <ToyBadge />
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        In this single-parameter model, the line equation is <code>y = w * x</code>. Drag the dial slider to manually minimize the loss error, or click <strong>"Auto-Train"</strong> to watch gradient descent step downhill automatically!
      </p>

      {/* Main Coordinate Stage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Graph SVG */}
        <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-2 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Grid */}
            <line x1="10" y1="90" x2="95" y2="90" stroke="#94a3b8" strokeWidth="0.8" />
            <line x1="10" y1="90" x2="10" y2="10" stroke="#94a3b8" strokeWidth="0.8" />

            {/* Prediction Line y = w * x */}
            {/* At x=0 -> y=0 (SVG x=10, y=90); At x=5 -> y=w*5 */}
            {/* Scale: X: 1 unit = 16 SVG units. Y: 1 unit = 5.3 SVG units */}
            <line
              x1="10"
              y1="90"
              x2={10 + 5 * 16}
              y2={Math.max(5, 90 - paramW * 5 * 5.3)}
              stroke="#06b6d4"
              strokeWidth="1.5"
            />

            {/* Error Residual Lines and Data Dots */}
            {DATA.map((pt, idx) => {
              const svgX = 10 + pt.x * 16;
              const svgDataY = 90 - pt.y * 5.3;
              const svgPredY = 90 - (paramW * pt.x) * 5.3;

              return (
                <g key={idx}>
                  {/* Error line */}
                  <line
                    x1={svgX}
                    y1={svgDataY}
                    x2={svgX}
                    y2={svgPredY}
                    stroke="#f43f5e"
                    strokeWidth="0.8"
                    strokeDasharray="1,1"
                  />
                  {/* True Data Point */}
                  <circle cx={svgX} cy={svgDataY} r="2.2" fill="#3b82f6" />
                </g>
              );
            })}
          </svg>

          <span className="absolute bottom-2 left-3 text-[10px] text-slate-400 font-mono">
            Blue dots = Real music targets | Cyan line = Model guess
          </span>
        </div>

        {/* Controls & Metrics */}
        <div className="space-y-4 flex flex-col justify-between">
          <div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 dark:text-slate-400">Parameter Dial (w):</span>
                <span className="font-mono font-bold text-sm text-cyan-700 dark:text-cyan-400">
                  {paramW.toFixed(3)}
                </span>
              </div>

              <input
                type="range"
                min={0.0}
                max={4.5}
                step={0.02}
                disabled={isTraining}
                value={paramW}
                onChange={(e) => setParamW(parseFloat(e.target.value))}
                aria-label="Model parameter weight slider"
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />

              <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Current Loss (Error²):</span>
                <span
                  className={`font-mono font-bold text-sm ${
                    currentLoss < 0.3
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {currentLoss.toFixed(3)} {currentLoss < 0.2 ? "✓ (Near Optimum)" : ""}
                </span>
              </div>
            </div>

            {/* Loss History Curve */}
            {lossHistory.length > 1 && (
              <div className="mt-3 p-3 bg-slate-900 rounded-xl text-slate-200 text-xs">
                <span className="text-slate-400 font-mono text-[10px] block mb-1">
                  Training Loss Curve (Step-by-Step Descent):
                </span>
                <div className="flex items-end gap-1 h-12 pt-1 border-b border-slate-700">
                  {lossHistory.map((lossVal, idx) => {
                    const heightPercent = Math.min(100, Math.max(5, (lossVal / 15) * 100));
                    return (
                      <div
                        key={idx}
                        className="flex-1 bg-cyan-400 rounded-t-xs transition-all"
                        style={{ height: `${heightPercent}%` }}
                        title={`Loss: ${lossVal.toFixed(2)}`}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              disabled={isTraining}
              onClick={handleStartTraining}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isTraining ? "Stepping Downhill..." : "Auto-Train (Gradient Descent)"}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Reset parameter"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
