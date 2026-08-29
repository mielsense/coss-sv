import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import Card1 from "../../registry/default/particles/p-card-1.svelte";
import Card10 from "../../registry/default/particles/p-card-10.svelte";
import Card4 from "../../registry/default/particles/p-card-4.svelte";
import Card5 from "../../registry/default/particles/p-card-5.svelte";
import Card6 from "../../registry/default/particles/p-card-6.svelte";
import Card7 from "../../registry/default/particles/p-card-7.svelte";
import Card8 from "../../registry/default/particles/p-card-8.svelte";
import Card9 from "../../registry/default/particles/p-card-9.svelte";

const particleRoot = resolve(import.meta.dirname, "../../registry/default/particles");
const frameworkOptions = ["Next.js", "Vite", "Remix", "Astro"] as const;

const particles = [
  { component: Card1, footer: "card", frame: "none", header: "card", id: "p-card-1" },
  { component: Card4, footer: "card-frame", frame: "card", header: "card", id: "p-card-4" },
  { component: Card5, footer: "none", frame: "card", header: "card-frame", id: "p-card-5" },
  {
    component: Card6,
    footer: "card-frame",
    frame: "card",
    header: "card-frame",
    id: "p-card-6",
  },
  {
    component: Card7,
    footer: "card-frame",
    frame: "card",
    header: "card-frame",
    id: "p-card-7",
  },
  { component: Card8, footer: "frame", frame: "frame", header: "card", id: "p-card-8" },
  { component: Card9, footer: "none", frame: "frame", header: "frame", id: "p-card-9" },
  { component: Card10, footer: "frame", frame: "frame", header: "frame", id: "p-card-10" },
] as const;

function source(id: string): string {
  return readFileSync(resolve(particleRoot, `${id}.svelte`), "utf8");
}

describe("D4 Select-dependent card particles", () => {
  test.each(particles)(
    "renders $id with exact copy, controls, and surface structure",
    (particle) => {
      const body = render(particle.component).body;
      const text = body
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      expect(text).toContain("Create project");
      expect(text).toContain("Deploy your new project in one-click.");
      expect(text).toContain("Name");
      expect(text).toContain("Framework");
      expect(text).toContain("Next.js");
      expect(text).toContain("Deploy");
      expect(body).toContain('placeholder="Name of your project"');
      expect(body).toContain('role="combobox"');
      expect(body).toMatch(/data-slot="select-value"[\s\S]*?Next\.js/);
      expect(body).toMatch(/type="submit"[\s\S]*?Deploy/);
      expect(body.match(/data-slot="select-trigger"/g)).toHaveLength(1);
      expect(body.match(/data-slot="input-control"/g)).toHaveLength(1);

      expect(body.includes('data-slot="card-frame"')).toBe(particle.frame === "card");
      expect(body.includes('data-slot="frame"')).toBe(particle.frame === "frame");
      expect(body.includes('data-slot="card-header"')).toBe(particle.header === "card");
      expect(body.includes('data-slot="card-frame-header"')).toBe(particle.header === "card-frame");
      expect(body.includes('data-slot="frame-panel-header"')).toBe(particle.header === "frame");
      expect(body.includes('data-slot="card-footer"')).toBe(particle.footer === "card");
      expect(body.includes('data-slot="card-frame-footer"')).toBe(particle.footer === "card-frame");
      expect(body.includes('data-slot="frame-panel-footer"')).toBe(particle.footer === "frame");
    },
  );

  test.each(particles)(
    "keeps $id source copy exact and uses the public Select namespace",
    ({ id }) => {
      const code = source(id);
      const labels = [...code.matchAll(/\{ label: "([^"]+)", value: "[^"]+" \}/g)].map(
        ([, label]) => label,
      );

      expect(labels).toEqual(frameworkOptions);
      expect(code).toMatch(/import\s*\{[\s\S]*?\bSelect\s*,?[\s\S]*?\}\s*from\s*"@coss-sv\/ui";/);
      expect(code).toContain("<Select.Root bind:value={framework} items={frameworkOptions}>");
      expect(code).toContain("<Select.Trigger><Select.Value /></Select.Trigger>");
      expect(code).not.toMatch(/@shardsui\/svelte|packages\/ui\/(?:src|dist)|<svg\b|lucide/i);
    },
  );

  test("preserves the six upstream alert footers with the Hugeicons authority", () => {
    for (const id of ["p-card-1", "p-card-4", "p-card-6", "p-card-7", "p-card-8", "p-card-10"]) {
      const code = source(id);
      expect(code).toContain("AlertCircleIcon");
      expect(code).toContain("This will take a few seconds to complete.");
    }
    expect(source("p-card-5")).not.toContain("AlertCircleIcon");
    expect(source("p-card-9")).not.toContain("AlertCircleIcon");
  });

  test("keeps the p-card-7 square bottom seam", () => {
    expect(source("p-card-7")).toContain('<Card class="rounded-b-none!">');
  });
});
