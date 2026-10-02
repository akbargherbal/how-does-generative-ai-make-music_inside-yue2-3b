import { describe, expect, it } from 'vitest';
import { CHAPTERS, getChapterById, getChapterBySlug } from '@/src/content/chapters';
import { GLOSSARY } from '@/src/content/glossary';
import { YUE2_FACTS } from '@/src/content/facts';
import type { PipelineStage } from '@/src/content/types';

const VALID_STAGES: PipelineStage[] = [
  'overview',
  'foundations',
  'plan',
  'semantic',
  'acoustic',
  'decode',
  'wrapup',
];

describe('chapters collection', () => {
  it('contains all 16 chapters with sequential, unique ids', () => {
    expect(CHAPTERS).toHaveLength(16);
    expect(CHAPTERS.map((ch) => ch.id)).toEqual([...Array(16).keys()]);
  });

  it('has unique, non-empty slugs', () => {
    const slugs = CHAPTERS.map((ch) => ch.slug);
    expect(new Set(slugs).size).toBe(CHAPTERS.length);
    slugs.forEach((slug) => expect(slug).toMatch(/^[a-z0-9-]+$/));
  });

  it('uses only valid pipeline stages', () => {
    CHAPTERS.forEach((ch) => expect(VALID_STAGES).toContain(ch.pipelineStage));
  });

  it('provides a positive estimated reading time', () => {
    CHAPTERS.forEach((ch) => expect(ch.estMinutes).toBeGreaterThan(0));
  });

  it('exposes lookup helpers that find and reject chapters', () => {
    CHAPTERS.forEach((ch) => {
      expect(getChapterById(ch.id)).toBe(ch);
      expect(getChapterBySlug(ch.slug)).toBe(ch);
    });
    expect(getChapterById(999)).toBeUndefined();
    expect(getChapterBySlug('does-not-exist')).toBeUndefined();
  });

  it('gives every chapter the required analogy fields (G2)', () => {
    CHAPTERS.forEach((ch) => {
      expect(ch.analogy.title.trim().length).toBeGreaterThan(0);
      expect(ch.analogy.body.trim().length).toBeGreaterThan(20);
      expect(ch.analogy.breaksDown.trim().length).toBeGreaterThan(20);
    });
  });

  it('gives every chapter 3-5 recap bullets (G7)', () => {
    CHAPTERS.forEach((ch) => {
      expect(ch.recap.length).toBeGreaterThanOrEqual(3);
      expect(ch.recap.length).toBeLessThanOrEqual(5);
    });
  });

  it('gives every chapter non-empty concept sections', () => {
    CHAPTERS.forEach((ch) => {
      expect(ch.concept.length).toBeGreaterThan(0);
      ch.concept.forEach((section) => {
        expect(section.heading.trim().length).toBeGreaterThan(0);
        expect(section.content.trim().length).toBeGreaterThan(20);
      });
    });
  });
});

describe('chapter quizzes (G7)', () => {
  it('has exactly 3 well-formed questions per chapter', () => {
    CHAPTERS.forEach((ch) => {
      expect(ch.quiz).toHaveLength(3);
      ch.quiz.forEach((q) => {
        expect(q.id.trim().length).toBeGreaterThan(0);
        expect(q.question.trim().length).toBeGreaterThan(10);
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.length);
        expect(q.explanation.trim().length).toBeGreaterThan(10);
      });
    });
  });

  it('uses globally unique quiz question ids', () => {
    const ids = CHAPTERS.flatMap((ch) => ch.quiz.map((q) => q.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('chapter cross-references', () => {
  it('references only glossary terms that exist (G1)', () => {
    CHAPTERS.forEach((ch) => {
      ch.newTerms.forEach((termId) => {
        expect(GLOSSARY, `chapter ${ch.id} -> ${termId}`).toHaveProperty(termId);
      });
    });
  });

  it('references only verified, existing facts (G6)', () => {
    CHAPTERS.forEach((ch) => {
      ch.inYuE2.factIds.forEach((factId) => {
        const fact = YUE2_FACTS[factId];
        expect(fact, `chapter ${ch.id} -> ${factId}`).toBeDefined();
        expect(fact.verified).toBe(true);
      });
    });
  });

  it('provides python corner code blocks with valid shapes (G3)', () => {
    CHAPTERS.forEach((ch) => {
      ch.pythonCorner.forEach((block) => {
        expect(block.title.trim().length).toBeGreaterThan(0);
        expect(block.code.trim().length).toBeGreaterThan(0);
        expect(['python', 'text', 'json']).toContain(block.language);
        expect(['runnable', 'needs-gpu']).toContain(block.type);
      });
    });
  });
});
