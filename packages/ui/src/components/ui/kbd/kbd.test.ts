import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import { Kbd, KbdGroup } from "./index.js";

const children = createRawSnippet(() => ({ render: () => "<span>K</span>" }));

describe("Kbd SSR contract", () => {
  test("renders a single keyboard key with exact COSS classes and forwarded attributes", () => {
    const body = render(Kbd, {
      props: { class: "text-red-500", "data-forwarded": "yes", children },
    }).body;
    expect(body).toContain("<kbd");
    expect(body).toContain('data-slot="kbd"');
    expect(body).toContain('data-forwarded="yes"');
    expect(body).toContain("pointer-events-none inline-flex h-5 min-w-5 select-none");
    expect(body).toContain("font-medium font-sans text-xs");
    expect(body).not.toContain("text-muted-foreground");
    expect(body).toContain("text-red-500");
    expect(body).toContain("<span>K</span>");
  });

  test("renders a semantic keyboard shortcut group", () => {
    const body = render(KbdGroup, { props: { class: "gap-2", children } }).body;
    expect(body).toContain("<kbd");
    expect(body).toContain('data-slot="kbd-group"');
    expect(body).toContain("inline-flex items-center gap-2");
    expect(body).not.toContain('gap-1"');
  });
});
