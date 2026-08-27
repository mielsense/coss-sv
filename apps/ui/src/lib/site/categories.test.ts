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
});
