import { QuizQuestion } from "./types";

export const FINAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "fq_1",
    question: "What are the four core stages of music generation in YuE2-3B?",
    options: [
      "Record -> AutoTune -> Mix -> Master",
      "Plan (ABC sheet music) -> Semantic tokens -> Acoustic latents (flow matching) -> Waveform (VAE decode)",
      "Text -> Speech -> MIDI -> MP3",
      "Lyrics -> Translation -> Drum loop -> Stereo split"
    ],
    correctIndex: 1,
    explanation: "YuE2 breaks generation into: 1) Symbolic plan in ABC notation, 2) Semantic tokens via AR transformer, 3) Acoustic latents via NAR flow matching, and 4) Waveform via VAE decoder."
  },
  {
    id: "fq_2",
    question: "Why does 1 second of 48 kHz stereo audio contain 96,000 numbers?",
    options: [
      "Because each of the 2 channels (Left & Right) requires 48,000 discrete pressure measurements every second",
      "Because the GPU uses 96-bit processors",
      "Because there are 96 keys on a standard piano",
      "Because of a calculation error in Python"
    ],
    correctIndex: 0,
    explanation: "48 kHz means 48,000 samples per second. Multiplied by 2 stereo channels equals 96,000 numbers every single second."
  },
  {
    id: "fq_3",
    question: "What is the difference between Autoregressive (AR) and Non-Autoregressive (NAR) generation?",
    options: [
      "AR is written in Python, while NAR is written in C++",
      "AR predicts one token sequentially after another; NAR predicts/refines all time positions simultaneously in parallel",
      "AR only creates vocals, while NAR only creates drums",
      "AR requires 100 GB of VRAM, while NAR uses zero memory"
    ],
    correctIndex: 1,
    explanation: "AR proceeds sequentially step-by-step from left to right; NAR generates or refines all frames at once across time."
  },
  {
    id: "fq_4",
    question: "What does setting `cot='melody'` enable in YuE2?",
    options: [
      "It turns off the vocal track completely",
      "It fixes the vocal melody line while allowing the model to freely compose new harmonies and style (ideal for covers)",
      "It forces the model to sing in German",
      "It speeds up inference by 1,000 times"
    ],
    correctIndex: 1,
    explanation: "In `cot='melody'` mode, the symbolic plan specifies only the melody notes, giving the model full freedom to harmonize in whatever genre you choose."
  },
  {
    id: "fq_5",
    question: "How does flow matching generate acoustic latents from noise?",
    options: [
      "It searches Google for similar sounds",
      "It starts with random Gaussian noise and nudges points along learned straight velocity vector paths over N steps",
      "It reverses an existing song",
      "It records live microphone input"
    ],
    correctIndex: 1,
    explanation: "Flow matching transforms a simple noise distribution into a complex target latent distribution by following learned velocity fields over integration steps."
  },
  {
    id: "fq_6",
    question: "What does the Attention mechanism in a transformer calculate?",
    options: [
      "The electricity cost of the computer",
      "The percentage of relevance/focus each token should give to every other token in the sequence",
      "The physical decibel level of the song",
      "The internet download speed"
    ],
    correctIndex: 1,
    explanation: "Attention uses Query and Key dot-products normalized by softmax to calculate how much each token should attend to all other tokens."
  },
  {
    id: "fq_7",
    question: "What does the `seed` parameter ensure in generative sampling?",
    options: [
      "That the song will be shared on social media",
      "Deterministic reproducibility: using the same seed and settings will produce the exact same song",
      "That the audio is compressed to MP3",
      "That all lyrics rhyme"
    ],
    correctIndex: 1,
    explanation: "Initializing pseudo-random number generators with the identical seed guarantees identical outputs given the same inputs and weights."
  },
  {
    id: "fq_8",
    question: "Which component of the Variational Autoencoder (VAE) turns acoustic latents into 48 kHz stereo audio?",
    options: [
      "The Encoder",
      "The Decoder",
      "The Tokenizer",
      "The Causal Mask"
    ],
    correctIndex: 1,
    explanation: "The Decoder takes the compact, compressed acoustic latents and upsamples them into the final full-resolution stereo audio waveform."
  },
  {
    id: "fq_9",
    question: "Under what license is YuE2-3B released, and what does it permit?",
    options: [
      "CC BY-NC 4.0: free for study, experimentation, and non-commercial projects with attribution; commercial use is prohibited without a separate license",
      "Closed source / All Rights Reserved",
      "MIT License permitting unrestricted commercial sale without attribution",
      "Public domain"
    ],
    correctIndex: 0,
    explanation: "YuE2 is released under Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)."
  },
  {
    id: "fq_10",
    question: "What is an 'AR–NAR Mixture-of-Transformers'?",
    options: [
      "A bundle of 50 different MP3 players",
      "A unified transformer backbone capable of switching between sequential causal generation and parallel flow matching synthesis",
      "A brand of audio cables",
      "An algorithm that only runs on quantum computers"
    ],
    correctIndex: 1,
    explanation: "YuE2 unifies both sequential autoregressive generation (for text and semantic tokens) and parallel non-autoregressive synthesis (for acoustic latents) within one shared transformer backbone."
  }
];
