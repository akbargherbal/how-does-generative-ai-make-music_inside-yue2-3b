import React, { useState, useEffect, useRef } from "react";
import abcjs from "abcjs";
import { ToyBadge } from "../common/ToyBadge";
import { Music, Play, Square, RotateCcw, Sliders } from "lucide-react";

const PRESET_TUNES = {
  morning_light: {
    name: "Morning Light (Running Example)",
    withChords: `X:1
T:Morning Light
C:YuE2-3B Symbolic Plan
M:4/4
L:1/4
Q:110
K:C
"C" C2 E2 | "G" G3 E | "Am" A2 c2 | "F" A4 |
"C" G2 E2 | "G" D3 C | "C" C4 |]`,
    melodyOnly: `X:1
T:Morning Light (Melody Only)
C:YuE2-3B Symbolic Plan
M:4/4
L:1/4
Q:110
K:C
C2 E2 | G3 E | A2 c2 | A4 |
G2 E2 | D3 C | C4 |]`
  },
  auld_lang_syne: {
    name: "Auld Lang Syne (Traditional Folk)",
    withChords: `X:2
T:Auld Lang Syne
M:4/4
L:1/4
Q:95
K:F
C | "F" F>F A F | "C" G>F G A | "F" F>F A c | "Bb" d3 d |
"F" c>A A F | "C" G>F G A | "Dm" F>D "C" D C | "F" F3 |]`,
    melodyOnly: `X:2
T:Auld Lang Syne (Melody Only)
M:4/4
L:1/4
Q:95
K:F
C | F>F A F | G>F G A | F>F A c | d3 d |
c>A A F | G>F G A | F>D D C | F3 |]`
  }
};

