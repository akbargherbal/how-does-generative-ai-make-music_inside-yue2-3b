# Research Notes: YuE2-3B Architecture & Paper (arXiv:2609.33757)

These notes summarize verified details from the model card (`m-a-p/YuE2-3B`) and the technical report *YuE2: Unifying Symbolic and Audio Music Generation at Frontier Quality* (arXiv:2609.33757, Sept 2026).

## 1. Core Architectural Distinctions
- **Symbolic-First Paradigm ("Chain of Thought for Music")**:
  Unlike systems that attempt to generate continuous raw audio or acoustic tokens straight from lyrics, YuE2 introduces an explicit intermediate **symbolic plan** in standard text ABC notation (`pipe.plan()`). This contains key, tempo, time signature, chord progressions, and vocal melody.
- **Unified AR–NAR Mixture-of-Transformers (MoT)**:
  Rather than running completely disjoint disconnected neural networks, YuE2 uses a unified transformer backbone that switches operating modes:
  - *Autoregressive (AR)* for sequential discrete symbolic text and semantic tokens (one token predicting the next).
  - *Non-Autoregressive (NAR) with Flow Matching* for dense acoustic latents (refining all audio frames simultaneously from a random noise prior).
- **Two Stages of Audio Representation**:
  1. *Semantic tokens*: Discrete, low-framerate representations of musical structure and speech phonetics, supervised using MERT2.
  2. *Acoustic latents*: Continuous latent representations decoded by a neural Variational Autoencoder (VAE) into 48 kHz stereo PCM waveforms.

## 2. Parameter Sizing & Compute
- Total parameter count is approximately **3 to 4 Billion parameters** (named "3B", total weights ~7.3 GB in BF16).
- Inference benchmark on single NVIDIA RTX 4090: 3.6-minute stereo song generated in ~71 seconds, consuming ~11 GiB peak VRAM.
- Recommended hardware: 24 GB NVIDIA GPU with BF16 compute support.

## 3. Supervision & Companion Models
- **SheetSage2**: Deep learning transcription model that converts raw song recordings into symbolic ABC notation lead sheets, creating pre-aligned score-to-audio training pairs without manual scoring.
- **MERT2**: State-of-the-art music audio representation model providing semantic audio embeddings.

## 4. Control Modes & Workflows
- `cot="full"`: Generates melody and harmonic chord symbols (default for new songs).
- `cot="melody"`: Generates vocal melody only, leaving chord harmonization open (recommended for cover songs where melody is preserved while style/harmony changes).
- `cot="off"`: Bypasses symbolic plan and generates audio directly.
- **Agentic Editing**: Allows a general LLM to modify the readable ABC notation score based on user prompts (e.g., "transpose to D minor", "add a blues chord progression"), then re-synthesize through YuE2.

## 5. Non-Commercial Licensing
- Distributed under **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.
