import { describe, expect, test } from "vitest";
import { normalizeComputedStyle, normalizeGeometry } from "./preview-comparison.js";

describe("preview comparison normalization", () => {
  test("rounds browser geometry without discarding meaningful drift", () => {
    expect(normalizeGeometry({ height: 40.004, width: 99.996, x: 10.124, y: 20.125 })).toEqual({
      height: 40,
      width: 100,
      x: 10.12,
      y: 20.13,
    });
  });

  test("selects explicit computed properties in stable key order", () => {
    expect(
      normalizeComputedStyle({ color: "rgb(0, 0, 0)", display: "flex", position: "static" }, [
        "position",
        "color",
      ]),
    ).toEqual({ color: "rgb(0, 0, 0)", position: "static" });
  });
});
