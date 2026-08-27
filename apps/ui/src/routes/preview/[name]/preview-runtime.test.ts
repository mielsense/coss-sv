import { describe, expect, test } from "vitest";
import { createPreviewRuntime, createSeededRandom } from "./preview-runtime.js";

const config = {
  direction: "ltr",
  locale: "en-US",
  network: "blocked",
  now: "2026-08-26T12:00:00.000Z",
  reducedMotion: "reduce",
  seed: 20260826,
  theme: "light",
  timers: "manual",
  width: "desktop",
  widthPixels: 1200,
} as const;

describe("deterministic preview runtime", () => {
  test("repeats random values, ids, and time from the same configuration", () => {
    const first = createPreviewRuntime(config);
    const second = createPreviewRuntime(config);

    expect([first.random(), first.random()]).toEqual([second.random(), second.random()]);
    expect(first.id("menu")).toBe(second.id("menu"));
    expect(first.now().toISOString()).toBe(config.now);
  });

  test("uses a stable nonconstant unsigned random sequence", () => {
    const random = createSeededRandom(42);
    const values = [random(), random(), random()];

    expect(values).toEqual([0.6011037519201636, 0.44829055899754167, 0.8524657934904099]);
    expect(new Set(values).size).toBe(3);
    expect(values.every((value) => value >= 0 && value < 1)).toBe(true);
  });
});
