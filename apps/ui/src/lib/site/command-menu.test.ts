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
    expect(source).toContain("const isCommandMenuShortcut =");
    expect(source).toContain("if (isCommandMenuShortcut) {");
    expect(source).toContain("if (isTyping) return;");
    expect(source).toContain('event.key !== "Home" && event.key !== "End"');
    expect(source).toContain("onItemHighlighted");
    expect(source).toContain("navigator.clipboard.writeText");
    expect(source).toMatch(
      /pnpm dlx shadcn-svelte@latest add https:\/\/coss-sv\.vercel\.app\/r\/\$\{item\.componentSlug\}\.json/,
    );
    expect(source).not.toContain("add @coss-sv/");
    expect(source).toContain("Go to Page");
    expect(source).toContain("ArrowTurnBackwardIcon");
    expect(source).toContain("Atom01Icon");
    expect(source).toContain("BookOpen02Icon");
    expect(source).toContain("Search01Icon");
    expect(source).toContain("<HugeiconsIcon");
    expect(source).not.toContain("<svg");
    expect(source).not.toContain("<dialog");
  });

  test("the mobile trigger exposes dialog state to assistive technology", async () => {
    const source = await readFile(new URL("./MobileNav.svelte", import.meta.url), "utf8");

    expect(source).toContain('from "@shardsui/svelte/drawer"');
    expect(source).toContain("<Drawer.Root");
    expect(source).toContain('swipeDirection="left"');
    expect(source).toContain("<Drawer.Viewport");
    expect(source).toContain("<Drawer.Popup");
    expect(source).toContain("<Drawer.Content");
    expect(source).toContain("<Drawer.Close");
    expect(source).toContain('aria-haspopup="dialog"');
    expect(source).toContain("aria-expanded={menuOpen}");
    const mobileGroupHeading = "$" + "{group.label.toLowerCase()}";
    expect(source).toContain(`aria-labelledby={\`mobile-${mobileGroupHeading}-heading\`}`);
    expect(source).toContain(`id={\`mobile-${mobileGroupHeading}-heading\`}`);
    expect(source).toContain("documentationNavigationGroups");
    expect(source).toContain("{item.label}");
    expect(source).not.toContain("<dialog");
    expect(source).not.toContain("showModal");
  });
});
