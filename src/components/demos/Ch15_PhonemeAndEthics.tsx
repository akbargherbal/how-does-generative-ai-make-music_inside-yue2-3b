import React, { useState } from "react";
import { ToyBadge } from "../common/ToyBadge";
import { Scale, CheckCircle2, XCircle, ExternalLink, ShieldCheck } from "lucide-react";

export const Ch15_PhonemeAndEthics: React.FC = () => {
  const [selectedUseCase, setSelectedUseCase] = useState<string>("research");

  // Simulated phoneme error inspector
  const originalLyric = "Sunlight through the kitchen glass";
  const phonemesIntended = ["S", "AH", "N", "L", "AY", "T", "TH", "R", "UW", "DH", "AH", "K", "IH", "CH", "AH", "N", "G", "L", "AE", "S"];
  // 1 substitution error simulated: [K IH CH AH N] -> [K IH SH AH N]
  const phonemesSung = ["S", "AH", "N", "L", "AY", "T", "TH", "R", "UW", "DH", "AH", "K", "IH", "SH", "AH", "N", "G", "L", "AE", "S"];

  const errorIndices = [13]; // 'SH' instead of 'CH'
  const phonemeErrorRate = (errorIndices.length / phonemesIntended.length) * 100;

  const isCommercial = selectedUseCase === "commercial_sale" || selectedUseCase === "streaming_monetized";

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Scale className="w-4 h-4 text-cyan-600" />
          Interactive: Phoneme Error Rate (PER) & License Checker
        </h4>
        <ToyBadge text="Real metric formula & verified CC BY-NC 4.0 license" />
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        AI singing voices do not have vocal cords or linguistic intent. The <strong>Phoneme Error Rate (PER)</strong> measures how often sung sounds deviate from intended lyrics. Below, inspect a pronunciation analysis and check your legal use under the CC BY-NC 4.0 license.
      </p>

      {/* Part 1: Phoneme Error Rate Meter */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Pronunciation Alignment Inspector: "{originalLyric}"
          </span>
          <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400">
            Simulated PER: {phonemeErrorRate.toFixed(1)}% (1 error in 20 phonemes)
          </span>
        </div>

        {/* Phoneme Alignment Chips */}
        <div className="flex flex-wrap gap-1.5 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-xs">
          {phonemesIntended.map((ph, idx) => {
            const hasError = errorIndices.includes(idx);
            return (
              <div
                key={idx}
                className={`px-2 py-1 rounded text-center border ${
                  hasError
                    ? "bg-rose-100 dark:bg-rose-950 border-rose-400 text-rose-900 dark:text-rose-200 ring-1 ring-rose-400"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                }`}
                title={hasError ? `Pronounced /${phonemesSung[idx]}/ instead of /${ph}/` : `Accurately sung as /${ph}/`}
              >
                <div className="text-[10px] text-slate-400">/{ph}/</div>
                <div className="font-bold">{phonemesSung[idx]}</div>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-500">
          In benchmark evaluations on WildSongBench, YuE2 achieved frontier phoneme accuracy competitive with top proprietary models like Suno v4 and v5.
        </p>
      </div>

      {/* Part 2: License Compliance Checker */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            CC BY-NC 4.0 License Compliance Checker
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <label htmlFor="use_case_select" className="text-xs text-slate-500 self-center shrink-0">
            Intended Use Case:
          </label>
          <select
            id="use_case_select"
            value={selectedUseCase}
            onChange={(e) => setSelectedUseCase(e.target.value)}
            className="flex-1 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
          >
            <option value="research">Personal academic research & open experimentation</option>
            <option value="education">Teaching in a university or non-profit workshop</option>
            <option value="hobby">Hobbyist music creation shared for free with attribution</option>
            <option value="commercial_sale">Selling generated songs on iTunes / Bandcamp for profit</option>
            <option value="streaming_monetized">Monetized commercial streaming in ads or games</option>
          </select>
        </div>

        <div
          className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
            isCommercial
              ? "bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-900 text-rose-900 dark:text-rose-200"
              : "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200"
          }`}
        >
          {isCommercial ? (
            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          )}

          <div>
            <span className="font-bold block mb-0.5">
              {isCommercial
                ? "PROHIBITED without separate commercial license from M-A-P"
                : "PERMITTED under CC BY-NC 4.0"}
            </span>
            <p className="text-[11px] leading-relaxed opacity-90">
              {isCommercial
                ? "The weights of YuE2-3B are released strictly under Creative Commons Non-Commercial terms. You cannot sell generated music or integrate the model into a commercial product without explicit licensing from the authors."
                : "You are fully authorized to download the weights, study the architecture, remix the code, and publish non-commercial songs as long as you attribute M-A-P."}
            </p>
          </div>
        </div>
      </div>

      {/* Part 3: Verified Resources */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
          Primary Sources & Where to Go Next:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <a
            href="https://arxiv.org/abs/2609.33757"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-cyan-500 flex items-center justify-between text-slate-800 dark:text-slate-200 transition-colors"
          >
            <div>
              <strong className="block font-medium">YuE2 Technical Report</strong>
              <span className="text-[11px] text-slate-500 font-mono">arXiv:2609.33757</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>

          <a
            href="https://huggingface.co/m-a-p/YuE2-3B"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-cyan-500 flex items-center justify-between text-slate-800 dark:text-slate-200 transition-colors"
          >
            <div>
              <strong className="block font-medium">Hugging Face Model Card</strong>
              <span className="text-[11px] text-slate-500 font-mono">m-a-p/YuE2-3B</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
