import React, { useState } from "react";
import { ToyBadge } from "../common/ToyBadge";
import { Compass, RotateCcw } from "lucide-react";

interface WordPoint {
  id: string;
  word: string;
  category: "instrument" | "structure" | "mood" | "lyric";
  x: number; // 0 to 100
  y: number; // 0 to 100
}

const INITIAL_POINTS: WordPoint[] = [
  // Instruments Cluster (Upper Right)
  { id: "guitar", word: "guitar", category: "instrument", x: 78, y: 22 },
  { id: "acoustic", word: "acoustic", category: "instrument", x: 82, y: 18 },
  { id: "bass", word: "bass", category: "instrument", x: 70, y: 35 },
  { id: "drums", word: "drums", category: "instrument", x: 62, y: 38 },
  { id: "piano", word: "piano", category: "instrument", x: 88, y: 28 },
  { id: "synth", word: "synth", category: "instrument", x: 65, y: 24 },
  { id: "vocal", word: "vocal", category: "instrument", x: 84, y: 38 },

  // Song Structure Cluster (Lower Right)
  { id: "verse", word: "verse", category: "structure", x: 75, y: 72 },
  { id: "chorus", word: "chorus", category: "structure", x: 82, y: 78 },
  { id: "bridge", word: "bridge", category: "structure", x: 70, y: 82 },
  { id: "intro", word: "intro", category: "structure", x: 65, y: 68 },
  { id: "melody", word: "melody", category: "structure", x: 88, y: 64 },
  { id: "chord", word: "chord", category: "structure", x: 85, y: 52 },
  { id: "tempo", word: "tempo", category: "structure", x: 60, y: 58 },

  // Mood / Emotion Cluster (Upper Left)
  { id: "warm", word: "warm", category: "mood", x: 25, y: 25 },
  { id: "gentle", word: "gentle", category: "mood", x: 22, y: 20 },
  { id: "sad", word: "sad", category: "mood", x: 18, y: 40 },
  { id: "happy", word: "happy", category: "mood", x: 35, y: 18 },
  { id: "soft", word: "soft", category: "mood", x: 30, y: 28 },
  { id: "heavy", word: "heavy", category: "mood", x: 42, y: 48 },

  // Lyric Imagery Cluster (Lower Left)
  { id: "sunlight", word: "sunlight", category: "lyric", x: 25, y: 75 },
  { id: "morning", word: "morning", category: "lyric", x: 28, y: 82 },
  { id: "kitchen", word: "kitchen", category: "lyric", x: 15, y: 88 },
  { id: "glass", word: "glass", category: "lyric", x: 20, y: 70 },
  { id: "pass", word: "pass", category: "lyric", x: 35, y: 86 }
];

