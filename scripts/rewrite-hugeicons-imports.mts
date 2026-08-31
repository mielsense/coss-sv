import { globSync, readFileSync, writeFileSync } from "node:fs";
import { rewriteHugeiconsImports } from "./vite/hugeicons-subpath-imports.js";

const files = globSync(
  [
    "apps/**/*.mjs",
    "apps/**/*.mts",
    "apps/**/*.svelte",
    "apps/**/*.svx",
    "apps/**/*.ts",
    "packages/**/*.mjs",
    "packages/**/*.mts",
    "packages/**/*.svelte",
    "packages/**/*.ts",
    "scripts/**/*.mts",
    "scripts/**/*.ts",
    "tests/**/*.ts",
  ],
  {
    exclude: [
      "**/.svelte-kit/**",
      "**/.vercel/**",
      "**/dist/**",
      "**/node_modules/**",
      "**/test-results/**",
    ],
  },
);

let changed = 0;
for (const file of files) {
  const source = readFileSync(file, "utf8");
  const rewritten = rewriteHugeiconsImports(source);
  if (rewritten === source) continue;
  writeFileSync(file, rewritten);
  changed += 1;
}

process.stdout.write(`Rewrote Hugeicons imports in ${changed} files.\n`);
