import { describe, expect, test } from "vitest";
import { particleCatalog, particleCategories } from "@/particles/catalog.js";
import {
  filterParticles,
  getParticleSearchItems,
  groupParticleSearchItems,
  parseParticleTags,
} from "@/particles/model.js";

function required<T>(value: T | undefined, label: string): T {
  if (value === undefined) throw new Error(`Missing ${label}`);
  return value;
}

describe("particle catalog", () => {
  test("retains the complete pinned COSS catalog and category order", () => {
    expect(particleCatalog).toHaveLength(508);
    expect(new Set(particleCatalog.map(({ name }) => name))).toHaveLength(508);
    expect(particleCategories.slice(0, 6)).toEqual([
      "accordion",
      "alert",
      "alert dialog",
      "autocomplete",
      "avatar",
      "badge",
    ]);
    expect(particleCatalog.find(({ name }) => name === "p-accordion-1")).toMatchObject({
      categories: ["accordion"],
      description: "Basic accordion",
      registryDependencies: ["@coss/accordion"],
    });
    expect(particleCatalog.find(({ name }) => name === "p-tooltip-4")).toMatchObject({
      categories: ["tooltip"],
      description: "Vertical group with animated tooltip",
    });
  });
});

describe("particle filters", () => {
  test("separates valid and invalid URL tags", () => {
    expect(parseParticleTags("button,loading,not-real,,button")).toEqual({
      invalid: ["not-real"],
      valid: ["button", "loading", "button"],
    });
    expect(parseParticleTags(null)).toEqual({ invalid: [], valid: [] });
  });

  test("filters by every selected category and ranks exact prefixes first", () => {
    const particles = [
      {
        categories: ["button", "loading"],
        description: "Secondary",
        name: "p-spinner-1",
        registryDependencies: ["@coss/button"],
      },
      {
        categories: ["button", "loading"],
        description: "Primary",
        name: "p-button-18",
        registryDependencies: [],
      },
      {
        categories: ["button"],
        description: "Excluded",
        name: "p-button-1",
        registryDependencies: [],
      },
    ] as const;

    expect(filterParticles(particles, ["button", "loading"]).map(({ name }) => name)).toEqual([
      "p-button-18",
      "p-spinner-1",
    ]);
  });

  test("builds ordered search items only from available particles", () => {
    const items = getParticleSearchItems([
      required(
        particleCatalog.find(({ name }) => name === "p-button-18"),
        "p-button-18 catalog entry",
      ),
      required(
        particleCatalog.find(({ name }) => name === "p-alert-dialog-1"),
        "p-alert-dialog-1 catalog entry",
      ),
    ]);
    expect(items.map(({ value }) => value)).toEqual([
      "alert dialog",
      "button",
      "dialog",
      "loading",
    ]);
    expect(items[0]).toEqual({ label: "Alert Dialog", value: "alert dialog" });
  });

  test("keeps selected and compatible categories enabled and groups impossible filters", () => {
    const particles = [
      {
        categories: ["button", "loading"],
        description: "Loading button",
        name: "p-button-18",
        registryDependencies: [],
      },
      {
        categories: ["button", "disabled"],
        description: "Disabled button",
        name: "p-button-12",
        registryDependencies: [],
      },
    ] as const;
    const items = getParticleSearchItems(particles);
    const groups = groupParticleSearchItems(
      items,
      [
        required(
          items.find(({ value }) => value === "loading"),
          "loading search item",
        ),
      ],
      particles,
    );

    expect(groups).toEqual([
      {
        items: [
          { label: "Loading", value: "loading" },
          { label: "Button", value: "button" },
        ],
        type: "enabled",
      },
      { items: [{ label: "Disabled", value: "disabled" }], type: "disabled" },
    ]);
  });
});
