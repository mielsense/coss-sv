import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "vitest";

const sourceRoot = path.resolve(import.meta.dirname, "../src");

const forbidden = [
  { label: "legacy prop declarations", pattern: /\bexport\s+let\b/ },
  { label: "legacy reactive labels", pattern: /^\s*\$:\s*/m },
  { label: "legacy event directives", pattern: /\bon:[a-zA-Z]+(?:\||=)/ },
  { label: "legacy slots", pattern: /<slot(?:\s|\/?>)/ },
  { label: "deprecated event dispatchers", pattern: /\bcreateEventDispatcher\b/ },
  { label: "legacy dynamic components", pattern: /<svelte:component\b/ },
  { label: "legacy declaration tags", pattern: /\{@const\b/ },
] as const;

async function sourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? sourceFiles(target) : [target];
    }),
  );

  return nested.flat().filter((file) => /\.(?:svelte|ts)$/.test(file));
}

test("contains no legacy Svelte syntax", async () => {
  const findings: string[] = [];

  for (const file of await sourceFiles(sourceRoot)) {
    const source = await readFile(file, "utf8");
    for (const rule of forbidden) {
      if (rule.pattern.test(source)) {
        findings.push(`${path.relative(sourceRoot, file)}: ${rule.label}`);
      }
    }
  }

  expect(findings).toEqual([]);
});
