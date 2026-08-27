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
    expect(body).toContain('aria-expanded="true"');
    expect(body).toContain('role="region"');
    expect(body).toContain('style="--accordion-panel-height:');
    expect(body).toContain("data-disabled");
    expect(body).toContain("border-b last:border-b-0");
    expect(body).toContain("duration-200 ease-in-out");
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
