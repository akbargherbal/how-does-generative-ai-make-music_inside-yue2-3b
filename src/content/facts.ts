/**
 * Fact Register for m-a-p/YuE2-3B
 * Strictly verified against the model card and arXiv:2609.33757.
 * Golden Rule G6: Don't invent facts about YuE2.
 */

export interface FactItem {
  id: string;
  name: string;
  detail: string;
  source: string;
  verified: boolean;
  notes?: string;
}

export const YUE2_FACTS: Record<string, FactItem> = {
  developer: {
    id: "developer",
    name: "Developer",
    detail: "M-A-P (Multimodal Art Projection)",
    source: "https://huggingface.co/m-a-p/YuE2-3B",
    verified: true,
  },
  task: {
    id: "task",
    name: "Core Task",
    detail: "Takes lyrics and style prompt to generate a complete song with singing vocals and instrumental accompaniment.",
    source: "https://huggingface.co/m-a-p/YuE2-3B",
    verified: true,
  },
  audio_output: {
    id: "audio_output",
    name: "Audio Output Format",
    detail: "48 kHz stereo audio.",
    source: "https://huggingface.co/m-a-p/YuE2-3B",
    verified: true,
  },
  architecture_claim: {
    id: "architecture_claim",
    name: "Core Backbone",
    detail: "A single AR–NAR Mixture-of-Transformers backbone writes the score and semantic tokens, then generates acoustic latents via flow matching. The VAE decodes them into stereo audio.",
    source: "arXiv:2609.33757",
    verified: true,
  },
  two_stages_audio: {
    id: "two_stages_audio",
    name: "Two Audio Stages",
    detail: "1) Semantic tokens (autoregressive sequence) capturing musical structure and vocal timing. 2) Acoustic latents (non-autoregressive, generated via flow matching) capturing high-resolution sound detail.",
    source: "https://huggingface.co/m-a-p/YuE2-3B",
    verified: true,
  },
  decoder_variants: {
    id: "decoder_variants",
    name: "VAE Decoder Options",
    detail: "YuE2-Vae (default, best perceptual sound quality) and YuE2-Vae-legacy (higher musicality benchmark scores).",
    source: "https://huggingface.co/m-a-p/YuE2-3B",
    verified: true,
  },
  symbolic_planning: {
    id: "symbolic_planning",
    name: "Symbolic Planning in ABC",
    detail: "The model writes a readable sheet music score in ABC notation before generating audio. Users can inspect, edit, or provide their own ABC score.",
    source: "https://huggingface.co/m-a-p/YuE2-3B & arXiv:2609.33757",
    verified: true,
  },
  planning_modes: {
    id: "planning_modes",
    name: "Planning Modes (cot)",
    detail: "'full' = melody + chords (default); 'melody' = melody only (recommended for covers); 'off' = direct audio generation without a symbolic plan.",
    source: "https://huggingface.co/m-a-p/YuE2-3B",
    verified: true,
  },
  guidance_cfg: {
    id: "guidance_cfg",
    name: "Classifier-Free Guidance (CFG)",
    detail: "Semantic CFG defaults to 1.0 for 'full' and 'melody' modes, and 1.01 for 'off'. ABC sampling uses no CFG.",
    source: "https://huggingface.co/m-a-p/YuE2-3B",
    verified: true,
  },
  pipeline_methods: {
    id: "pipeline_methods",
    name: "Python Pipeline Calls",
    detail: "pipe.plan() -> pipe.generate_semantic(plan) -> pipe.synthesize(semantic) -> pipe.decode(latents).",
    source: "https://huggingface.co/m-a-p/YuE2-3B",
    verified: true,
  },
  tokenizer: {
    id: "tokenizer",
    name: "Tokenizer",
    detail: "Uses qwen.tiktoken (a byte-pair encoding BPE tokenizer).",
    source: "https://huggingface.co/m-a-p/YuE2-3B/tree/main",
    verified: true,
  },
  parameter_count: {
    id: "parameter_count",
    name: "Parameter Count",
    detail: "Named YuE2-3B; the model repository lists approximately 3 to 4 billion parameters total across the unified architecture.",
    source: "https://huggingface.co/m-a-p/YuE2-3B",
    verified: true,
  },
  weights_format: {
    id: "weights_format",
    name: "Weights & Precision",
    detail: "model.safetensors, approximately 7.3 GB file size in BF16 (Bfloat16) format.",
    source: "https://huggingface.co/m-a-p/YuE2-3B",
    verified: true,
  },
  hardware_specs: {
    id: "hardware_specs",
    name: "Recommended Hardware",
    detail: "Linux OS, Python 3.10+, and a 24 GB NVIDIA GPU supporting BF16 (such as RTX 3090, 4090, or A10G/A100).",
    source: "https://huggingface.co/m-a-p/YuE2-3B",
    verified: true,
  },
  benchmark_speed: {
    id: "benchmark_speed",
    name: "Inference Speed (RTX 4090)",
    detail: "Generates a 3.6-minute song in approximately 71 seconds, using peak VRAM of ~11 GiB.",
    source: "https://huggingface.co/m-a-p/YuE2-3B",
    verified: true,
  },
  license: {
    id: "license",
    name: "License",
    detail: "Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0).",
    source: "https://huggingface.co/m-a-p/YuE2-3B",
    verified: true,
  },
  supervision_models: {
    id: "supervision_models",
    name: "Companion Models",
    detail: "SheetSage2 (transcribes audio into ABC notation lead-sheets) and MERT2 (music representation learning model used during supervision).",
    source: "arXiv:2609.33757",
    verified: true,
  },
  reproducibility: {
    id: "reproducibility",
    name: "Reproducibility & Artifacts",
    detail: "Accepts a seed integer; pipe.save_artifacts() saves the ABC score, semantic tokens, latents, waveform, and generation metadata.",
    source: "https://huggingface.co/m-a-p/YuE2-3B",
    verified: true,
  }
};
