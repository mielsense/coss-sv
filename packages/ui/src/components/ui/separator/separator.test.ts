import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import { Separator, SeparatorPrimitive } from "./index.js";

const baseClasses = [
  "shrink-0",
  "data-[orientation=horizontal]:w-full",
  "data-[orientation=vertical]:w-px",
  "data-[orientation=vertical]:not-[[class^='h-']]:not-[[class*='_h-']]:self-stretch",
] as const;

describe("Separator SSR contract", () => {
  test("renders the Shards semantic and state attributes with horizontal defaults", () => {
    const { body } = render(Separator, {
      props: { "aria-label": "Section divider", "data-forwarded": "yes" },
    });

    expect(body).toContain('role="separator"');
    expect(body).toContain('aria-orientation="horizontal"');
    expect(body).toContain('data-orientation="horizontal"');
    expect(body).toContain('data-slot="separator"');
    expect(body).toContain('data-forwarded="yes"');
    expect(body).toContain('aria-label="Section divider"');
    for (const className of baseClasses) expect(body).toContain(className);
  });

  test("renders a vertical separator and lets consumer utility classes win", () => {
    const { body } = render(Separator, {
      props: {
        class: "bg-red-500 data-[orientation=horizontal]:h-4",
        orientation: "vertical",
      },
    });

    expect(body).toContain('aria-orientation="vertical"');
    expect(body).toContain('data-orientation="vertical"');
    expect(body).toContain("bg-red-500");
    expect(body).not.toContain("bg-border");
    expect(body).toContain("data-[orientation=horizontal]:h-4");
    expect(body).not.toContain("data-[orientation=horizontal]:h-px");
  });

  test("renders snippets without losing the separator contract", () => {
    const children = createRawSnippet(() => ({
      render: () => '<span data-testid="snippet">between sections</span>',
    }));
    const { body } = render(Separator, {
      props: { as: "section", children, orientation: "vertical" },
    });

    expect(body).toContain("<section");
    expect(body).toContain('data-testid="snippet"');
    expect(body).toContain("between sections");
    expect(body).toContain('role="separator"');
    expect(body).toContain('data-orientation="vertical"');
  });

  test("exports the wrapped component and the underlying Shards primitive", () => {
    expect(Separator).toBeTypeOf("function");
    expect(SeparatorPrimitive).toBeTypeOf("function");
  });
});
