import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("CodeQL can inspect private-repository workflow runs and publish results", () => {
  const workflow = readFileSync(
    new URL("../.github/workflows/codeql.yml", import.meta.url),
    "utf8",
  );

  assert.match(workflow, /actions:\s*read/);
  assert.match(workflow, /security-events:\s*write/);
});
