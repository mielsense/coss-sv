import { describe, expect, test } from "vitest";
import { formatDatePpp } from "../../registry/default/lib/date-format.js";

describe("COSS date-fns-compatible display formatting", () => {
  test.each([
    [new Date(2026, 7, 1, 12), "August 1st, 2026"],
    [new Date(2026, 7, 2, 12), "August 2nd, 2026"],
    [new Date(2026, 7, 3, 12), "August 3rd, 2026"],
    [new Date(2026, 7, 11, 12), "August 11th, 2026"],
    [new Date(2026, 7, 12, 12), "August 12th, 2026"],
    [new Date(2026, 7, 13, 12), "August 13th, 2026"],
    [new Date(2026, 7, 21, 12), "August 21st, 2026"],
    [new Date(2026, 7, 28, 12), "August 28th, 2026"],
  ])("formats PPP ordinal semantics for %s", (date, expected) => {
    expect(formatDatePpp(date)).toBe(expected);
  });
});
