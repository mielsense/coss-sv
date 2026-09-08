import { expect, test } from "vitest";
import { containsOnlyComments } from "./comment-only-fixture.js";

test("accepts empty output and adjacent complete comments", () => {
  expect(containsOnlyComments("")).toBe(true);
  expect(containsOnlyComments("<!--a--><!--[--><!--]-->")).toBe(true);
});

test("rejects missing output, visible text, markup, and unterminated comments", () => {
  for (const value of [
    undefined,
    " ",
    "<span></span>",
    "<!--a-->visible",
    "<!--a--><!--b",
    "<!--a-->-->",
  ]) {
    expect(containsOnlyComments(value)).toBe(false);
  }
});

test("fully consumes a long adversarial sequence without backtracking", () => {
  const comments = "<!--x-->".repeat(50_000);
  expect(containsOnlyComments(comments)).toBe(true);
  expect(containsOnlyComments(`${comments}!`)).toBe(false);
});
