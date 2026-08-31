import { describe, expect, test } from "vitest";
import { BREAKPOINTS, resolveMediaQuery } from "./use-media-query.svelte.js";

describe("useMediaQuery", () => {
  test("matches the pinned COSS breakpoint map", () => {
    expect(BREAKPOINTS).toEqual({
      "2xl": 1536,
      "3xl": 1600,
      "4xl": 2000,
      lg: 1024,
      md: 800,
      sm: 640,
      xl: 1280,
    });
  });

  test("resolves shorthand, range, object, and raw queries", () => {
    expect(resolveMediaQuery("md")).toBe("(min-width: 800px)");
    expect(resolveMediaQuery("max-md")).toBe("(max-width: 799px)");
    expect(resolveMediaQuery("md:max-lg")).toBe("(min-width: 800px) and (max-width: 1023px)");
    expect(resolveMediaQuery({ max: "md", min: 600, pointer: "coarse" })).toBe(
      "(min-width: 600px) and (max-width: 799px) and (pointer: coarse)",
    );
    expect(resolveMediaQuery("(prefers-reduced-motion: reduce)")).toBe(
      "(prefers-reduced-motion: reduce)",
    );
    expect(resolveMediaQuery({})).toBe("(min-width: 0px)");
  });
});
