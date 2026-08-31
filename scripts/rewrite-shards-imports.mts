import { globSync, readFileSync, writeFileSync } from "node:fs";
import { rewriteShardsImports } from "./vite/shards-subpath-imports.js";

const files = globSync(
  [
    "apps/ui/src/**/*.svelte",
    "apps/ui/src/**/*.ts",
    "packages/ui/src/**/*.svelte",
    "packages/ui/src/**/*.ts",
  ],
  { exclude: ["**/*.test.*", "**/*.spec.*", "**/*fixture*", "**/dist/**"] },
);

let changed = 0;
for (const file of files) {
  const source = readFileSync(file, "utf8");
  const rewritten = rewriteShardsImports(source);
  if (rewritten === source) continue;
  writeFileSync(file, rewritten);
  changed += 1;
}
process.stdout.write(`Rewrote Shards imports in ${changed} files.\n`);
