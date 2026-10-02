import React from "react";
import { CHAPTERS } from "../../content/chapters";
import { Clock, CheckCircle2, ArrowRight, Music, Layers, Cpu, Disc3, FileText } from "lucide-react";
import { PipelineStage } from "../../content/types";

interface ChaptersIndexViewProps {
  onSelectChapter: (chapterId: number) => void;
  completedMap: Record<number, boolean>;
}

export const ChaptersIndexView: React.FC<ChaptersIndexViewProps> = ({
  onSelectChapter,
  completedMap
}) => {
  const getStageIcon = (stage: PipelineStage) => {
    switch (stage) {
      case "plan":
        return <Music className="w-4 h-4 text-cyan-500" />;
      case "semantic":
        return <Layers className="w-4 h-4 text-emerald-500" />;
      case "acoustic":
        return <Cpu className="w-4 h-4 text-purple-500" />;
      case "decode":
        return <Disc3 className="w-4 h-4 text-amber-500" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          All 16 Chapters
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Follow the complete path from lyrics input to 48 kHz stereo music generation. Jump into any chapter anytime.
        </p>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CHAPTERS.map((ch) => {
          const isDone = completedMap[ch.id];
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => onSelectChapter(ch.id)}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-cyan-400 dark:hover:border-cyan-600 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider font-mono">
                      Chapter {ch.id}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      {getStageIcon(ch.pipelineStage)}
                      <span className="capitalize">{ch.pipelineStage}</span>
                    </span>
                  </div>

                  {isDone ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Quiz Done</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ch.estMinutes}m</span>
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {ch.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                  {ch.subtitle}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                <span>Start Reading</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
