import { describe, expect, it } from 'vitest';
import { GLOSSARY } from '@/src/content/glossary';
import { CHAPTERS } from '@/src/content/chapters';

const glossaryEntries = Object.entries(GLOSSARY);

describe('glossary', () => {
  it('documents exactly 65 plain-English terms', () => {
    expect(glossaryEntries).toHaveLength(65);
  });

  it('keeps the record key in sync with the entry id', () => {
    glossaryEntries.forEach(([key, entry]) => {
      expect(entry.id).toBe(key);
    });
  });

  it('fully explains every term with definition, analogy and Python parallel (G1, G3)', () => {
    glossaryEntries.forEach(([key, entry]) => {
      expect(entry.term.trim().length, key).toBeGreaterThan(0);
      expect(entry.definition.trim().length, key).toBeGreaterThanOrEqual(10);
      expect(entry.analogy.trim().length, key).toBeGreaterThanOrEqual(10);
      expect(entry.pythonAnalogy.trim().length, key).toBeGreaterThanOrEqual(5);
    });
  });

  it('points to valid chapters for first-seen and related references', () => {
    const validIds = new Set(CHAPTERS.map((ch) => ch.id));
    glossaryEntries.forEach(([key, entry]) => {
      expect(validIds.has(entry.firstChapter), `${key} firstChapter`).toBe(true);
      expect(entry.relatedChapters.length, key).toBeGreaterThan(0);
      entry.relatedChapters.forEach((id) => {
        expect(validIds.has(id), `${key} relatedChapter ${id}`).toBe(true);
      });
      expect(entry.relatedChapters).toContain(entry.firstChapter);
    });
  });

  it('is reachable from at least one chapter newTerms or relatedChapters', () => {
    const referenced = new Set<string>();
    CHAPTERS.forEach((ch) => ch.newTerms.forEach((t) => referenced.add(t)));
    glossaryEntries.forEach(([key]) => {
      expect(referenced.has(key), `${key} is never introduced`).toBe(true);
    });
  });
});
