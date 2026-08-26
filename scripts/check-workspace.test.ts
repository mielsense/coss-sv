import assert from "node:assert/strict";
import test from "node:test";

import { validateWorkspace } from "./check-workspace.mjs";

test("accepts the repository workspace configuration", () => {
  assert.deepEqual(validateWorkspace(), []);
});
