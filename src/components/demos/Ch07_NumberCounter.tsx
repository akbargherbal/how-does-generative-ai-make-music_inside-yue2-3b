import React, { useState } from "react";
import { ToyBadge } from "../common/ToyBadge";
import { Calculator, Music } from "lucide-react";

export const Ch07_NumberCounter: React.FC = () => {
  const [songMinutes, setSongMinutes] = useState<number>(3.6); // Default to YuE2 benchmark duration
  const [sampleRate, setSampleRate] = useState<number>(48000); // 48 kHz
  const [channels, setChannels] = useState<number>(2); // Stereo

  // Calculations
  const tweetWords = 30;
  const tweetTokens = Math.round(tweetWords * 1.3); // ~39

  const bookPageWords = 350;
  const bookPageTokens = Math.round(bookPageWords * 1.3); // ~455

  const novelWords = 80000;
  const novelTokens = Math.round(novelWords * 1.3); // ~104,000

  const songSeconds = Math.round(songMinutes * 60);
  const totalAudioSamples = songSeconds * sampleRate * channels;
  const audioMegaBytesFloat32 = (totalAudioSamples * 4) / (1024 * 1024);

  // Logarithmic scale values for visual bar comparison (log10)
  const logTweet = Math.log10(tweetTokens); // ~1.59
  const logBook = Math.log10(bookPageTokens); // ~2.65
  const logNovel = Math.log10(novelTokens); // ~5.01
  const logSong = Math.log10(totalAudioSamples); // ~7.31

  const maxLog = 8; // 100,000,000

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-cyan-600" />
          Interactive: The Audio Data Explosion Counter
        </h4>
        <ToyBadge text="Real math calculation — verify with your calculator!" />
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        Compare how many discrete numerical elements a neural network must predict for text versus raw 48 kHz stereo music. Notice how audio dwarfs even a full-length 300-page novel!
      </p>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-xs">
        <div>
          <label htmlFor="duration_select" className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Song Duration:
          </label>
          <select
            id="duration_select"
            value={songMinutes}
            onChange={(e) => setSongMinutes(parseFloat(e.target.value))}
            className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          >
            <option value={0.5}>30 Seconds (Short hook)</option>
            <option value={1.0}>1 Minute (Jingle)</option>
            <option value={3.0}>3.0 Minutes (Radio edit)</option>
            <option value={3.6}>3.6 Minutes (YuE2 Benchmark standard)</option>
            <option value={5.0}>5.0 Minutes (Full album track)</option>
          </select>
        </div>

        <div>
          <label htmlFor="sr_select" className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Sample Rate:
          </label>
          <select
            id="sr_select"
            value={sampleRate}
            onChange={(e) => setSampleRate(parseInt(e.target.value, 10))}
            className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          >
            <option value={48000}>48,000 Hz (48 kHz — YuE2)</option>
            <option value={44100}>44,100 Hz (44.1 kHz — CD Quality)</option>
            <option value={24000}>24,000 Hz (24 kHz — Low Quality)</option>
          </select>
        </div>

        <div>
          <label htmlFor="chan_select" className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Audio Channels:
          </label>
          <select
            id="chan_select"
            value={channels}
            onChange={(e) => setChannels(parseInt(e.target.value, 10))}
            className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          >
            <option value={2}>Stereo (2 Channels — Left + Right)</option>
            <option value={1}>Mono (1 Channel)</option>
          </select>
        </div>
      </div>

      {/* Logarithmic Comparison Bars */}
      <div className="space-y-3 pt-1">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
          Scale Comparison (Logarithmic 1 to 100,000,000):
        </span>

        {/* 1. Tweet */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>A 30-word Tweet / Post</span>
            <span className="font-mono tabular-nums">{tweetTokens.toLocaleString()} tokens</span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-400 rounded-full"
              style={{ width: `${(logTweet / maxLog) * 100}%` }}
            />
          </div>
        </div>

        {/* 2. Book Page */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>A full book page (350 words)</span>
            <span className="font-mono tabular-nums">{bookPageTokens.toLocaleString()} tokens</span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400 rounded-full"
              style={{ width: `${(logBook / maxLog) * 100}%` }}
            />
          </div>
        </div>

        {/* 3. Entire Novel */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>A full 300-page novel (80,000 words)</span>
            <span className="font-mono tabular-nums">{novelTokens.toLocaleString()} tokens</span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${(logNovel / maxLog) * 100}%` }}
            />
          </div>
        </div>

        {/* 4. The Song */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-xs font-bold text-cyan-900 dark:text-cyan-300">
            <span className="flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" />
              This {songMinutes}-Minute Song (Raw PCM Numbers)
            </span>
            <span className="font-mono text-sm tabular-nums">
              {totalAudioSamples.toLocaleString()} numbers!
            </span>
          </div>
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-cyan-300 dark:border-cyan-800">
            <div
              className="h-full bg-linear-to-r from-cyan-600 to-cyan-400 rounded-full shadow-md"
              style={{ width: `${(logSong / maxLog) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Math Breakdown Box */}
      <div className="p-4 bg-slate-900 rounded-xl text-slate-200 font-mono text-xs space-y-1">
        <span className="text-slate-400 text-[10px] block uppercase tracking-wider">
          Live Verification Formula:
        </span>
        <p className="text-cyan-300">
          {songSeconds} sec × {sampleRate.toLocaleString()} samples/sec × {channels} channels ={" "}
          <strong className="text-white text-sm">{totalAudioSamples.toLocaleString()}</strong> floats
        </p>
        <p className="text-slate-400 text-[11px]">
          In memory as 32-bit floats: {audioMegaBytesFloat32.toFixed(1)} MB uncompressed.
        </p>
      </div>
    </div>
  );
};
