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
    expect(code).not.toContain("@hugeicons/svelte");
  });

  test.each(pages)("ports the %s page and route", (slug) => {
    const pagePath = resolve(appRoot, `content/docs/components/${slug}.svx`);
    const routePath = resolve(appRoot, `src/routes/(site)/docs/components/${slug}/+page.svelte`);
    expect(existsSync(pagePath)).toBe(true);
    expect(existsSync(routePath)).toBe(true);
    expect(
      existsSync(resolve(appRoot, `src/routes/(site)/docs/components/${slug}/+page.server.ts`)),
    ).toBe(false);
    const page = readFileSync(pagePath, "utf8");
    expect(page).toContain("<InstallCommand");
    expect(page).toContain("pnpm dlx shadcn-svelte@latest add");
    expect(page).not.toMatch(/```(?:tsx|jsx)|@base-ui\/react|lucide-react|from ["']react/);
    expect(readFileSync(routePath, "utf8")).toContain(`$content/docs/components/${slug}.svx`);
  });

  test("uses one generated metadata loader for all documentation routes", () => {
    const loader = readFileSync(
      resolve(appRoot, "src/routes/(site)/docs/+layout.server.ts"),
      "utf8",
    );
    expect(loader).toContain("findGeneratedDocumentationRecord");
    expect(loader).toContain("documentationSlug(url.pathname)");
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

  test("keeps client-only timers and toast state cleanup explicit", () => {
    const progress = readFileSync(
      resolve(appRoot, "registry/default/particles/p-progress-1.svelte"),
      "utf8",
    );
    expect(progress).toContain('import { onMount } from "svelte"');
    expect(progress).toMatch(/onMount\(\(\) => \{[\s\S]*setInterval/);
    expect(progress).toContain("return () => clearInterval(interval)");

    const copy = readFileSync(
      resolve(appRoot, "registry/default/particles/p-toast-7.svelte"),
      "utf8",
    );
    expect(copy).toContain("await navigator.clipboard.writeText");
    expect(copy).not.toMatch(/catch\s*\{\s*\}\s*copied = true/);
    expect(copy).toContain("clearTimeout(resetTimer)");

    const retry = readFileSync(
      resolve(appRoot, "registry/default/particles/p-toast-8.svelte"),
      "utf8",
    );
    expect(retry).toContain("const toastManager = new Toast.Manager()");
    expect(retry).toContain("toastManager.close(toastId)");
    expect(retry).toContain("toastId = toastManager.add");
    expect(retry).toContain("<Toast.AnchoredProvider {toastManager}");

    const promise = readFileSync(
      resolve(appRoot, "registry/default/particles/p-toast-9.svelte"),
      "utf8",
    );
    expect(promise).toMatch(/success:\s*\{[\s\S]*actionProps: undefined/);
    expect(promise).toMatch(/error:[\s\S]*actionProps: undefined/);
    expect(promise).toContain("controller?.abort()");
  });

  test("keeps exact tooltip timing, button semantics, and removable badge markup", () => {
    const copyToast = readFileSync(
      resolve(appRoot, "registry/default/particles/p-toast-7.svelte"),
      "utf8",
    );
    expect(copyToast).not.toContain("delay={0}");
    expect(copyToast).not.toMatch(/<Tooltip\.Provider\s+delay=/);
    expect(copyToast).toMatch(/<Tooltip\.Trigger[\s\S]*type="button"/);

    for (const id of [12, 13]) {
      const toast = readFileSync(
        resolve(appRoot, `registry/default/particles/p-toast-${id}.svelte`),
        "utf8",
      );
      expect(toast).toMatch(/<Tooltip\.Trigger[\s\S]*delay=\{0\}/);
      expect(toast).not.toMatch(/<Tooltip\.Provider\s+delay=/);
      expect(toast).toMatch(/<Tooltip\.Trigger[\s\S]*type="button"/);
    }

    const removableBadge = readFileSync(
      resolve(appRoot, "registry/default/particles/p-badge-20.svelte"),
      "utf8",
    );
    expect(removableBadge).not.toContain('aria-label="Remove badge"');
  });
});
