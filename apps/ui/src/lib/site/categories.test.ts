import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import CategoryThumbnail from "./CategoryThumbnail.svelte";
import { componentCategories } from "./categories.js";

const upstreamOrder = [
  "accordion",
  "alert",
  "alert-dialog",
  "autocomplete",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "calendar",
  "card",
  "checkbox",
  "checkbox-group",
  "collapsible",
  "combobox",
  "command",
  "context-menu",
  "date-picker",
  "dialog",
  "drawer",
  "empty",
  "field",
  "fieldset",
  "form",
  "frame",
  "group",
  "input",
  "input-group",
  "kbd",
  "label",
  "menu",
  "meter",
  "number-field",
  "otp-field",
  "pagination",
  "popover",
  "preview-card",
  "progress",
  "radio-group",
  "scroll-area",
  "select",
  "segmented-control",
  "separator",
  "sheet",
  "skeleton",
  "slider",
  "spinner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toast",
  "toggle",
  "toggle-group",
  "toolbar",
  "tooltip",
] as const;

describe("COSS homepage category parity", () => {
  test("matches the complete pinned COSS page order", () => {
    expect(componentCategories.map(({ slug }) => slug)).toEqual(upstreamOrder);
    expect(componentCategories).toHaveLength(55);
  });

  test("keeps one exact upstream New marker", () => {
    expect(componentCategories.filter(({ isNew }) => isNew).map(({ slug }) => slug)).toEqual([
      "segmented-control",
    ]);
  });

  test("locks the inspected names and descriptions", async () => {
    const source = await readFile(new URL("./categories.ts", import.meta.url), "utf8");
    const digest = createHash("sha256").update(source).digest("hex");

    expect(digest).toBe("db937bf9ef7d1be6c590382cfc095e37344fe3a5a785f87788f410918893b782");
    expect(componentCategories.every(({ name, description }) => name && description)).toBe(true);
  });

  test("ports every upstream thumbnail explicitly and leaves Segmented Control blank", async () => {
    const source = await readFile(new URL("./CategoryThumbnail.svelte", import.meta.url), "utf8");
    const upstreamThumbnailSlugs = upstreamOrder.filter((slug) => slug !== "segmented-control");

    for (const slug of upstreamThumbnailSlugs) {
      expect(source).toContain(`slug === "${slug}"`);
      expect(render(CategoryThumbnail, { props: { slug } }).body).toContain(
        `data-thumbnail="${slug}"`,
      );
    }

    expect(render(CategoryThumbnail, { props: { slug: "segmented-control" } }).body).not.toContain(
      "category-thumbnail",
    );
    expect(source).not.toContain("new Set");
    expect(source).not.toContain("Thumbnails.has");
  });

  test("merges primitive defaults into the measured upstream thumbnail geometry", () => {
    const accordion = render(CategoryThumbnail, { props: { slug: "accordion" } }).body;
    const alert = render(CategoryThumbnail, { props: { slug: "alert" } }).body;
    const autocomplete = render(CategoryThumbnail, { props: { slug: "autocomplete" } }).body;
    const drawer = render(CategoryThumbnail, { props: { slug: "drawer" } }).body;

    // 50 spacing units = 200px, matching the inspected Accordion inner card.
    expect(accordion).toContain("max-w-50");
    expect(accordion).not.toContain("max-w-72");
    expect(accordion).toContain("divide-y divide-border p-0");
    expect(accordion).not.toContain("divide-y divide-border p-6");

    // Alert is a single 16px icon row with 12px block padding, not the primitive's 24px default.
    expect(alert).toContain("items-center gap-2 p-3");
    expect(alert).not.toContain("items-center gap-2 p-6");

    // The Autocomplete stack is capped at 200px and keeps its inspected 8px/16px padding.
    expect(autocomplete.match(/max-w-50/g)).toHaveLength(1);
    expect(autocomplete).toContain("px-4 py-2");
    expect(autocomplete).toContain("gap-4 p-4");

    // Explicit max-width removal must survive the Card primitive defaults.
    expect(drawer).toContain("max-w-none");
    expect(drawer).not.toContain("max-w-72");

    for (const body of [accordion, alert, autocomplete, drawer]) {
      expect(body).toContain("border-border");
    }
  });
});