export const Ch08_AbcStudio: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<"morning_light" | "auld_lang_syne">("morning_light");
  const [hasChords, setHasChords] = useState<boolean>(true);
  const [abcText, setAbcText] = useState<string>(PRESET_TUNES.morning_light.withChords);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [synthError, setSynthError] = useState<string | null>(null);

  const notationContainerRef = useRef<HTMLDivElement>(null);
  const synthControllerRef = useRef<unknown>(null);
  const visualObjRef = useRef<unknown>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Render ABC notation into SVG whenever abcText changes
  useEffect(() => {
    if (!notationContainerRef.current) return;

    try {
      setSynthError(null);
      notationContainerRef.current.innerHTML = "";
      const visual = abcjs.renderAbc(notationContainerRef.current, abcText, {
        responsive: "resize",
        scale: 1.0,
        staffwidth: 600,
        add_classes: true
      });
      visualObjRef.current = visual[0];
    } catch (err: unknown) {
      setSynthError((err as Error).message || "Invalid ABC notation format");
    }
  }, [abcText]);

  // Handle chord toggle (cot="full" vs cot="melody")
  const handleToggleChords = (enabled: boolean) => {
    setHasChords(enabled);
    const tune = PRESET_TUNES[selectedPreset];
    setAbcText(enabled ? tune.withChords : tune.melodyOnly);
  };

  const handleSelectPreset = (key: "morning_light" | "auld_lang_syne") => {
    setSelectedPreset(key);
    const tune = PRESET_TUNES[key];
    setAbcText(hasChords ? tune.withChords : tune.melodyOnly);
  };

  // Play audio synthesizer via Web Audio API & abcjs synth
  const handlePlaySynth = async () => {
    if (isPlaying) {
      if (synthControllerRef.current) {
        try {
          (synthControllerRef.current as { pause: () => void }).pause();
        } catch {
          // ignore
        }
      }
      setIsPlaying(false);
      return;
    }

    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }

      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      const visualObj = visualObjRef.current;
      if (!visualObj) return;

      const synth = new abcjs.synth.CreateSynth();
      await (synth.init as (params: unknown) => Promise<unknown>)({
        visualObj,
        audioContext: audioContextRef.current,
        millisecondsPerMeasure: 2000
      });

      await synth.prime();
      synth.start();
      setIsPlaying(true);
      synthControllerRef.current = synth;

      // Reset after reasonable playtime
      setTimeout(() => {
        setIsPlaying(false);
      }, 10000);
    } catch {
      // Fallback simple tone synth if soundfonts fail to load
      playWebAudioFallback();
    }
  };

  // Safe fallback tone generator
  const playWebAudioFallback = () => {
    try {
      const ctx = audioContextRef.current || new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = ctx;

      const notes = [261.63, 329.63, 392.0, 440.0, 523.25, 392.0, 261.63]; // C E G A C G C
      let time = ctx.currentTime;
      setIsPlaying(true);

      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.2, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.5);
        time += 0.6;
      });

      setTimeout(() => setIsPlaying(false), (time - ctx.currentTime) * 1000);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Music className="w-4 h-4 text-cyan-600" />
          Interactive: AbcStudio (ABC Notation & Live Sheet Music)
        </h4>
        <ToyBadge text="Real ABCjs parser & Web Audio synth engine" />
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        YuE2 writes music in plain-text ABC notation. Edit the notes below (e.g., change <code>C2</code> to <code>G2</code>), and watch the sheet music redraw in real time. Click <strong>"Play Plan"</strong> to hear the pitches!
      </p>

      {/* Mode and Preset Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs">
        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Select Plan:</span>
          <button
            type="button"
            onClick={() => handleSelectPreset("morning_light")}
            className={`px-2.5 py-1 rounded-lg border transition-colors ${
              selectedPreset === "morning_light"
                ? "bg-cyan-600 text-white border-cyan-600"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            }`}
          >
            Morning Light
          </button>
          <button
            type="button"
            onClick={() => handleSelectPreset("auld_lang_syne")}
            className={`px-2.5 py-1 rounded-lg border transition-colors ${
              selectedPreset === "auld_lang_syne"
                ? "bg-cyan-600 text-white border-cyan-600"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            }`}
          >
            Auld Lang Syne
          </button>
        </div>

        {/* Chords Toggle (cot="full" vs cot="melody") */}
        <div className="flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Planning Mode:</span>
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              type="button"
              onClick={() => handleToggleChords(true)}
              className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                hasChords ? "bg-cyan-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              cot="full" (Chords)
            </button>
            <button
              type="button"
              onClick={() => handleToggleChords(false)}
              className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                !hasChords ? "bg-cyan-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              cot="melody" (Covers)
            </button>
          </div>
        </div>
      </div>

      {/* Editor & Render Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Editable ABC Textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="abc_editor" className="font-semibold text-slate-700 dark:text-slate-300">
              Editable ABC Text:
            </label>
            <span className="font-mono text-[11px] text-slate-400">Letters = Notes, "Am" = Chords</span>
          </div>

          <textarea
            id="abc_editor"
            value={abcText}
            onChange={(e) => setAbcText(e.target.value)}
            rows={8}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-slate-100 focus:outline-cyan-500 leading-relaxed"
          />

          {synthError && (
            <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg border border-rose-200 dark:border-rose-900">
              {synthError}
            </p>
          )}
        </div>

        {/* Live Rendered Sheet Music (SVG) */}
        <div className="space-y-1.5 flex flex-col">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Live Sheet Music Render:
            </span>
            <span className="text-[11px] text-slate-400">Rendered via abcjs</span>
          </div>

          <div
            ref={notationContainerRef}
            className="flex-1 min-h-[160px] p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-x-auto flex items-center justify-center text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={handlePlaySynth}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
        >
          {isPlaying ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          <span>{isPlaying ? "Stop Synthesizer" : "Play Plan (Synth Audio)"}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const tune = PRESET_TUNES[selectedPreset];
            setAbcText(hasChords ? tune.withChords : tune.melodyOnly);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Notes</span>
        </button>
      </div>
    </div>
  );
};
