import { readdirSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import type { Component } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import { documentationComponents } from "../../src/lib/content/preprocess.js";

const appRoot = resolve(import.meta.dirname, "../..");
const heavyPageLoaders = import.meta.glob<{ default: Component }>(
  "../../content/docs/components/combobox.svx",
);

function source(path: string): string {
  return readFileSync(resolve(appRoot, path), "utf8");
}

function testSources(root: string): Array<{ path: string; source: string }> {
  const entries = readdirSync(root, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const path = resolve(root, entry.name);
    if (entry.isDirectory()) return testSources(path);
    if (!/\.(?:test|spec)\.ts$/.test(entry.name)) return [];
    return [{ path: relative(appRoot, path), source: readFileSync(path, "utf8") }];
  });
}

const eagerGlobOption = new RegExp(["eager", "\\s*:\\s*", "true"].join(""));

describe("documentation test memory safety", () => {
  test("keeps test-time import globs lazy", () => {
    const eagerGlobTests = [
      ...testSources(resolve(appRoot, "src")),
      ...testSources(resolve(appRoot, "tests")),
    ]
      .filter(
        ({ source: testSource }) =>
          testSource.includes("import.meta.glob") && eagerGlobOption.test(testSource),
      )
      .map(({ path }) => path)
      .sort();

    expect(eagerGlobTests).toEqual([]);
  });

  test("runs Node test files in one worker", () => {
    const config = source("vite.config.ts");
    expect(config).toMatch(/\bfileParallelism:\s*false\b/);
    expect(config).toMatch(/\bmaxWorkers:\s*1\b/);
  });

  test("keeps production preview discovery lazy", () => {
    for (const path of [
      "src/lib/registry/particle-previews.ts",
      "src/routes/(preview)/preview/[name]/preview-registry.ts",
    ]) {
      const registry = source(path);
      expect(registry, path).toContain("import.meta.glob");
      expect(registry, path).not.toMatch(eagerGlobOption);
    }
  });

  test("visibility-gates particle gallery imports and renders a visible loading skeleton", () => {
    const page = source("src/routes/(site)/particles/+page.svelte");
    const card = source("src/lib/particles/ParticleCard.svelte");
    const observer = source("src/lib/particles/near-viewport.ts");

    expect(page).toContain("loadComponent={() => loadParticleComponent(particle.name)}");
    expect(page).toContain("loadSource={() => getParticleSource(particle.name)}");
    expect(page).not.toMatch(/component=\{(?:particleComponent|loadParticleComponent)\(/);
    expect(card).toContain("nearViewport(requestPreview)");
    const requestPreview = card.match(
      /function requestPreview\(\): void \{([\s\S]*?)\n {2}\}/,
    )?.[1];
    expect(requestPreview).not.toContain("requestSource");
    expect(card).toContain("onpointerenter={requestSource}");
    expect(card).toContain("onfocus={requestSource}");
    expect(card).not.toContain("onMount(requestSource)");
    expect(card).toContain("await sourceRequest");
    expect(card).toContain("open={drawerOpen}");
    expect(card).not.toContain('aria-hidden="true"></div>');
    expect(card).not.toContain("fetch(");
    expect(observer.match(/new IntersectionObserver/g)).toHaveLength(1);
    expect(observer).toContain('rootMargin: "600px 0px"');
    expect(card).toContain("{@attach loadWhenVisible}");
    expect(card).toContain("<Skeleton");
    expect(card).toContain("data-particle-loading");
  });

  test("compiles documentation previews with page-scoped lazy loaders and no iframes", async () => {
    const transformed = await documentationComponents().markup?.({
      content: '<ComponentPreview name="p-button-1" />\n<ComponentPreview name="p-button-2" />',
      filename: resolve(appRoot, "content/docs/components/memory-safety.svx"),
    });

    expect(transformed?.code).toContain(
      'const __cossParticleLoader0 = () => import("$particles/p-button-1.svelte");',
    );
    expect(transformed?.code).toContain(
      'const __cossParticleLoader1 = () => import("$particles/p-button-2.svelte");',
    );
    expect(transformed?.code).not.toMatch(/<ComponentPreview[^>]+component=\{/);
    expect(transformed?.code.match(/loader=\{__cossParticleLoader\d+\}/g)).toHaveLength(2);
    expect(transformed?.code.match(/source=\{__cossParticleSource\d+\}/g)).toHaveLength(2);
    expect(transformed?.code.match(/const __cossParticleSource\d+ =/g)).toHaveLength(2);
    expect(transformed?.code.match(/<ComponentPreview name=/g)).toHaveLength(2);
    expect(transformed?.code).not.toContain("<iframe");
    const previewCard = source("src/lib/content/components/PreviewCard.svelte");
    expect(previewCard).not.toContain("<iframe");
    expect(previewCard).toContain('{#if tab === "code"}');
    expect(previewCard).not.toContain("/api/particle-source/");
    expect(previewCard).not.toContain("Loading source");
  });

  test("server-renders the heaviest docs page without eager hidden source trees", async () => {
    const load = heavyPageLoaders["../../content/docs/components/combobox.svx"];
    expect(load).toBeDefined();
    const module = await load?.();
    const body = render(module?.default as Component).body;

    expect(body.match(/data-particle="p-combobox-/g)).toHaveLength(15);
    expect(body).not.toContain("data-source-panel");
    expect(body).not.toContain("data-preview-source");
    expect(body.length).toBeLessThan(250_000);
  }, 20_000);
});
