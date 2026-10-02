import { Chapter } from "../types";
import { ch00_overview, ch01_generative, ch02_tokens, ch03_embeddings } from "./ch00_to_03";
import { ch04_transformer, ch05_autoregression, ch06_training } from "./ch04_to_06";
import { ch07_harder, ch08_stage1_plan, ch09_stage2_semantic } from "./ch07_to_09";
import { ch10_stage3_latents, ch11_stage4_vae, ch12_brain_layout } from "./ch10_to_12";
import { ch13_walkthrough, ch14_steering, ch15_limits_ethics } from "./ch13_to_15";

export const CHAPTERS: Chapter[] = [
  ch00_overview,
  ch01_generative,
  ch02_tokens,
  ch03_embeddings,
  ch04_transformer,
  ch05_autoregression,
  ch06_training,
  ch07_harder,
  ch08_stage1_plan,
  ch09_stage2_semantic,
  ch10_stage3_latents,
  ch11_stage4_vae,
  ch12_brain_layout,
  ch13_walkthrough,
  ch14_steering,
  ch15_limits_ethics
];

export function getChapterBySlug(slug: string): Chapter | undefined {
  return CHAPTERS.find((ch) => ch.slug === slug);
}

export function getChapterById(id: number): Chapter | undefined {
  return CHAPTERS.find((ch) => ch.id === id);
}
