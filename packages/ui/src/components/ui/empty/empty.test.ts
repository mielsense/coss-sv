import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as Empty from "./index.js";

const content = (value: string) =>
  createRawSnippet(() => ({ render: () => `<span>${value}</span>` }));

describe("Empty SSR contract", () => {
  test("renders every static part with forwarded attributes and snippets", () => {
    const parts = [
      [Empty.Empty, "empty", "justify-center"],
      [Empty.EmptyHeader, "empty-header", "max-w-sm"],
      [Empty.EmptyTitle, "empty-title", "text-xl"],
      [Empty.EmptyDescription, "empty-description", "text-muted-foreground"],
      [Empty.EmptyContent, "empty-content", "max-w-sm"],
    ] as const;
    for (const [Component, slot, className] of parts) {
      const { body } = render(Component, {
        props: { children: content(slot), "data-forwarded": "yes" },
      });
      expect(body).toContain(`data-slot="${slot}"`);
      expect(body).toContain('data-forwarded="yes"');
      expect(body).toContain(className);
      expect(body).toContain(slot);
    }
  });

  test("renders default media as one transparent content layer", () => {
    const { body } = render(Empty.EmptyMedia, {
      props: { children: content("Illustration") },
    });
    expect(body).toContain('data-slot="empty-media"');
    expect(body).toContain('data-variant="default"');
    expect(body).toContain("bg-transparent");
    expect(body).toContain("Illustration");
    expect(body.match(/aria-hidden/g)).toBeNull();
  });

  test("renders icon media with two decorative layers and one content layer", () => {
    const { body } = render(Empty.EmptyMedia, {
      props: { children: content("Icon"), class: "custom-media", variant: "icon" },
    });
    expect(body).toContain('data-variant="icon"');
    expect(body.match(/aria-hidden="true"/g)).toHaveLength(2);
    expect(body).toContain("-rotate-10");
    expect(body).toContain("rotate-10");
    expect(body).toContain("custom-media");
    expect(body).toContain("Icon");
  });
});
