import { describe, expect, test } from "vitest";
import {
  createLocalPreviewOrigins,
  referencePort,
  resolveTargetPreviewPort,
  targetPreviewBaseUrl,
} from "../e2e/helpers/ports.js";

describe("preview server ports", () => {
  test("uses the CI default and accepts a free alternate target port", () => {
    expect(resolveTargetPreviewPort(undefined)).toBe(4173);
    expect(resolveTargetPreviewPort(" 4174 ")).toBe(4174);
    expect(targetPreviewBaseUrl(4174)).toBe("http://127.0.0.1:4174");
  });

  test.each(["0", "65536", "4.5", "4174; echo unsafe", `${referencePort}`])(
    "rejects invalid or conflicting port %s",
    (value) => {
      expect(() => resolveTargetPreviewPort(value)).toThrow(/COSS_TARGET_PREVIEW_PORT/);
    },
  );

  test("derives the HTTP and WebSocket allowlist from the selected port", () => {
    const origins = createLocalPreviewOrigins(4174);

    expect(origins).toContain("http://127.0.0.1:4174");
    expect(origins).toContain("http://localhost:4174");
    expect(origins).toContain("ws://127.0.0.1:4174");
    expect(origins).toContain("ws://localhost:4174");
    expect(origins).toContain(`http://127.0.0.1:${referencePort}`);
    expect(origins).not.toContain("http://127.0.0.1:4173");
  });
});
