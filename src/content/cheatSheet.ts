export interface CheatSheetStage {
  step: number;
  name: string;
  stageKey: string;
  input: string;
  output: string;
  mechanism: string;
  dataSize: string;
  codeSnippet: string;
  keyTakeaway: string;
}

export const CHEAT_SHEET_STAGES: CheatSheetStage[] = [
  {
    step: 1,
    name: "Input Tokenization",
    stageKey: "tokens",
    input: "Lyrics + Style prompt text",
    output: "List of integer token IDs",
    mechanism: "qwen.tiktoken sub-word BPE tokenizer",
    dataSize: "~50 to 200 token IDs",
    codeSnippet: "tokens = tokenizer.encode(lyrics + style)",
    keyTakeaway: "Text is broken into numbered LEGO bricks from a fixed vocabulary."
  },
  {
    step: 2,
    name: "Symbolic Planning",
    stageKey: "plan",
    input: "Token IDs + Style context",
    output: "ABC notation sheet music score",
    mechanism: "Autoregressive transformer (cot='full' or 'melody')",
    dataSize: "~200 to 500 ABC text tokens",
    codeSnippet: "plan = pipe.plan(style=style, lyrics=lyrics, cot='full')",
    keyTakeaway: "Decouples musical composition (melody, harmony, meter) from sound physics."
  },
  {
    step: 3,
    name: "Semantic Rough Draft",
    stageKey: "semantic",
    input: "ABC Plan + Lyrics + Style",
    output: "Discrete semantic audio tokens",
    mechanism: "Autoregressive generation with Classifier-Free Guidance (CFG)",
    dataSize: "~25 to 50 tokens per second (~4,000 tokens)",
    codeSnippet: "semantic = pipe.generate_semantic(plan, cfg_scale=1.0)",
    keyTakeaway: "Captures vocal timing, phonetics, and musical rhythm at a low framerate."
  },
  {
    step: 4,
    name: "Acoustic Latent Synthesis",
    stageKey: "acoustic",
    input: "Semantic tokens + Gaussian random noise",
    output: "Continuous dense acoustic latents",
    mechanism: "Non-autoregressive flow matching across N integration steps",
    dataSize: "~50 continuous frames per second across channels",
    codeSnippet: "latents = pipe.synthesize(semantic, num_steps=25)",
    keyTakeaway: "Sculpts fine harmonic textures and instrument timbres all at once in parallel."
  },
  {
    step: 5,
    name: "Waveform Decoding",
    stageKey: "decode",
    input: "Acoustic latents",
    output: "48 kHz stereo PCM audio waveform",
    mechanism: "Neural VAE decoder (YuE2-Vae)",
    dataSize: "96,000 float samples per second (17.28M for 3-min song)",
    codeSnippet: "audio = pipe.decode(latents); pipe.save(audio, 'song.flac')",
    keyTakeaway: "Expands compact latents into high-fidelity speaker displacement values."
  }
];

export const CHEAT_SHEET_FACTS = [
  { label: "Model Architecture", value: "AR–NAR Mixture-of-Transformers (MoT)" },
  { label: "Parameter Count", value: "~3–4 Billion parameters (7.3 GB BF16 safetensors)" },
  { label: "Audio Output", value: "48,000 Hz (48 kHz) Stereo" },
  { label: "Inference Speed", value: "3.6 min audio in ~71 sec on RTX 4090 (~11 GiB VRAM)" },
  { label: "Planning Modes", value: "cot='full' (melody + chords), cot='melody' (covers), cot='off'" },
  { label: "License", value: "CC BY-NC 4.0 (Non-commercial study and research)" }
];
