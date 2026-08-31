import { describe, expect, test } from "vitest";
import { parsePreviewQuery } from "../../src/lib/preview/contract.js";

describe("preview alignment contract", () => {
  test.each(["start", "center", "end"] as const)(
    "passes vertical %s alignment through the deterministic preview query",
    (align) => {
      expect(
        parsePreviewQuery(new URLSearchParams({ align, theme: "light", width: "mobile" })),
      ).toMatchObject({
        align,
        ok: true,
        theme: "light",
        width: "mobile",
        widthPixels: 390,
      });
    },
  );

  test("keeps center as the compatibility default for callers without alignment", () => {
    expect(
      parsePreviewQuery(new URLSearchParams({ theme: "dark", width: "desktop" })),
    ).toMatchObject({
      align: "center",
      ok: true,
      theme: "dark",
      width: "desktop",
      widthPixels: 1200,
    });
  });

  test.each([
    new URLSearchParams({ align: "left", theme: "light", width: "desktop" }),
    new URLSearchParams("align=start&align=end&theme=light&width=desktop"),
  ])("rejects ambiguous or non-vertical alignment", (query) => {
    expect(parsePreviewQuery(query)).toEqual({
      errors: ["align must be start, center, or end"],
      ok: false,
    });
  });
});
