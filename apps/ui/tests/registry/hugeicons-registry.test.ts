import { describe, expect, test } from "vitest";
import { registryLibs } from "../../registry/registry-libs.js";
import { registryUi } from "../../registry/registry-ui.js";

const adapterConsumers = [
  "accordion",
  "breadcrumb",
  "calendar",
  "checkbox",
  "context-menu",
  "dialog",
  "drawer",
  "menu",
  "number-field",
  "pagination",
  "sheet",
  "spinner",
  "toast",
] as const;

describe("Hugeicons registry adapter", () => {
  test("publishes the SSR-safe renderer as a registry library", () => {
    expect(registryLibs).toEqual([
      expect.objectContaining({
        name: "hugeicons-icon",
        type: "registry:lib",
        dependencies: ["@hugeicons/core-free-icons@4.3.0"],
        registryDependencies: [],
        files: [
          expect.objectContaining({
            path: "../../packages/ui/src/lib/hugeicons-icon.svelte",
            type: "registry:lib",
          }),
        ],
      }),
    ]);
  });

  test("wires every adapter consumer to its library and icon data dependency", () => {
    const consumers = registryUi.filter((item) =>
      (item.registryDependencies as readonly string[]).includes("local:hugeicons-icon"),
    );

    expect(consumers.map((item) => item.name).sort()).toEqual([...adapterConsumers].sort());
    for (const item of consumers) {
      expect(item.dependencies, item.name).toContain("@hugeicons/core-free-icons@4.3.0");
    }
  });
});
