import assert from "node:assert/strict";
import test from "node:test";

import { findForbiddenPaths } from "./check-forbidden-paths.mjs";

test("accepts ordinary repository paths", () => {
  assert.deepEqual(
    findForbiddenPaths(["apps/ui/src/routes/+page.svelte", "packages/ui/src/index.ts"]),
    [],
  );
});

test("rejects every local-only root", () => {
  const paths = [
    "reference/apps/ui/package.json",
    "shardsui/packages/shardsui/package.json",
    ".worktrees/foundation/package.json",
    "artifacts/parity/button.png",
    "playwright-report/index.html",
    "test-results/results.json",
  ];

  assert.deepEqual(findForbiddenPaths(paths), paths);
});

test("normalizes windows and relative prefixes", () => {
  assert.deepEqual(findForbiddenPaths(["./reference\\apps\\ui\\package.json"]), [
    "./reference\\apps\\ui\\package.json",
  ]);
});
