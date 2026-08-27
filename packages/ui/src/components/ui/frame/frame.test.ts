import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "./index.js";

const children = createRawSnippet(() => ({ render: () => "<span>content</span>" }));

describe("Frame SSR contract", () => {
  test("exports every COSS frame part", () => {
    for (const part of [
      Frame,
      FrameDescription,
      FrameFooter,
      FrameHeader,
      FramePanel,
      FrameTitle,
    ]) {
      expect(part).toBeTypeOf("function");
    }
  });

  test.each([
    [Frame, "div", "frame", "relative flex flex-col rounded-2xl bg-muted/72 p-1"],
    [FramePanel, "div", "frame-panel", "relative rounded-xl border bg-background"],
    [FrameHeader, "header", "frame-panel-header", "flex flex-col px-5 py-4"],
    [FrameTitle, "div", "frame-panel-title", "font-semibold text-sm"],
    [FrameDescription, "div", "frame-panel-description", "text-muted-foreground text-sm"],
    [FrameFooter, "footer", "frame-panel-footer", "px-5 py-4"],
  ] as const)("renders %s as the exact semantic wrapper", (Component, tag, slot, classFragment) => {
    const body = render(Component as typeof Frame, {
      props: { class: "custom-frame-class", "data-forwarded": slot, children },
    }).body;
    expect(body).toContain(`<${tag}`);
    expect(body).toContain(`data-slot="${slot}"`);
    expect(body).toContain(`data-forwarded="${slot}"`);
    expect(body).toContain(classFragment);
    expect(body).toContain("custom-frame-class");
    expect(body).toContain("content");
  });

  test("preserves the exact panel edge and shadow utilities", () => {
    const body = render(FramePanel).body;
    expect(body).toContain("bg-clip-padding p-5 shadow-xs/5");
    expect(body).toContain("before:absolute before:inset-0");
    expect(body).toContain("before:shadow-[0_1px_--theme(--color-black/4%)]");
    expect(body).toContain("dark:before:shadow-[0_-1px_--theme(--color-white/6%)]");
  });
});
