import React, { useState } from "react";
import { ToyBadge } from "../common/ToyBadge";
import { Hash, Sparkles } from "lucide-react";

// Toy vocabulary dictionary with realistic sub-word tokens
const TOY_VOCAB: Record<string, number> = {
  "Sun": 4120,
  "light": 1823,
  "through": 948,
  "the": 262,
  "kitchen": 19402,
  "glass": 6128,
  "Watch": 14210,
  "quiet": 8110,
  "morning": 3329,
  "pass": 2108,
  "Indie": 38100,
  "pop": 7192,
  "warm": 5812,
  "female": 11094,
  "vocal": 8840,
  "acoustic": 14902,
  "guitar": 9012,
  "soft": 6204,
  "drums": 10419,
  "X:1": 9001,
  "M:4/4": 9002,
  "K:C": 9003,
  "C": 43,
  "D": 44,
  "E": 45,
  "F": 46,
  "G": 47,
  "A": 41,
  "B": 42,
  "|": 124,
  "\"Am\"": 9050,
  "\"G\"": 9051,
  " ": 220,
  ",": 11,
  ".": 13,
  "\n": 198
};

// Colors for chip backgrounds
const CHIP_COLORS = [
  "bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-800",
  "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800",
  "bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800",
  "bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-800",
  "bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-800",
  "bg-cyan-100 dark:bg-cyan-950/80 text-cyan-900 dark:text-cyan-200 border-cyan-300 dark:border-cyan-800"
];

export const Ch02_TokenizerDemo: React.FC = () => {
  const [inputText, setInputText] = useState(
    "Sunlight through the kitchen glass, quiet morning"
  );

  // Greedy sub-word tokenizer implementation
  const tokenize = (text: string) => {
    const tokens: Array<{ token: string; id: number; colorClass: string }> = [];
    let i = 0;
    let colorIdx = 0;

    while (i < text.length) {
      let matched = false;
      // Try chunks from longest down to 1
      for (let len = 10; len >= 1; len--) {
        const chunk = text.slice(i, i + len);
        if (chunk in TOY_VOCAB) {
          tokens.push({
            token: chunk,
            id: TOY_VOCAB[chunk],
            colorClass: CHIP_COLORS[colorIdx % CHIP_COLORS.length]
          });
          i += len;
          matched = true;
          colorIdx++;
          break;
        }
      }

      if (!matched) {
        // Fallback: character code
        const char = text[i];
        tokens.push({
          token: char,
          id: char.charCodeAt(0) + 1000,
          colorClass: CHIP_COLORS[colorIdx % CHIP_COLORS.length]
        });
        i++;
        colorIdx++;
      }
    }
    return tokens;
  };

  const tokens = tokenize(inputText);

  const presets = [
    { label: "Running Lyrics", text: "Sunlight through the kitchen glass, quiet morning" },
    { label: "Style Prompt", text: "Indie pop, warm female vocal, acoustic guitar, soft drums" },
    { label: "ABC Sheet Music", text: "K:C | \"Am\" C D E | \"G\" G E C |" }
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Hash className="w-4 h-4 text-cyan-600" />
          Interactive: Sub-Word Tokenizer & Vocabulary
        </h4>
        <ToyBadge />
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        Type or edit any text below to see how words and music symbols break into colored sub-word tokens, each with a unique catalog integer ID. Notice how "Sunlight" splits into two tokens ("Sun" and "light").
      </p>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-slate-500 self-center">Try presets:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setInputText(p.text)}
            className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Text Box */}
      <div>
        <label htmlFor="tok_input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Input Text / Music String:
        </label>
        <textarea
          id="tok_input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={2}
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-cyan-500"
        />
      </div>

      {/* Token Chips Display */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Token Breakdown ({tokens.length} tokens):</span>
          <span>Hover chip to inspect ID</span>
        </div>

        <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 min-h-[60px] items-center">
          {tokens.map((t, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono shadow-2xs ${t.colorClass}`}
              title={`Token string: "${t.token}" -> ID: ${t.id}`}
            >
              <span className="font-semibold">{t.token === " " ? "␣" : t.token}</span>
              <span className="text-[10px] opacity-70 border-l pl-1.5 border-current">
                #{t.id}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Integer sequence */}
      <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
        <span className="text-slate-500 block mb-1">What the GPU actually receives (List of IDs):</span>
        <code>[{tokens.map((t) => t.id).join(", ")}]</code>
      </div>
    </div>
  );
};
