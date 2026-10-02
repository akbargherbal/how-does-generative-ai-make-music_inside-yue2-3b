import { describe, expect, it } from 'vitest';
import { CHEAT_SHEET_FACTS, CHEAT_SHEET_STAGES } from '@/src/content/cheatSheet';

describe('architecture cheat sheet', () => {
  it('describes the 5 pipeline stages in order', () => {
    expect(CHEAT_SHEET_STAGES).toHaveLength(5);
    CHEAT_SHEET_STAGES.forEach((stage, index) => {
      expect(stage.step).toBe(index + 1);
      expect(stage.name.trim().length).toBeGreaterThan(0);
      expect(stage.input.trim().length).toBeGreaterThan(0);
      expect(stage.output.trim().length).toBeGreaterThan(0);
      expect(stage.mechanism.trim().length).toBeGreaterThan(0);
      expect(stage.dataSize.trim().length).toBeGreaterThan(0);
      expect(stage.codeSnippet.trim().length).toBeGreaterThan(0);
      expect(stage.keyTakeaway.trim().length).toBeGreaterThan(0);
    });
  });

  it('includes the canonical stage keys used by the pipeline map', () => {
    expect(CHEAT_SHEET_STAGES.map((s) => s.stageKey)).toEqual([
      'tokens',
      'plan',
      'semantic',
      'acoustic',
      'decode',
    ]);
  });

  it('summarises the key architecture facts', () => {
    const labels = CHEAT_SHEET_FACTS.map((f) => f.label);
    expect(labels).toContain('Model Architecture');
    expect(labels).toContain('Audio Output');
    expect(labels).toContain('License');
    CHEAT_SHEET_FACTS.forEach((fact) => {
      expect(fact.value.trim().length).toBeGreaterThan(0);
    });
  });
});
