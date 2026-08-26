import assert from "node:assert/strict";
import test from "node:test";

import { checkEvidenceDirectory, findUnapprovedReferencePaths } from "./check-license-boundary.mjs";

test("accepts a clean checkout before component evidence exists", () => {
  assert.deepEqual(checkEvidenceDirectory("docs/porting/components-that-do-not-exist"), []);
});

test("accepts files inside the MIT-designated apps/ui tree", () => {
  assert.deepEqual(
    findUnapprovedReferencePaths(
      "Read reference/apps/ui/registry/default/ui/button.tsx and reference/apps/ui/content/docs/components/button.mdx",
    ),
    [],
  );
});

test("rejects files outside the approved source tree", () => {
  assert.deepEqual(
    findUnapprovedReferencePaths(
      "Do not adapt reference/packages/ui/src/components/button.tsx or reference/README.md",
    ),
    ["reference/packages/ui/src/components/button.tsx", "reference/README.md"],
  );
});
