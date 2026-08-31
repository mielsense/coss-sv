import { describe, expect, test } from "vitest";
import {
  loadRegistryComponentSource,
  type RegistryDocument,
} from "../../src/lib/server/registry-component-source.js";

describe("registry component source", () => {
  test("expands dependencies and presents install-ready import paths", async () => {
    const documents: Record<string, RegistryDocument> = {
      button: {
        dependencies: ["@shardsui/svelte"],
        files: [
          {
            content: 'import { cn } from "$UTILS$.js";\n',
            target: "button/button.svelte",
            type: "registry:ui",
          },
        ],
        registryDependencies: ["./hugeicons-icon.json"],
      },
      "hugeicons-icon": {
        files: [
          {
            content: 'export { value } from "$LIB$/value.js";\n',
            target: "hugeicons-icon.svelte",
            type: "registry:lib",
          },
        ],
      },
    };

    const result = await loadRegistryComponentSource(["button"], async (name) => {
      const document = documents[name];
      if (!document) throw new Error("missing fixture");
      return document;
    });

    expect(result.dependencies).toEqual(["@shardsui/svelte"]);
    expect(result.files.map(({ path }) => path)).toEqual([
      "components/ui/button/button.svelte",
      "lib/hugeicons-icon.svelte",
    ]);
    expect(result.files[0]?.source.raw).toContain('from "@/utils.js"');
    expect(result.files[1]?.source.raw).toContain('from "@/value.js"');
  });

  test("rejects an aggregate before highlighting an unbounded source graph", async () => {
    const files = Array.from({ length: 129 }, (_, index) => ({
      content: `export const value${index} = ${index};`,
      target: `part-${index}.ts`,
      type: "registry:ui",
    }));

    await expect(loadRegistryComponentSource(["ui"], async () => ({ files }))).rejects.toThrow(
      /manual-installation limit/,
    );
  });
});
