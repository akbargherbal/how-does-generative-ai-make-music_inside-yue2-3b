/**
 * Glossary, Facts, and Content Lint Script
 * Runs in CI / test pipeline to enforce Golden Rules G1, G6, G7.
 */

import { GLOSSARY } from "../src/content/glossary";
import { YUE2_FACTS } from "../src/content/facts";
import { CHAPTERS } from "../src/content/chapters";

let errorCount = 0;

console.log("=== Checking Glossary and Content Invariants ===");

// 1. Verify every glossary item has definition, analogy, and pythonAnalogy
const glossaryKeys = Object.keys(GLOSSARY);
console.log(`Auditing ${glossaryKeys.length} glossary terms...`);

for (const key of glossaryKeys) {
  const item = GLOSSARY[key];
  if (!item.definition || item.definition.trim().length < 10) {
    console.error(`[ERROR] Glossary term "${key}" has an empty or too short definition.`);
    errorCount++;
  }
  if (!item.analogy || item.analogy.trim().length < 10) {
    console.error(`[ERROR] Glossary term "${key}" has an empty or too short analogy.`);
    errorCount++;
  }
  if (!item.pythonAnalogy || item.pythonAnalogy.trim().length < 5) {
    console.error(`[ERROR] Glossary term "${key}" is missing pythonAnalogy.`);
    errorCount++;
  }
}

// 2. Verify all chapter newTerms exist in GLOSSARY
console.log(`Auditing newTerms across ${CHAPTERS.length} chapters...`);
for (const ch of CHAPTERS) {
  for (const termKey of ch.newTerms) {
    if (!GLOSSARY[termKey]) {
      console.error(`[ERROR] Chapter ${ch.id} (${ch.slug}) references newTerm "${termKey}", which is missing from GLOSSARY!`);
      errorCount++;
    }
  }

  // Check AnalogyBox fields
  if (!ch.analogy.title || !ch.analogy.body || !ch.analogy.breaksDown) {
    console.error(`[ERROR] Chapter ${ch.id} is missing analogy fields (title, body, or breaksDown)!`);
    errorCount++;
  }

  // Check Quiz: exactly 3 questions
  if (ch.quiz.length !== 3) {
    console.error(`[ERROR] Chapter ${ch.id} does not have exactly 3 quiz questions (has ${ch.quiz.length})!`);
    errorCount++;
  }

  for (const q of ch.quiz) {
    if (q.options.length < 2 || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
      console.error(`[ERROR] Chapter ${ch.id} question "${q.id}" has invalid correctIndex or options.`);
      errorCount++;
    }
    if (!q.explanation || q.explanation.trim().length < 10) {
      console.error(`[ERROR] Chapter ${ch.id} question "${q.id}" has missing or short explanation.`);
      errorCount++;
    }
  }

  // Check Fact IDs
  for (const fid of ch.inYuE2.factIds) {
    const fact = YUE2_FACTS[fid];
    if (!fact) {
      console.error(`[ERROR] Chapter ${ch.id} references unverified factId "${fid}", which does not exist in YUE2_FACTS!`);
      errorCount++;
    } else if (!fact.verified) {
      console.error(`[ERROR] Chapter ${ch.id} references fact "${fid}", which is not marked verified: true!`);
      errorCount++;
    }
  }
}

if (errorCount === 0) {
  console.log("SUCCESS: All 16 chapters, glossary terms, and facts strictly satisfy Golden Rules G1, G6, and G7!");
  process.exit(0);
} else {
  console.error(`FAILED with ${errorCount} errors.`);
  process.exit(1);
}
