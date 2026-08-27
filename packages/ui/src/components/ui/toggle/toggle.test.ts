import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import { Toggle, TogglePrimitive, toggleVariants } from "./index.js";

const requiredBaseClasses = [
  "relative",
  "inline-flex",
  "rounded-lg",
  "font-medium",
  "focus-visible:ring-2",
  "disabled:opacity-64",
  "data-pressed:bg-input/64",
] as const;

describe("Toggle SSR contract", () => {
  test("renders the exact COSS defaults on the Shards toggle", () => {
    const { body } = render(Toggle, {
      props: {
        "aria-label": "Toggle bold",
        "data-forwarded": "yes",
        children: createRawSnippet(() => ({ render: () => "<span>Bold</span>" })),
      },
    });

    expect(body).toContain("<button");
    expect(body).toContain('type="button"');
    expect(body).toContain('aria-pressed="false"');
    expect(body).toContain('data-slot="toggle"');
    expect(body).toContain('data-forwarded="yes"');
    expect(body).toContain('aria-label="Toggle bold"');
    expect(body).toContain("<span>Bold</span>");
    for (const className of requiredBaseClasses) expect(body).toContain(className);
    expect(body).toContain("h-9 min-w-9");
    expect(body).toContain("border-transparent");
  });

  test("renders pressed, disabled, size, variant, polymorphism, and merged classes", () => {
    const { body } = render(Toggle, {
      props: {
        as: "span",
        class: "h-12 custom-toggle",
        disabled: true,
        pressed: true,
        size: "sm",
        variant: "outline",
      },
    });

    expect(body).toContain("<span");
    expect(body).toContain('role="button"');
    expect(body).toContain('aria-disabled="true"');
    expect(body).toContain('aria-pressed="true"');
    expect(body).toContain("data-disabled");
    expect(body).toContain("data-pressed");
    expect(body).toContain("custom-toggle");
    expect(body).toContain("h-12");
    expect(body).not.toContain(" h-8 ");
    expect(body).toContain("border-input");
  });

  test("exports the style helper and underlying Shards component", () => {
    expect(Toggle).toBeTypeOf("function");
    expect(TogglePrimitive).toBeTypeOf("function");
    expect(toggleVariants({ size: "lg", variant: "outline" })).toContain("sm:h-9");
  });
});
