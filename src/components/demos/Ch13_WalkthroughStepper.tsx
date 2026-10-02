import React, { useState } from "react";
import { ToyBadge } from "../common/ToyBadge";
import { ChevronRight, ChevronLeft, HardDrive, Cpu, Clock, CheckCircle } from "lucide-react";

interface StepperStage {
  number: number;
  title: string;
  stageName: string;
  input: string;
  output: string;
  mechanism: string;
  tensorShape: string;
  gpuMemory: string;
  pythonCall: string;
  description: string;
}

const STAGES: StepperStage[] = [
  {
    number: 1,
    title: "Step 1: Input Tokenization",
    stageName: "Text Tokenizer",
    input: "Lyrics: 'Sunlight through the kitchen glass...' + Style: 'Indie pop...'",
    output: "List of 42 integer token IDs",
    mechanism: "qwen.tiktoken sub-word BPE tokenizer",
    tensorShape: "shape=(1, 42), dtype=int64",
    gpuMemory: "~0.1 MB (CPU memory before GPU transfer)",
    pythonCall: "token_ids = tokenizer.encode(prompt)",
    description: "Converts text characters into numerical catalog indices that point to embedding vectors."
  },
  {
    number: 2,
    title: "Step 2: Symbolic Planning (ABC Score)",
    stageName: "Autoregressive Plan",
    input: "Input Token IDs + Style prompt conditioning",
    output: "ABC notation sheet music score with key, meter, chords, and melody notes",
    mechanism: "Autoregressive transformer (cot='full')",
    tensorShape: "shape=(1, 380), dtype=int64",
    gpuMemory: "~7.3 GB (Model weights in BF16 loaded in VRAM)",
    pythonCall: "plan = pipe.plan(style=style, lyrics=lyrics, cot='full', seed=1234)",
    description: "Music's chain-of-thought: composes melody and chord progressions before generating any sound."
  },
  {
    number: 3,
    title: "Step 3: Semantic Rough Draft",
    stageName: "Autoregressive Semantic",
    input: "ABC Plan + Lyrics + Style tokens",
    output: "Sequence of discrete semantic audio tokens (~25–50 tokens/sec)",
    mechanism: "Autoregressive generation with Classifier-Free Guidance (CFG)",
    tensorShape: "shape=(1, 4200), dtype=int64",
    gpuMemory: "~8.5 GiB VRAM (activations accumulating in KV-cache)",
    pythonCall: "semantic = pipe.generate_semantic(plan, cfg_scale=1.0, seed=1234)",
    description: "A musical storyboard capturing vocal syllables, vibrato, and rhythm without instrument timbres."
  },
  {
    number: 4,
    title: "Step 4: Flow Matching Synthesis",
    stageName: "Non-Autoregressive Flow Matching",
    input: "Semantic tokens + Gaussian random noise tensor",
    output: "Continuous dense acoustic latents across all frames simultaneously",
    mechanism: "25-step ordinary differential equation (ODE) vector integration",
    tensorShape: "shape=(1, 64, 4200), dtype=bfloat16",
    gpuMemory: "~11.2 GiB VRAM (Peak VRAM consumption on RTX 4090)",
    pythonCall: "latents = pipe.synthesize(semantic, num_steps=25, seed=1234)",
    description: "Transforms unstructured static into rich acoustic textures in parallel over 25 steps."
  },
  {
    number: 5,
    title: "Step 5: VAE Waveform Decoding",
    stageName: "Neural VAE Decoder",
    input: "Continuous acoustic latents",
    output: "48 kHz stereo PCM audio waveform (17,280,000 float samples for 3 min)",
    mechanism: "Convolutional upsampling neural decoder (YuE2-Vae)",
    tensorShape: "shape=(2, 10368000), dtype=float32",
    gpuMemory: "~9.1 GiB VRAM (weights unloaded, audio buffer in system RAM)",
    pythonCall: "audio = pipe.decode(latents); pipe.save(audio, 'morning_light.flac')",
    description: "Expands compact latents into high-resolution speaker cone displacement values."
  }
];

export const Ch13_WalkthroughStepper: React.FC = () => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const cur = STAGES[currentStepIdx];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-cyan-600" />
          Interactive: Guided Walk-Through & GPU Hardware Telemetry
        </h4>
        <ToyBadge text="Real YuE2 pipeline stages & documented tensor shapes" />
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        Step through the complete journey of our running indie pop song from raw words to 48 kHz stereo audio, inspecting tensor shapes and GPU memory usage at each stage.
      </p>

      {/* Stepper Progress Bar */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
        {STAGES.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentStepIdx(idx)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              idx === currentStepIdx
                ? "bg-cyan-600 text-white shadow-xs font-semibold"
                : idx < currentStepIdx
                ? "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-200"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            <span>{idx + 1}.</span>
            <span className="hidden sm:inline">{s.stageName}</span>
          </button>
        ))}
      </div>

      {/* Active Stage Detail Card */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <h5 className="font-bold text-base text-slate-900 dark:text-slate-100">
            {cur.title}
          </h5>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
            {cur.mechanism}
          </span>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {cur.description}
        </p>

        {/* Input / Output & Tensor details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-semibold text-slate-500 block mb-0.5">What Goes In:</span>
            <span className="text-slate-800 dark:text-slate-200 font-mono">{cur.input}</span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-semibold text-slate-500 block mb-0.5">What Comes Out:</span>
            <span className="text-slate-800 dark:text-slate-200 font-mono">{cur.output}</span>
          </div>
        </div>

        {/* Tensor Shape and Memory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-900 rounded-xl text-slate-200 font-mono text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Tensor Shape:</span>
            <span className="text-cyan-300 font-semibold">{cur.tensorShape}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">GPU Memory State:</span>
            <span className="text-emerald-300 font-semibold">{cur.gpuMemory}</span>
          </div>
        </div>

        {/* Code representation */}
        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
          <span className="text-slate-500 text-[10px] block mb-1">Underlying Python Call:</span>
          <code>{cur.pythonCall}</code>
        </div>
      </div>

      {/* Hardware Telemetry Summary Strip */}
      <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-slate-100 flex flex-wrap items-center justify-around gap-4 text-xs">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-purple-400" />
          <div>
            <span className="text-slate-400 block text-[10px]">Model Weights</span>
            <strong className="text-white">~7.3 GB (BF16)</strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <div>
            <span className="text-slate-400 block text-[10px]">Peak VRAM (RTX 4090)</span>
            <strong className="text-white">~11.2 GiB VRAM</strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-slate-400 block text-[10px]">Generation Time</span>
            <strong className="text-white">~71s (3.6 min audio)</strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-amber-400" />
          <div>
            <span className="text-slate-400 block text-[10px]">Target GPU Requirement</span>
            <strong className="text-white">24 GB NVIDIA GPU</strong>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          disabled={currentStepIdx === 0}
          onClick={() => setCurrentStepIdx((p) => p - 1)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        <span className="text-xs text-slate-500 font-mono">
          Stage {currentStepIdx + 1} of {STAGES.length}
        </span>

        <button
          type="button"
          disabled={currentStepIdx === STAGES.length - 1}
          onClick={() => setCurrentStepIdx((p) => p + 1)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium shadow-md transition-all active:scale-95 disabled:opacity-40"
        >
          <span>Next Step</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
