import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const appRoot = resolve(import.meta.dirname, "../..");
const repositoryRoot = resolve(appRoot, "../..");
const pages = ["alert", "avatar", "badge", "kbd", "meter", "progress", "spinner", "toast"] as const;

type OwnershipFile = {
  ownership: Array<{
    componentImports: string[];
    implementationLane: string;
    particle: string;
    targetPath: string;
  }>;
};

const ownership = JSON.parse(
  readFileSync(resolve(repositoryRoot, "docs/porting/docs-ownership.json"), "utf8"),
) as OwnershipFile;
const records = ownership.ownership.filter(
  ({ implementationLane }) => implementationLane === "D10",
);

describe("D10 feedback and status documentation", () => {
  test("keeps the locked 64-particle ownership set exact", () => {
    expect(records).toHaveLength(64);
    expect(new Set(records.map(({ particle }) => particle)).size).toBe(64);
  });

  test.each(records)("ports $particle with exact ownership metadata", (record) => {
    const target = resolve(repositoryRoot, record.targetPath);
    expect(existsSync(target)).toBe(true);
    const code = readFileSync(target, "utf8");
    expect(code).toContain(`id: "${record.particle}"`);
    expect(code).toContain("defineParticleMeta(");
    const components = /components:\s*(\[[^\]]*\])/s.exec(code)?.[1];
    expect(JSON.parse((components ?? "[]").replace(/,\s*]$/, "]"))).toEqual(
      record.componentImports,
    );
    expect(code).not.toMatch(
      /\b(?:useEffect|useId|useRef|useState|className|onClick)\b|from\s+["']react(?:\/[^"']*)?["']/,
    );
    expect(code).not.toMatch(/\b(?:export let|createEventDispatcher)\b|\bon:/);
    expect(code).not.toMatch(/lucide|<svg\b/i);
  });

  test.each(pages)("ports the %s page and route", (slug) => {
    const pagePath = resolve(appRoot, `content/docs/components/${slug}.svx`);
    const routePath = resolve(appRoot, `src/routes/docs/components/${slug}/+page.svelte`);
    expect(existsSync(pagePath)).toBe(true);
    expect(existsSync(routePath)).toBe(true);
    const page = readFileSync(pagePath, "utf8");
    expect(page).toContain("<InstallCommand");
    expect(page).toContain("pnpm dlx shadcn-svelte@latest add");
    expect(page).not.toMatch(/```(?:tsx|jsx)|@base-ui\/react|lucide-react|from ["']react/);
  });

  test("keeps feedback semantics and async controls explicit", () => {
    expect(
      readFileSync(resolve(appRoot, "registry/default/particles/p-alert-1.svelte"), "utf8"),
    ).toContain("Describe what can be done about it here.");
    expect(
      readFileSync(resolve(appRoot, "registry/default/particles/p-progress-1.svelte"), "utf8"),
    ).toContain("Math.random() * 25");
    expect(
      readFileSync(resolve(appRoot, "registry/default/particles/p-toast-4.svelte"), "utf8"),
    ).toContain("The action has been reverted.");
    expect(
      readFileSync(resolve(appRoot, "registry/default/particles/p-toast-9.svelte"), "utf8"),
    ).toContain("Report generation was cancelled.");
  });
});
