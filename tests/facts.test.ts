import { describe, expect, it } from 'vitest';
import { YUE2_FACTS } from '@/src/content/facts';

const facts = Object.entries(YUE2_FACTS);

describe('fact register (G6)', () => {
  it('marks every documented fact as verified', () => {
    expect(facts.length).toBeGreaterThan(0);
    facts.forEach(([key, fact]) => {
      expect(fact.id, key).toBe(key);
      expect(fact.verified, key).toBe(true);
      expect(fact.name.trim().length, key).toBeGreaterThan(0);
      expect(fact.detail.trim().length, key).toBeGreaterThan(10);
      expect(fact.source.trim().length, key).toBeGreaterThan(0);
    });
  });

  it('anchors the headline YuE2 claims', () => {
    expect(YUE2_FACTS.developer.detail).toContain('M-A-P');
    expect(YUE2_FACTS.audio_output.detail).toContain('48 kHz');
    expect(YUE2_FACTS.license.detail).toContain('CC BY-NC 4.0');
    expect(YUE2_FACTS.weights_format.detail).toContain('safetensors');
    expect(YUE2_FACTS.tokenizer.detail).toContain('qwen.tiktoken');
  });
});
