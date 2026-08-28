import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workflow = readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");

test("checks out the pinned COSS reference without tracking it in this repository", () => {
  assert.match(workflow, /repository: cosscom\/coss/);
  assert.match(workflow, /ref: 19620ae8cae81e30775f2cde03829326cb4916b2/);
  assert.match(workflow, /path: reference/);
  assert.match(workflow, /persist-credentials: false/);
});
