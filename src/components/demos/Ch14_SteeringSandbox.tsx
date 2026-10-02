import React, { useState } from "react";
import { ToyBadge } from "../common/ToyBadge";
import { AudioPlayer } from "../common/AudioPlayer";
import { Sliders, RefreshCw, Wand2, Music } from "lucide-react";

export const Ch14_SteeringSandbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"style" | "covers" | "agentic">("style");
  const [selectedStyle, setSelectedStyle] = useState<string>("indie");
  const [agentPrompt, setAgentPrompt] = useState<string>("Change chords from C to Am and add a jazzy 7th ending");
  const [isDiffApplied, setIsDiffApplied] = useState<boolean>(false);

  const styleOptions = [
    {
      id: "indie",
      title: "Indie Pop Ballad",
      prompt: "Indie pop, warm female vocal, acoustic guitar, soft drums",
      audioSrc: "/audio/tonight-awake.mp3",
      caption: "Listen for the acoustic strumming and warm vocal intimate resonance."
    },
    {
      id: "metal",
      title: "Cyber Metal Riff",
      prompt: "Heavy metal, distorted electric guitars, double bass drums, male growl",
      audioSrc: "/audio/cyber-metal.mp3",
      caption: "Listen for distorted rhythm guitar riffs and aggressive drum transients."
    },
    {
      id: "funk",
      title: "70s Jazz Funk Cover",
      prompt: "70s Jazz Funk, slap bass, electric piano, brass section, groovy drums",
      audioSrc: "/audio/auld-lang-syne-jazz-funk-cover.mp3",
      caption: "Listen to how the familiar Auld Lang Syne melody is re-harmonized with funk chords."
    }
  ];

  const currentStyle = styleOptions.find((s) => s.id === selectedStyle) || styleOptions[0];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-600" />
          Interactive: Steering the Model (Style, Covers & Agentic Edits)
        </h4>
        <ToyBadge text="Real YuE2 demo cover recordings & ABC editing" />
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        Explore how user style prompts, melody-first cover modes (<code>cot="melody"</code>), and LLM agentic score editing steer the exact same model weights.
      </p>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("style")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
            activeTab === "style"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-semibold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          1. Style Conditioning
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("covers")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
            activeTab === "covers"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-semibold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          2. Zero-Shot Covers
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("agentic")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
            activeTab === "agentic"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-semibold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          3. Agentic Score Editing
        </button>
      </div>

      {/* Tab 1: Style Conditioning */}
      {activeTab === "style" && (
        <div className="space-y-4">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            Select a Style Prompt to Observe Conditioning:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {styleOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedStyle(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  selectedStyle === opt.id
                    ? "bg-cyan-50 dark:bg-cyan-950/60 border-cyan-500 ring-1 ring-cyan-500"
                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                  {opt.title}
                </span>
                <p className="text-[11px] text-slate-500 font-mono italic">
                  "{opt.prompt}"
                </p>
              </button>
            ))}
          </div>

          <div className="p-3 bg-slate-900 rounded-xl font-mono text-xs text-slate-300">
            <span className="text-slate-500 text-[10px] block mb-0.5">Conditioning Vector Tokens:</span>
            <code>pipe(style="{currentStyle.prompt}", lyrics=lyrics, cot="full")</code>
          </div>

          <AudioPlayer
            src={currentStyle.audioSrc}
            title={currentStyle.title}
            genreTag={currentStyle.prompt.split(",")[0]}
            caption={currentStyle.caption}
          />
        </div>
      )}

      {/* Tab 2: Zero-Shot Covers */}
      {activeTab === "covers" && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100">
              <Music className="w-4 h-4 text-cyan-600" />
              <span>How SheetSage2 + cot="melody" Makes Covers</span>
            </div>
            <ol className="list-decimal pl-5 space-y-1 leading-relaxed text-xs">
              <li>SheetSage2 takes a recording of an existing song and transcribes its vocal melody to ABC notation.</li>
              <li>Chords are wiped out; only the pure pitch notes are preserved.</li>
              <li>YuE2 is called with <code>cot="melody"</code> and a completely new style prompt (e.g. 70s Jazz Funk or Heavy Metal).</li>
              <li>YuE2 invents fresh chords, drums, and bass while singing the exact original melody!</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AudioPlayer
              src="/audio/auld-lang-syne-jazz-funk-cover.mp3"
              title="Auld Lang Syne (Jazz Funk Cover)"
              genreTag="cot='melody'"
              caption="Notice how the 18th-century folk melody is re-harmonized with modern slap bass and brass!"
            />

            <AudioPlayer
              src="/audio/jingle-bells-heavy-metal-cover.mp3"
              title="Jingle Bells (Heavy Metal Cover)"
              genreTag="cot='melody'"
              caption="The holiday melody is sung over double-kick drums and roaring electric guitars."
            />
          </div>
        </div>
      )}

      {/* Tab 3: Agentic Editing */}
      {activeTab === "agentic" && (
        <div className="space-y-4">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              Prompt an LLM Agent to Revise the Score:
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={agentPrompt}
                onChange={(e) => setAgentPrompt(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />
              <button
                type="button"
                onClick={() => setIsDiffApplied((p) => !p)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-xs"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{isDiffApplied ? "Revert Edits" : "Apply Agent Edit"}</span>
              </button>
            </div>
          </div>

          {/* Side by side score diff */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300">
              <span className="text-slate-500 text-[10px] block mb-1">Original YuE2 Score:</span>
              <pre className="text-slate-400">
                {`"C" C2 E2 | "G" G3 E |
"Am" A2 c2 | "F" A4 |
"C" G2 E2 | "G" D3 C | "C" C4 |]`}
              </pre>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300">
              <span className="text-slate-500 text-[10px] block mb-1">
                {isDiffApplied ? "Agent-Revised Score (Diff):" : "Revised Score (Click Apply above)"}
              </span>
              <pre className={isDiffApplied ? "text-emerald-400 font-bold" : "text-slate-500"}>
                {isDiffApplied
                  ? `"Am" C2 E2 | "Em" G3 E |
"Fmaj7" A2 c2 | "Dm7" A4 |
"Am" G2 E2 | "E7" D3 B, | "Am7" C4 |]`
                  : "(Waiting for user instruction)"}
              </pre>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            Because ABC notation is readable ASCII text, general language models can edit notes, substitute chords, or transpose keys with surgical precision before YuE2 re-renders the audio.
          </p>
        </div>
      )}
    </div>
  );
};
