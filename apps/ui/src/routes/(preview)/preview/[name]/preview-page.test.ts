import { describe, expect, test } from "vitest";
import { resolvePreviewPage } from "./preview-page.js";

describe("preview route resolution", () => {
  test("resolves registered support previews", () => {
    expect(resolvePreviewPage("_fixture")).toEqual({ name: "_fixture" });
  });

  test("throws a stable SvelteKit 404 for missing inventory", () => {
    expect(() => resolvePreviewPage("p-not-yet-ported")).toThrow(
      expect.objectContaining({
        body: { message: "Preview p-not-yet-ported was not found." },
        status: 404,
      }),
    );
  });
});
