import { expect, test } from "vitest";

import { parsePreviewQuery, previewWidths } from "../../apps/ui/src/lib/preview/contract.js";

test("accepts the exact deterministic theme and width contract", () => {
  expect(parsePreviewQuery(new URLSearchParams("theme=light&width=desktop"))).toEqual({
    align: "center",
    direction: "ltr",
    locale: "en-US",
    network: "blocked",
    now: "2026-08-26T12:00:00.000Z",
    ok: true,
    reducedMotion: "no-preference",
    seed: 20260826,
    theme: "light",
    timers: "real",
    width: "desktop",
    widthPixels: previewWidths.desktop,
  });
  expect(parsePreviewQuery(new URLSearchParams("theme=dark&width=mobile"))).toEqual({
    align: "center",
    direction: "ltr",
    locale: "en-US",
    network: "blocked",
    now: "2026-08-26T12:00:00.000Z",
    ok: true,
    reducedMotion: "no-preference",
    seed: 20260826,
    theme: "dark",
    timers: "real",
    width: "mobile",
    widthPixels: previewWidths.mobile,
  });
});

test("rejects missing, repeated, and unknown preview query values", () => {
  for (const query of [
    "",
    "theme=sepia&width=desktop",
    "theme=light&width=wide",
    "theme=light&theme=dark&width=desktop",
    "theme=light&width=desktop&width=mobile",
  ]) {
    const result = parsePreviewQuery(new URLSearchParams(query));
    expect(result, query).toMatchObject({ ok: false });
  }
});
