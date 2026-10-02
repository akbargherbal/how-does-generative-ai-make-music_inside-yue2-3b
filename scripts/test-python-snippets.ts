import { CHAPTERS } from "../src/content/chapters";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("=== Testing all runnable Python snippets ===");

let testedCount = 0;
let failedCount = 0;

const tempFile = path.join("/tmp", "test_snippet.py");

for (const ch of CHAPTERS) {
  for (const block of ch.pythonCorner) {
    if (block.type === "runnable") {
      testedCount++;
      console.log(`Testing snippet in Ch ${ch.id}: "${block.title}"...`);
      fs.writeFileSync(tempFile, block.code, "utf-8");

      try {
        const out = execSync("python3 " + tempFile, { encoding: "utf-8", timeout: 5000 });
        console.log(`  ✓ Passed (output length: ${out.trim().length} chars)`);
      } catch (err: unknown) {
        console.error(`  ✗ FAILED in Ch ${ch.id}:`, (err as Error).message);
        failedCount++;
      }
    }
  }
}

if (fs.existsSync(tempFile)) {
  fs.unlinkSync(tempFile);
}

console.log(`\nSummary: Tested ${testedCount} runnable Python snippets.`);
if (failedCount === 0) {
  console.log("SUCCESS: All runnable Python snippets executed with zero errors on stock Python 3!");
  process.exit(0);
} else {
  console.error(`FAILED: ${failedCount} snippets failed.`);
  process.exit(1);
}
