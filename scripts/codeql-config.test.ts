import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("CodeQL is permissioned and gated for private repositories", () => {
  const workflow = readFileSync(
    new URL("../.github/workflows/codeql.yml", import.meta.url),
    "utf8",
  );

  assert.match(workflow, /actions:\s*read/);
  assert.match(workflow, /security-events:\s*write/);
  assert.match(workflow, /vars\.CODEQL_PRIVATE_ENABLED == 'true'/);
});
