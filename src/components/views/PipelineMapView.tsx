import React, { useState } from "react";
import { ArrowRight, Music, Layers, Cpu, Disc3, FileText, CheckCircle, ExternalLink } from "lucide-react";
import { AudioPlayer } from "../common/AudioPlayer";

interface PipelineMapViewProps {
  onSelectChapter: (chapterId: number) => void;
}

export const PipelineMapView: React.FC<PipelineMapViewProps> = ({ onSelectChapter }) => {
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(1);

  const stages = [
    {
      id: 0,
      title: "Input Text Prompt",
      short: "Words",
      icon: FileText,
      chapterId: 2,
      dataForm: "Text characters & BPE Token IDs",
      rate: "~42 tokens",
      color: "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100",
      description: "You type lyrics and a style prompt (e.g. 'Indie pop, warm female vocal, acoustic guitar, soft drums'). The Qwen tiktoken tokenizer converts words into integer IDs.",
      outputExample: "[4120, 1823, 948, 262, 19402, 6128...]"
    },
    {
      id: 1,
      title: "Stage 1: Symbolic Plan",
      short: "Sheet Music (ABC)",
      icon: Music,
      chapterId: 8,
      dataForm: "ABC notation plain text",
      rate: "~380 text tokens",
      color: "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-100",
      description: "Music's chain-of-thought: before generating any audio, YuE2 composes a readable score in ABC notation specifying key, meter, chords, and vocal melody notes.",
      outputExample: 'X:1\\nM:4/4\\nK:C\\n"C" C2 E2 | "G" G3 E | "Am" A2 c2 | "F" A4 |]'
    },
    {
      id: 2,
      title: "Stage 2: Semantic Rough Draft",
      short: "Semantic Tokens",
      icon: Layers,
      chapterId: 9,
      dataForm: "Discrete acoustic tokens",
      rate: "~25 to 50 tokens per sec",
      color: "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100",
      description: "Generated autoregressively, these low-framerate tokens act like a film storyboard: they outline vocal pronunciation phonemes, syllable timing, and arrangement.",
      outputExample: "[9102, 4821, 1029, 3991, 5512, 8820...]"
    },
    {
      id: 3,
      title: "Stage 3: Acoustic Latents",
      short: "Flow Matching",
      icon: Cpu,
      chapterId: 10,
      dataForm: "Continuous floating-point tensor",
      rate: "~50 frames per sec",
      color: "border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-100",
      description: "Non-autoregressive flow matching sculpts acoustic details out of pure Gaussian random noise in parallel over 25 steps, producing dense acoustic latents.",
      outputExample: "Tensor shape: (1, 64, 4200), dtype=bfloat16"
    },
    {
      id: 4,
      title: "Stage 4: Waveform Decoding",
      short: "48 kHz Stereo Audio",
      icon: Disc3,
      chapterId: 11,
      dataForm: "Stereo PCM audio waveform",
      rate: "96,000 samples per second",
      color: "border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100",
      description: "The neural VAE decoder (YuE2-Vae) expands compact latents into high-fidelity 48,000 Hz stereo sound waves that push speaker cones to make audible sound.",
      outputExample: "17,280,000 floats for a 3-minute stereo song!"
    }
  ];

  const cur = stages[selectedStageIdx];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          The Big Picture: The Complete Pipeline
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          YuE2 turns words into music by decomposing an impossible leap (words to 17 million audio samples) into four progressive steps of increasing detail.
        </p>
      </div>

      {/* Interactive Flow Diagram */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-2 overflow-x-auto pb-2">
          {stages.map((st, idx) => {
            const Icon = st.icon;
            const isSelected = selectedStageIdx === idx;
            return (
              <React.Fragment key={st.id}>
                <button
                  type="button"
                  onClick={() => setSelectedStageIdx(idx)}
                  className={`flex-1 min-w-[130px] p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "ring-2 ring-cyan-500 bg-white dark:bg-slate-800 shadow-md border-cyan-500"
                      : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      STAGE {idx}
                    </span>
                    <Icon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <strong className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                    {st.short}
                  </strong>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                    {st.rate}
                  </span>
                </button>

                {idx < stages.length - 1 && (
                  <div className="hidden md:flex items-center justify-center text-slate-400 shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Selected Stage Deep Dive Card */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase">
                Stage {cur.id} of 4
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {cur.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => onSelectChapter(cur.chapterId)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-xs font-medium hover:bg-cyan-100"
            >
              <span>Explore in Chapter {cur.chapterId}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {cur.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
              <span className="font-semibold text-slate-500 block mb-0.5">Data Representation:</span>
              <span className="text-slate-800 dark:text-slate-200 font-mono">{cur.dataForm}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
              <span className="font-semibold text-slate-500 block mb-0.5">Rate / Sequence Size:</span>
              <span className="text-slate-800 dark:text-slate-200 font-mono">{cur.rate}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
            <span className="text-slate-500 text-[10px] block mb-1">Data Output Example:</span>
            <code>{cur.outputExample}</code>
          </div>
        </div>
      </div>

      {/* Audio Sample Player */}
      <div className="space-y-3">
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
          The Final Output: 48 kHz Stereo Result
        </h3>
        <AudioPlayer
          src="/audio/passion.mp3"
          title="Passion (Acoustic Pop Ballad)"
          genreTag="YuE2-3B Demo Track"
          caption="Listen to the dynamic range: intimate acoustic guitar strumming building into a full drum kit and vocal crescendo."
        />
      </div>
    </div>
  );
};
