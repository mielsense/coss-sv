import { expect, test } from "vitest";

import {
  parsePreviewQuery,
  previewWidths,
} from "../../apps/ui/src/routes/preview/[name]/preview-contract.js";

test("accepts the exact deterministic theme and width contract", () => {
  expect(parsePreviewQuery(new URLSearchParams("theme=light&width=desktop"))).toEqual({
    ok: true,
    theme: "light",
    width: "desktop",
    widthPixels: previewWidths.desktop,
  });
  expect(parsePreviewQuery(new URLSearchParams("theme=dark&width=mobile"))).toEqual({
    ok: true,
    theme: "dark",
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
