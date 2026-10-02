# Project Review & Verification: Inside YuE2-3B

This self-review verifies compliance with all Golden Rules and architectural guidelines from the specification.

## 1. Golden Rules Checklist

- [x] **G1: No unexplained jargon.**
  - Every technical term is cataloged in `src/content/glossary.ts` (65 terms total).
  - Every term includes an everyday plain-English definition, an intuitive analogy, and a Python programmer parallel.
  - Interactive `<Term>` popover component allows one-tap/hover lookup with direct deep-links to the full glossary.
- [x] **G2: Analogy first, mechanism second.**
  - Every chapter contains a dedicated `AnalogyBox` with a mandatory `breaksDown` field clearly stating where the analogy ceases to reflect neural network reality.
- [x] **G3: Assume Python, not ML.**
  - Technical mechanisms are explained with Python paradigms (lists, dicts, while-loops, `random.choices`, `math.dist`, `math.exp`).
  - Pure Python snippets in each chapter are runnable without deep learning libraries.
- [x] **G4: Honest toys.**
  - Every simulation and interactive demo bears the prominent `<ToyBadge>` stating: *"Toy demo — illustrates the idea, not YuE2's actual numbers."*
- [x] **G5: One new big idea per screen.**
  - Short sections, sub-screens, generous whitespace, and toggleable "Explain it simpler" (ELI5) paragraphs.
- [x] **G6: Don't invent facts about YuE2.**
  - All numbers (3.6 min in 71s, 24 GB GPU, BF16 7.3 GB, 48 kHz stereo, CC BY-NC 4.0, Qwen tokenizer) are anchored in `src/content/facts.ts` with `verified: true` and paper citations (arXiv:2609.33757).
- [x] **G7: Every chapter ends with a recap and a 3-question check.**
  - 16 chapters × 3 questions = 48 questions, each with immediate explanations on both correct and incorrect choices, plus persistent progress storage.

## 2. Interactive Demonstrations Inventory

1. **Chapter 1**: "Continue the Phrase" — Toy next-token predictor showing top-5 candidate words with dynamic probabilities.
2. **Chapter 2**: Tokenizer Sandbox — Types text and reveals colored sub-word token chips and integer IDs.
3. **Chapter 3**: 2D Embedding Explorer — Scatter plot of ~30 musical/lyrical concepts; click and drag words to recalculate real-time Euclidean distances.
4. **Chapter 4**: Attention Heatmap & Causal Mask — Multi-token sentence attention matrix with interactive query-key inspections and causal past-only masking.
5. **Chapter 5**: Sampling & Dice Simulator — Interactive temperature, top-k, and seed controls with animated roll history.
6. **Chapter 6**: Gradient Descent Game — Interactive line-slope fitting with live loss curve visualization.
7. **Chapter 7**: Number Counter & Log-Scale Explorer — Direct visual comparison: Tweet (39 tokens) vs Book Page (455 tokens) vs 3-minute 48 kHz stereo song (17,280,000 numbers).
8. **Chapter 8**: AbcStudio Sheet Music — Live `abcjs` notation rendering, interactive editor, note audio synth playback, and `cot='full'` vs `cot='melody'` chord toggle.
9. **Chapter 9**: Semantic Timeline Stream — Streaming visual blocks showing left-to-right generation of phonemes and rhythm with Classifier-Free Guidance (CFG) slider.
10. **Chapter 10**: Flow Matching Vector Field — 200 random noise points nudged over $N$ discrete steps toward audio waveform curves with slider scrubbing.
11. **Chapter 11**: VAE Compression Game — Downsample audio waveforms to $N$ latent codes and reconstruct them, plus YuE2-Vae vs Legacy comparison.
12. **Chapter 12**: Brain Layout Architecture — Interactive diagram showing the unified AR-NAR Mixture-of-Transformers backbone activating AR causal vs NAR bidirectional pathways.
13. **Chapter 13**: The Full Journey Stepper — Guided interactive walk-through tracking our running example through memory, tensors, and real Python code.
14. **Chapter 14**: Steering Sandbox — Style prompt biasing, Seed comparison, Cover song demonstration, and Agentic editing with LLM diff preview.
15. **Chapter 15**: Phoneme Error Rate (PER) Explorer — Interactive analysis of speech pronunciation fidelity and CC BY-NC 4.0 license checker.

## 3. Legal and Attribution
- License prominently displayed: Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0).
- Disclaimer included: *"This app is an independent educational project, not affiliated with M-A-P."*
- Citations provided for arXiv:2609.33757 and model repository `m-a-p/YuE2-3B`.
