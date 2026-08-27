import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import { Button, ButtonPrimitive, buttonVariants } from "./index.js";

const text = (value: string) => createRawSnippet(() => ({ render: () => value }));

describe("Button SSR contract", () => {
  test("renders the exact default COSS button contract", () => {
    const { body } = render(Button, {
      props: { children: text("Button"), class: "custom-button" },
    });

    expect(body).toContain("<button");
    expect(body).toContain('type="button"');
    expect(body).toContain('data-slot="button"');
    expect(body).toContain("relative inline-flex shrink-0 cursor-pointer");
    expect(body).toContain("h-9 px-[calc(--spacing(3)-1px)] sm:h-8");
    expect(body).toContain("border-primary bg-primary text-primary-foreground");
    expect(body).toContain("custom-button");
    expect(body).toContain("Button");
  });

  test.each([
    ["destructive", "border-destructive bg-destructive"],
    ["destructive-outline", "text-destructive-foreground"],
    ["ghost", "border-transparent text-foreground"],
    ["link", "underline-offset-4"],
    ["outline", "border-input bg-popover"],
    ["secondary", "bg-secondary text-secondary-foreground"],
  ] as const)("renders the %s variant", (variant, expectedClass) => {
    expect(render(Button, { props: { variant } }).body).toContain(expectedClass);
  });

  test.each([
    ["xs", "h-7 gap-1 rounded-md"],
    ["sm", "h-8 gap-1.5"],
    ["lg", "h-10"],
    ["xl", "h-11"],
    ["icon", "size-9"],
    ["icon-xs", "size-7 rounded-md"],
    ["icon-sm", "size-8"],
    ["icon-lg", "size-10"],
    ["icon-xl", "size-11"],
  ] as const)("renders the %s size", (size, expectedClass) => {
    expect(render(Button, { props: { size } }).body).toContain(expectedClass);
  });

  test("renders the exact built-in loading contract", () => {
    const { body } = render(Button, {
      props: { children: text("Submit"), loading: true },
    });

    expect(body).toContain('data-loading=""');
    expect(body).toContain('aria-disabled="true"');
    expect(body).toContain("disabled");
    expect(body).toContain('data-slot="button-loading-indicator"');
    expect(body).toContain("pointer-events-none absolute");
    expect(body).toContain("Submit");
  });

  test("renders a native semantic link for the Svelte render-prop translation", () => {
    const { body } = render(Button, {
      props: { children: text("Login"), href: "/login", rel: "next" },
    });

    expect(body).toContain("<a");
    expect(body).toContain('href="/login"');
    expect(body).toContain('rel="next"');
    expect(body).not.toContain('role="button"');
    expect(body).not.toContain('type="button"');
  });

  test("preserves Shards disabled semantics for a polymorphic non-button target", () => {
    const { body } = render(Button, {
      props: { as: "div", children: text("Disabled div"), disabled: true },
    });

    expect(body).toContain("<div");
    expect(body).toContain('role="button"');
    expect(body).toContain('aria-disabled="true"');
    expect(body).toContain('data-disabled=""');
    expect(body).toContain('tabindex="-1"');
    expect(body).not.toContain('type="button"');
  });

  test("exports the variant helper and Shards primitive", () => {
    expect(buttonVariants({ size: "sm", variant: "outline" })).toContain("sm:h-7");
    expect(ButtonPrimitive).toBeTypeOf("function");
  });
});
