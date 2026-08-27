import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./index.js";

const text = (value: string) => createRawSnippet(() => ({ render: () => `<span>${value}</span>` }));

describe("Alert SSR contract", () => {
  test("renders the default alert semantics and forwards attributes", () => {
    const { body } = render(Alert, {
      props: {
        "aria-label": "Deployment status",
        children: text("Heads up"),
        class: "custom-alert",
        id: "status-alert",
      },
    });

    expect(body).toContain('role="alert"');
    expect(body).toContain('data-slot="alert"');
    expect(body).toContain('aria-label="Deployment status"');
    expect(body).toContain('id="status-alert"');
    expect(body).toContain("custom-alert");
    expect(body).toContain("relative grid w-full");
    expect(body).toContain("Heads up");
  });

  test.each(["default", "error", "info", "success", "warning"] as const)(
    "renders the %s variant",
    (variant) => {
      const { body } = render(Alert, { props: { variant } });
      const expected = {
        default: "dark:bg-input/32",
        error: "border-destructive/32",
        info: "border-info/32",
        success: "border-success/32",
        warning: "border-warning/32",
      }[variant];
      expect(body).toContain(expected);
    },
  );

  test("exports and renders every compound part with its COSS slot", () => {
    const cases = [
      [AlertTitle, "alert-title", "font-medium"],
      [AlertDescription, "alert-description", "text-muted-foreground"],
      [AlertAction, "alert-action", "sm:self-center"],
    ] as const;

    for (const [Component, slot, className] of cases) {
      const { body } = render(Component, {
        props: { children: text(slot), "data-forwarded": "yes" },
      });
      expect(body).toContain(`data-slot="${slot}"`);
      expect(body).toContain('data-forwarded="yes"');
      expect(body).toContain(className);
      expect(body).toContain(slot);
    }
  });
});
