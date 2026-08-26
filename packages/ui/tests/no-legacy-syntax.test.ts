import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "vitest";

const sourceRoot = path.resolve(import.meta.dirname, "../src");

const forbidden = [
  {
    fixtures: ["export let label: string;"],
    label: "legacy prop declarations",
    pattern: /\bexport\s+let\b/,
  },
  {
    fixtures: ["$: doubled = count * 2;"],
    label: "legacy reactive labels",
    pattern: /^\s*\$:\s*/m,
  },
  {
    fixtures: ["<button on:click={save}>save</button>", "<button on:click>save</button>"],
    label: "legacy event directives",
    pattern: /\bon:[a-zA-Z][\w-]*/,
  },
  { fixtures: ["<slot />"], label: "legacy slots", pattern: /<slot(?:\s|\/?>)/ },
  {
    fixtures: ['import { createEventDispatcher } from "svelte";'],
    label: "deprecated event dispatchers",
    pattern: /\bcreateEventDispatcher\b/,
  },
  {
    fixtures: ["<svelte:component this={Current} />"],
    label: "legacy dynamic components",
    pattern: /<svelte:component\b/,
  },
  {
    fixtures: ["{@const total = price * quantity}"],
    label: "legacy declaration tags",
    pattern: /\{@const\b/,
  },
  {
    fixtures: ['import type { SvelteComponent } from "svelte";'],
    label: "deprecated SvelteComponent type",
    pattern: /\bSvelteComponent\b/,
  },
  {
    fixtures: ['import type { ComponentType } from "svelte";'],
    label: "deprecated ComponentType type",
    pattern: /\bComponentType\b/,
  },
  {
    fixtures: ['import type { ComponentEvents } from "svelte";'],
    label: "deprecated ComponentEvents type",
    pattern: /\bComponentEvents\b/,
  },
  {
    fixtures: ['import { beforeUpdate } from "svelte";'],
    label: "deprecated beforeUpdate lifecycle",
    pattern: /\bbeforeUpdate\b/,
  },
  {
    fixtures: ['import { afterUpdate } from "svelte";'],
    label: "deprecated afterUpdate lifecycle",
    pattern: /\bafterUpdate\b/,
  },
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

const recognitionFixtures = forbidden.flatMap(({ fixtures, label, pattern }) =>
  fixtures.map((fixture) => ({ fixture, label, pattern })),
);

test.each(recognitionFixtures)("recognizes $label in $fixture", ({ fixture, pattern }) => {
  expect(pattern.test(fixture)).toBe(true);
});
