import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import CollapsibleHydrationFixture from "./collapsible.hydration-fixture.svelte";
import { collapsibleDelegatedSsrHtml } from "./collapsible.hydration-html.js";
import CollapsibleSsrFixture from "./collapsible.ssr-fixture.svelte";
import * as Collapsible from "./index.js";

describe("Collapsible SSR contract", () => {
  test("renders the genuine delegated hydration provider boundary", () => {
    const { body } = render(CollapsibleHydrationFixture);

    expect(body).toBe(collapsibleDelegatedSsrHtml);
  });
  test("renders exact COSS data slots, state, and motion classes", () => {
    const { body } = render(CollapsibleSsrFixture);

    expect(body).toContain('data-slot="collapsible"');
    expect(body).toContain('data-slot="collapsible-trigger"');
    expect(body).toContain('data-slot="collapsible-panel"');
    expect(body).toContain('aria-expanded="true"');
    expect(body).toContain('style="--collapsible-panel-height:');
    expect(body).toContain("transition-[height] duration-200");
    expect(body).toContain("data-ending-style:h-0 data-starting-style:h-0");
  });

  test("renders a delegated Button as the single trigger owner", () => {
    const { body } = render(CollapsibleSsrFixture);
    const delegated =
      body.match(/<button[^>]*>[\s\S]*?Delegated trigger[\s\S]*?<\/button>/)?.[0] ?? "";

    expect(delegated).toContain('data-slot="collapsible-trigger"');
    expect(delegated).toContain('aria-expanded="true"');
    expect(delegated).not.toContain("aria-controls");
    expect(delegated).toContain("consumer-trigger");
    expect(delegated).toContain("border-transparent");
    expect(body.match(/Delegated trigger/g)).toHaveLength(1);
  });

  test("keeps a disabled delegated Button focusable without native disabled markup", () => {
    const { body } = render(CollapsibleSsrFixture);
    const delegated =
      body.match(/<button[^>]*>[\s\S]*?Disabled delegated trigger[\s\S]*?<\/button>/)?.[0] ?? "";

    expect(delegated).toContain('aria-disabled="true"');
    expect(delegated).toContain('tabindex="0"');
    expect(delegated).toContain('data-disabled=""');
    expect(delegated).not.toMatch(/\sdisabled(?:=|\s|>)/);
  });

  test("exports namespace parts, aliases, and Shards primitive", () => {
    expect(Collapsible.Root).toBeTypeOf("function");
    expect(Collapsible.Trigger).toBeTypeOf("function");
    expect(Collapsible.Panel).toBeTypeOf("function");
    expect(Collapsible.Content).toBe(Collapsible.Panel);
    expect(Collapsible.Collapsible).toBe(Collapsible.Root);
    expect(Collapsible.CollapsibleContent).toBe(Collapsible.Panel);
    expect(Collapsible.CollapsiblePrimitive).toBeTypeOf("object");
  });
});
