import { describe, expect, test } from "vitest";
import { parsePreviewQuery } from "./preview-contract.js";

describe("preview query contract", () => {
  test("keeps the canonical route concise while filling deterministic defaults", () => {
    const result = parsePreviewQuery(new URLSearchParams({ theme: "light", width: "desktop" }));

    expect(result).toEqual({
      align: "center",
      direction: "ltr",
      locale: "en-US",
      network: "blocked",
      now: "2026-08-26T12:00:00.000Z",
      ok: true,
      reducedMotion: "reduce",
      seed: 20260826,
      theme: "light",
      timers: "manual",
      width: "desktop",
      widthPixels: 1200,
    });
  });

  test("accepts an explicit deterministic environment", () => {
    const result = parsePreviewQuery(
      new URLSearchParams({
        direction: "rtl",
        locale: "ar-EG",
        network: "live",
        now: "2024-01-02T03:04:05.000Z",
        reducedMotion: "no-preference",
        seed: "42",
        theme: "dark",
        timers: "real",
        width: "mobile",
      }),
    );

    expect(result).toMatchObject({
      direction: "rtl",
      locale: "ar-EG",
      network: "live",
      now: "2024-01-02T03:04:05.000Z",
      ok: true,
      reducedMotion: "no-preference",
      seed: 42,
      theme: "dark",
      timers: "real",
      width: "mobile",
      widthPixels: 390,
    });
  });

  test.each([
    ["duplicate values", "theme=light&theme=dark&width=desktop", "theme must appear once"],
    ["unknown values", "theme=sepia&width=desktop", "theme must be light or dark"],
    ["unknown keys", "theme=light&width=desktop&foo=bar", "unexpected preview parameter: foo"],
    [
      "invalid locale",
      "theme=light&width=desktop&locale=not_a_locale",
      "locale must be a valid BCP 47 locale",
    ],
    [
      "invalid clock",
      "theme=light&width=desktop&now=tomorrow",
      "now must be an ISO 8601 timestamp",
    ],
    [
      "invalid seed",
      "theme=light&width=desktop&seed=-1",
      "seed must be an unsigned 32-bit integer",
    ],
  ])("rejects %s", (_label, search, message) => {
    const result = parsePreviewQuery(new URLSearchParams(search));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toContain(message);
  });
});
