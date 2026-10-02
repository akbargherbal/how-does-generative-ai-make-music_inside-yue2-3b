import React from "react";
import { ArrowRight, FileText, Music2, Layers, Cpu, Disc3 } from "lucide-react";
import { PipelineStage } from "../../content/types";

interface PipelineMapProps {
  currentStage: PipelineStage;
  currentChapterId?: number;
  onSelectChapter?: (chapterId: number) => void;
  className?: string;
}

interface StageStep {
  key: PipelineStage;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  representativeChapter: number;
}

const STAGES: StageStep[] = [
  {
    key: "overview",
    label: "Prompt",
    sublabel: "Lyrics & Style",
    icon: FileText,
    representativeChapter: 0
  },
  {
    key: "plan",
    label: "Plan",
    sublabel: "ABC Sheet Music",
    icon: Music2,
    representativeChapter: 8
  },
  {
    key: "semantic",
    label: "Draft",
    sublabel: "Semantic Tokens",
    icon: Layers,
    representativeChapter: 9
  },
  {
    key: "acoustic",
    label: "Detail",
    sublabel: "Acoustic Latents",
    icon: Cpu,
    representativeChapter: 10
  },
  {
    key: "decode",
    label: "Audio",
    sublabel: "48 kHz Stereo",
    icon: Disc3,
    representativeChapter: 11
  }
];

export const PipelineMap: React.FC<PipelineMapProps> = ({
  currentStage,
  onSelectChapter,
  className = ""
}) => {
  // Map foundations to overview/plan context
  const activeKey = currentStage === "foundations" ? "overview" : currentStage === "wrapup" ? "decode" : currentStage;

  return (
    <nav
      aria-label="YuE2 Pipeline Progression"
      className={`w-full bg-slate-900 text-slate-100 border-b border-slate-800 shadow-md py-3 px-4 ${className}`}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
            Pipeline Spine
          </span>
          <span className="hidden lg:inline text-xs text-slate-500">·</span>
          <span className="hidden lg:inline text-xs text-slate-400">YuE2-3B Architecture</span>
        </div>

        {/* Horizontal interactive stages */}
        <div className="w-full md:w-auto flex items-center justify-between sm:justify-center overflow-x-auto pb-1 md:pb-0 gap-1 sm:gap-2">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeKey === stage.key;
            return (
              <React.Fragment key={stage.key}>
                <button
                  type="button"
                  onClick={() => onSelectChapter?.(stage.representativeChapter)}
                  aria-current={isActive ? "step" : undefined}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                    isActive
                      ? "bg-cyan-500 text-slate-950 font-semibold shadow-md ring-2 ring-cyan-400/40"
                      : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-slate-950" : "text-cyan-400"}`} />
                  <span className="whitespace-nowrap">{stage.label}</span>
                  <span
                    className={`hidden xl:inline text-[10px] ${
                      isActive ? "text-slate-800" : "text-slate-400"
                    }`}
                  >
                    ({stage.sublabel})
                  </span>
                </button>

                {idx < STAGES.length - 1 && (
                  <ArrowRight
                    className="w-3 h-3 text-slate-600 shrink-0 hidden sm:block"
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