export const Ch03_EmbeddingExplorer: React.FC = () => {
  const [points, setPoints] = useState<WordPoint[]>(INITIAL_POINTS);
  const [selectedWordId, setSelectedWordId] = useState<string>("guitar");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const selectedPoint = points.find((p) => p.id === selectedWordId) || points[0];

  // Calculate Euclidean distances from selected word
  const distances = points
    .filter((p) => p.id !== selectedPoint.id)
    .map((p) => {
      const dx = p.x - selectedPoint.x;
      const dy = p.y - selectedPoint.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return { ...p, dist: Math.round(dist * 10) / 10 };
    })
    .sort((a, b) => a.dist - b.dist);

  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedWordId(id);
    setDraggedId(id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggedId) return;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const rawX = ((e.clientX - svgRect.left) / svgRect.width) * 100;
    const rawY = ((e.clientY - svgRect.top) / svgRect.height) * 100;

    const clampedX = Math.max(5, Math.min(95, rawX));
    const clampedY = Math.max(5, Math.min(95, rawY));

    setPoints((prev) =>
      prev.map((p) => (p.id === draggedId ? { ...p, x: clampedX, y: clampedY } : p))
    );
  };

  const handlePointerUp = () => {
    setDraggedId(null);
  };

  const getCategoryColor = (cat: WordPoint["category"], isSelected: boolean) => {
    if (isSelected) return "#06b6d4"; // Cyan
    switch (cat) {
      case "instrument":
        return "#3b82f6"; // Blue
      case "structure":
        return "#8b5cf6"; // Purple
      case "mood":
        return "#f59e0b"; // Amber
      case "lyric":
        return "#10b981"; // Emerald
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-600" />
          Interactive: 2D Embedding Map & Euclidean Distance
        </h4>
        <ToyBadge />
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        Click any word to inspect its nearest geometric neighbors. You can even <strong>drag a word</strong> to a new position to watch its distances recalculate in real time using <code>math.dist()</code>.
      </p>

      {/* Category Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
          Instruments
        </span>
        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
          Structure
        </span>
        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
          Mood & Tone
        </span>
        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          Lyric Imagery
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* SVG Scatter Plot */}
        <div className="lg:col-span-2 relative aspect-square sm:aspect-4/3 w-full bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden select-none">
          <svg
            className="w-full h-full cursor-crosshair touch-none"
            viewBox="0 0 100 100"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Coordinate grid lines */}
            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="1,1" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="1,1" strokeWidth="0.5" />

            {/* Connecting lines from selected word to top 3 nearest */}
            {distances.slice(0, 4).map((nb) => (
              <line
                key={`line-${nb.id}`}
                x1={selectedPoint.x}
                y1={selectedPoint.y}
                x2={nb.x}
                y2={nb.y}
                stroke="#06b6d4"
                strokeWidth="0.6"
                strokeDasharray="1.5,1.5"
                opacity="0.8"
              />
            ))}

            {/* Word Points */}
            {points.map((p) => {
              const isSelected = p.id === selectedPoint.id;
              const color = getCategoryColor(p.category, isSelected);

              return (
                <g
                  key={p.id}
                  transform={`translate(${p.x}, ${p.y})`}
                  onPointerDown={(e) => handlePointerDown(p.id, e)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <circle
                    r={isSelected ? "3.5" : "2.2"}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth="0.6"
                    className="transition-all hover:scale-125"
                  />
                  <text
                    y="-3"
                    textAnchor="middle"
                    className={`text-[3.2px] select-none pointer-events-none font-sans font-semibold ${
                      isSelected
                        ? "fill-cyan-600 dark:fill-cyan-300 font-bold"
                        : "fill-slate-700 dark:fill-slate-300"
                    }`}
                  >
                    {p.word}
                  </text>
                </g>
              );
            })}
          </svg>

          <span className="absolute bottom-2 right-2 text-[10px] text-slate-400 font-mono">
            Axes: Dimension 1 vs Dimension 2
          </span>
        </div>

        {/* Nearest Neighbors Panel */}
        <div className="space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Active Focus:
            </span>
            <div className="p-3 bg-cyan-50 dark:bg-cyan-950/40 rounded-xl border border-cyan-200 dark:border-cyan-800/80">
              <span className="font-bold text-base text-cyan-950 dark:text-cyan-200 block">
                "{selectedPoint.word}"
              </span>
              <span className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                Coords: [{selectedPoint.x.toFixed(1)}, {selectedPoint.y.toFixed(1)}]
              </span>
            </div>

            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-4 mb-2">
              Nearest Neighbors (math.dist):
            </span>

            <div className="space-y-1.5">
              {distances.slice(0, 5).map((nb, idx) => (
                <button
                  key={nb.id}
                  type="button"
                  onClick={() => setSelectedWordId(nb.id)}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs transition-colors"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {idx + 1}. "{nb.word}"
                  </span>
                  <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                    dist: {nb.dist}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setPoints(INITIAL_POINTS);
              setSelectedWordId("guitar");
            }}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Map Positions</span>
          </button>
        </div>
      </div>
    </div>
  );
};
