import { AlertCircleIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import HugeiconsIcon from "./hugeicons-icon.svelte";

describe("SSR-safe Hugeicons renderer", () => {
  test("renders official path and circle data during SSR", () => {
    const body = render(HugeiconsIcon, {
      props: { icon: AlertCircleIcon, strokeWidth: 2 },
    }).body;

    expect(body).toContain("<circle");
    expect(body).toContain("<path");
    expect(body).toContain('stroke-width="2"');
    expect(body).not.toContain("<script");
  });

  test("applies consumer SVG attributes to the root and glyph, then appends children", () => {
    const children = createRawSnippet(() => ({
      render: () => '<circle data-testid="consumer-child" cx="12" cy="12" r="2"></circle>',
    }));
    const body = render(HugeiconsIcon, {
      props: {
        children,
        class: ["base", { active: true }],
        fill: "gold",
        height: 18,
        icon: Tick02Icon,
        stroke: "purple",
        "stroke-linecap": "square",
        "stroke-linejoin": "bevel",
        "stroke-width": 4,
        strokeWidth: 3,
        width: 16,
      },
    }).body;

    expect(body).toContain('class="base active"');
    expect(body).toContain('width="16"');
    expect(body).toContain('height="18"');
    expect(body).toContain('fill="gold"');
    expect(body).toContain('stroke="purple"');
    expect(body).toContain('stroke-linecap="square"');
    expect(body).toContain('stroke-linejoin="bevel"');
    expect(body).toContain('stroke-width="4"');
    expect(body.indexOf("<path")).toBeLessThan(body.indexOf('data-testid="consumer-child"'));
  });

  test("drops unsupported node tags instead of rendering arbitrary markup", () => {
    const body = render(HugeiconsIcon, {
      props: {
        icon: [["script", { type: "text/javascript" }]] as const,
      },
    }).body;

    expect(body).not.toContain("<script");
  });
});
