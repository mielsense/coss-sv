import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as ScrollArea from "./index.js";
import ScrollBarFixture from "./scroll-bar.ssr-fixture.svelte";

const content = createRawSnippet(() => ({
  render: () => '<div data-testid="content">Scrollable content</div>',
}));

describe("ScrollArea SSR contract", () => {
  test("renders the complete COSS composition with Shards parts", () => {
    const { body } = render(ScrollArea.ScrollArea, {
      props: {
        "aria-label": "Release tags",
        children: content,
        class: "h-64 rounded-lg border",
        "data-forwarded": "root",
      },
    });

    expect(body).toContain('data-forwarded="root"');
    expect(body).toContain('data-slot="scroll-area-viewport"');
    expect(body).toContain('data-slot="scroll-area-content"');
    expect(body).toContain("Scrollable content");
    expect(body).toContain("size-full min-h-0 h-64 rounded-lg border");
    expect(body).toContain("h-full rounded-[inherit] outline-none transition-shadows");
    expect(body).toContain("min-width: 0");
  });

  test("applies each COSS opt-in without changing the defaults", () => {
    const { body } = render(ScrollArea.ScrollArea, {
      props: {
        children: content,
        clampContentMinWidth: false,
        fill: true,
        overscrollContain: true,
        scrollFade: true,
        scrollbarGutter: true,
      },
    });

    expect(body).toContain("data-has-overflow-y:overscroll-y-contain");
    expect(body).toContain("mask-t-from-");
    expect(body).toContain("[--fade-size:1.5rem]");
    expect(body).toContain("data-has-overflow-y:pe-2.5");
    expect(body).toContain('class="size-full"');
    expect(body).not.toContain("min-width: 0");
  });

  test("renders an independently styled scrollbar in either orientation", () => {
    const body = render(ScrollBarFixture).body;

    expect(body).toContain('data-orientation="vertical"');
    expect(body).toContain('data-slot="scroll-area-scrollbar"');
    expect(body).toContain("consumer");
    expect(body).toContain("data-hovering:opacity-100");
    expect(body).toContain('data-slot="scroll-area-thumb"');
    expect(body).toContain("rounded-full bg-foreground/20");
    expect(body).toContain('data-orientation="horizontal"');
  });

  test("exports the raw Shards namespace and every part", () => {
    expect(ScrollArea.ScrollAreaPrimitive.Root).toBeTypeOf("function");
    expect(ScrollArea.Root).toBe(ScrollArea.ScrollAreaPrimitive.Root);
    expect(ScrollArea.Viewport).toBe(ScrollArea.ScrollAreaPrimitive.Viewport);
    expect(ScrollArea.Content).toBe(ScrollArea.ScrollAreaPrimitive.Content);
    expect(ScrollArea.Scrollbar).toBe(ScrollArea.ScrollAreaPrimitive.Scrollbar);
    expect(ScrollArea.Thumb).toBe(ScrollArea.ScrollAreaPrimitive.Thumb);
    expect(ScrollArea.Corner).toBe(ScrollArea.ScrollAreaPrimitive.Corner);
  });
});
