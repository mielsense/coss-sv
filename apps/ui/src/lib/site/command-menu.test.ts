import { readFile } from "node:fs/promises";
import { describe, expect, test } from "vitest";
import { hooksNavigation, resourcesNavigation } from "./site.js";

describe("COSS command and mobile navigation parity", () => {
  test("keeps the exact inspected Hooks and Resources groups", () => {
    expect(hooksNavigation).toEqual([
      { href: "/docs/hooks/use-media-query", label: "useMediaQuery" },
      { href: "/docs/hooks/use-copy-to-clipboard", label: "useCopyToClipboard" },
    ]);
    expect(resourcesNavigation).toEqual([
      { href: "/llms.txt", label: "llms.txt" },
      { href: "https://coss.com/origin", label: "coss.com origin" },
    ]);
  });

  test("uses the inspected Shards command-palette behavior rather than a native dialog", async () => {
    const source = await readFile(new URL("./CommandMenu.svelte", import.meta.url), "utf8");

    expect(source).toContain('from "@shardsui/svelte/dialog"');
    expect(source).toContain('from "@shardsui/svelte/autocomplete"');
    expect(source).toContain('autoHighlight="always"');
    expect(source).toContain("keepHighlight");
    expect(source).toContain("<Dialog.Root {open} onOpenChange={setCommandMenuOpen}>");
    expect(source).toContain("onkeydown={handleInputKeydown}");
    expect(source).toContain('event.key !== "Home" && event.key !== "End"');
    expect(source).toContain("onItemHighlighted");
    expect(source).toContain("navigator.clipboard.writeText");
    expect(source).toContain("shadcn-svelte@latest add");
    expect(source).toContain("Go to Page");
    expect(source).toContain("M7.99988 4.98096H6");
    expect(source).toContain("M12 7.48076C12 7.48076");
    expect(source).not.toContain("<dialog");
  });

  test("the mobile trigger exposes dialog state to assistive technology", async () => {
    const source = await readFile(new URL("./MobileNav.svelte", import.meta.url), "utf8");

    expect(source).toContain('aria-haspopup="dialog"');
    expect(source).toContain("aria-expanded={menuOpen}");
    expect(source).toContain("mobile-hooks-heading");
    expect(source).toContain("mobile-resources-heading");
  });
});
