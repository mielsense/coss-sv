import { describe, expect, test } from "vitest";
import { registryLibs } from "../../registry/registry-libs.js";

describe("segmented control registry library", () => {
  test("publishes the shared COSS styling helper", () => {
    expect(registryLibs).toContainEqual(
      expect.objectContaining({
        dependencies: [],
        files: [
          expect.objectContaining({
            path: "../../packages/ui/src/lib/segmented-control.ts",
            type: "registry:lib",
          }),
        ],
        name: "segmented-control",
        registryDependencies: [],
        type: "registry:lib",
      }),
    );
  });
});
