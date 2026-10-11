// Compiles every lesson MDX file to catch syntax errors before they hit runtime.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { compile } from "@mdx-js/mdx";

const ROOT = path.join(process.cwd(), "content", "modules");
let ok = 0, fail = 0;

for (const slug of readdirSync(ROOT)) {
  const dir = path.join(ROOT, slug, "lessons");
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".mdx")) continue;
    const p = path.join(dir, f);
    try {
      await compile(readFileSync(p, "utf8"), { format: "mdx" });
      ok++;
    } catch (e) {
      fail++;
      console.error(`✗ ${slug}/${f}: ${e.message.split("\n")[0]} (line ${e.line ?? "?"})`);
    }
  }
}

console.log(`${ok} lessons compile cleanly${fail ? `, ${fail} FAILED` : ""}.`);
process.exit(fail ? 1 : 0);
