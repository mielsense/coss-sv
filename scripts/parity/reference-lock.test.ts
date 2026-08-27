import assert from "node:assert/strict";
import test from "node:test";

import {
  applyPinnedPnpmOverrides,
  createPinnedPnpmOverrides,
  parsePinnedBunLock,
} from "./reference-lock.mts";

const bunLock = parsePinnedBunLock(`{
  "lockfileVersion": 1,
  "workspaces": {
    "": { "name": "fixture" },
    "packages/workspace-package": { "name": "workspace-package", "version": "3.0.0" },
  },
  "packages": {
    "workspace-package": ["workspace-package@workspace:packages/workspace-package"],
    "workspace-package/foo": ["foo@1.5.0", "", {}],
    "foo": ["foo@2.0.0", "", {}, "sha512-top"],
    "parent": ["parent@1.0.0", "", { "dependencies": { "foo": "1.0.0" } }],
    "parent/foo": ["foo@1.0.0", "", {}, "sha512-nested"],
    "foo-alias": ["foo@2.0.0", "", {}],
  },
}`);

test("converts every pinned Bun resolution into exact pnpm overrides", () => {
  assert.deepEqual(createPinnedPnpmOverrides(bunLock), {
    foo: "2.0.0",
    "foo-alias": "npm:foo@2.0.0",
    parent: "1.0.0",
    "parent@1.0.0>foo": "1.0.0",
    "workspace-package@3.0.0>foo": "1.5.0",
  });
});

test("preserves existing pnpm settings while replacing resolution drift with pins", () => {
  assert.deepEqual(
    applyPinnedPnpmOverrides({ pnpm: { onlyBuiltDependencies: ["esbuild"] } }, bunLock),
    {
      pnpm: {
        onlyBuiltDependencies: ["esbuild"],
        overrides: createPinnedPnpmOverrides(bunLock),
      },
    },
  );
});

test("rejects lock data that cannot prove exact package versions", () => {
  assert.throws(
    () =>
      parsePinnedBunLock('{ "lockfileVersion": 1, "workspaces": {}, "packages": { "foo": [] } }'),
    /unsupported record/,
  );
});
