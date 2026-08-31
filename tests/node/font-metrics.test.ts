import { describe, expect, test } from "vitest";

import { assertFontMetricWidth } from "../e2e/helpers/font-metrics.js";

describe("font-derived width assertions", () => {
  test("accepts the observed macOS and Linux shaping envelope", () => {
    expect(() => assertFontMetricWidth(127, 124.546875)).not.toThrow();
    expect(() => assertFontMetricWidth(48, 49.046875)).not.toThrow();
  });

  test("rejects layout drift outside the renderer envelope", () => {
    expect(() => assertFontMetricWidth(130, 124.546875)).toThrow(/font-derived width/);
    expect(() => assertFontMetricWidth(46, 49.046875)).toThrow(/font-derived width/);
  });

  test("rejects missing measurements", () => {
    expect(() => assertFontMetricWidth(undefined, 100)).toThrow(/no measurable width/);
  });
});
