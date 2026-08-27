import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import { Badge, badgeVariants } from "./index.js";

const label = createRawSnippet(() => ({ render: () => "Verified" }));

describe("Badge SSR contract", () => {
  test("renders the default span, classes, slot, and forwarded attributes", () => {
    const { body } = render(Badge, {
      props: { children: label, class: "custom-badge", title: "Status" },
    });

    expect(body).toContain("<span");
    expect(body).toContain('data-slot="badge"');
    expect(body).toContain('title="Status"');
    expect(body).toContain("custom-badge");
    expect(body).toContain("inline-flex shrink-0");
    expect(body).toContain("bg-primary");
    expect(body).toContain("h-5.5");
    expect(body).toContain("Verified");
  });

  test("renders polymorphically as a link without button semantics", () => {
    const { body } = render(Badge, {
      props: { as: "a", children: label, href: "/pricing" },
    });
    expect(body).toContain("<a ");
    expect(body).toContain('href="/pricing"');
    expect(body).not.toContain('role="button"');
  });

  test.each([
    "default",
    "destructive",
    "error",
    "info",
    "outline",
    "secondary",
    "success",
    "warning",
  ] as const)("renders the %s variant", (variant) => {
    expect(badgeVariants({ variant })).toContain("inline-flex");
    const { body } = render(Badge, { props: { variant } });
    expect(body).toContain(
      {
        default: "bg-primary",
        destructive: "bg-destructive",
        error: "bg-destructive/8",
        info: "bg-info/8",
        outline: "border-input",
        secondary: "bg-secondary",
        success: "bg-success/8",
        warning: "bg-warning/8",
      }[variant],
    );
  });

  test.each(["default", "sm", "lg"] as const)("renders the %s size", (size) => {
    const { body } = render(Badge, { props: { size } });
    expect(body).toContain({ default: "h-5.5", sm: "h-5", lg: "h-6.5" }[size]);
  });
});
