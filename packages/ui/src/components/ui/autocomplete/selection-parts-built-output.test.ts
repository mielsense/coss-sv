import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
const distRoot = join(packageRoot, "dist/components/ui");
const publicParts = {
  autocomplete: ["empty", "group", "group-label", "row", "status"],
  combobox: ["empty", "group", "group-label", "row", "status"],
  select: ["group", "group-label"],
} as const;

describe("built selection part declarations", () => {
  test("declares ref as a binding on every generated delegated wrapper declaration", () => {
    for (const [family, parts] of Object.entries(publicParts)) {
      for (const part of parts) {
        const declaration = readFileSync(
          join(distRoot, family, `${family}-${part}.svelte.d.ts`),
          "utf8",
        );
        expect(declaration, `${family}/${part}`).toMatch(/Component<[\s\S]*, \{\}, "ref">/);
      }
    }
  });
});
