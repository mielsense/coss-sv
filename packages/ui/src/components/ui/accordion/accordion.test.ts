import { readFileSync } from "node:fs";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import AccordionSsrFixture from "./accordion.ssr-fixture.svelte";
import * as Accordion from "./index.js";

describe("Accordion SSR contract", () => {
  test("renders the COSS structure, slots, state attributes, and panel variables", () => {
    const { body } = render(AccordionSsrFixture);

    expect(body).toContain('data-slot="accordion"');
    expect(body).toContain('data-slot="accordion-item"');
    expect(body).toMatch(/<h2[^>]*class="flex"/);
    expect(body).toContain('data-slot="accordion-trigger"');
    expect(body).toContain('data-slot="accordion-indicator"');
    expect(body).toMatch(/<svg[^>]*aria-hidden="true"[^>]*data-slot="accordion-indicator"/);
    expect(body).toContain('d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9"');
    expect(body).toContain('aria-expanded="true"');
    expect(body).toContain('role="region"');
    expect(body).toContain('style="--accordion-panel-height:');
    expect(body).toContain("data-disabled");
    expect(body).toContain("border-b last:border-b-0");
    expect(body).toContain("duration-200 ease-in-out");
  });

  test("uses the free Hugeicons chevron without copied Lucide or inline icon source", () => {
    const source = readFileSync(new URL("./accordion-trigger.svelte", import.meta.url), "utf8");

    expect(source).toContain('import { ChevronDownIcon } from "@hugeicons/core-free-icons";');
    expect(source).toContain('import HugeiconsIcon from "$lib/hugeicons-icon.svelte";');
    expect(source).toContain("icon={ChevronDownIcon}");
    expect(source).toContain("strokeWidth={2}");
    expect(source).not.toMatch(/lucide|<svg\b|<path\b/i);
  });

  test("exports namespace parts, aliases, types, and the Shards primitive", () => {
    expect(Accordion.Root).toBeTypeOf("function");
    expect(Accordion.Item).toBeTypeOf("function");
    expect(Accordion.Header).toBeTypeOf("function");
    expect(Accordion.Trigger).toBeTypeOf("function");
    expect(Accordion.Panel).toBeTypeOf("function");
    expect(Accordion.Content).toBe(Accordion.Panel);
    expect(Accordion.Accordion).toBe(Accordion.Root);
    expect(Accordion.AccordionContent).toBe(Accordion.Panel);
    expect(Accordion.AccordionPrimitive).toBeTypeOf("object");
  });
});
