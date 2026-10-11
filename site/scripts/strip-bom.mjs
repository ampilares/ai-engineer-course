// Normalize all content JSON/MDX files: strip UTF-8 BOMs (Windows PowerShell adds
// them, and JSON.parse rejects them).
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

let fixed = 0;
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(json|mdx)$/.test(name)) {
      const raw = readFileSync(p, "utf8");
      if (raw.charCodeAt(0) === 0xfeff) {
        writeFileSync(p, raw.slice(1));
        fixed++;
        console.log("stripped BOM:", path.relative(process.cwd(), p));
      }
    }
  }
}
walk(path.join(process.cwd(), "content"));
console.log(`${fixed} file(s) fixed.`);
