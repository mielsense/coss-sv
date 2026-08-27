import assert from "node:assert/strict";
import test from "node:test";

import {
  convertReferencePackageToPinnedPnpmWorkspace,
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
    "esbuild": ["esbuild@0.25.12", "", {}],
    "core-js-pure": ["core-js-pure@3.45.0", "", {}],
    "fumadocs-mdx": ["fumadocs-mdx@14.0.3", "", {}],
    "fumadocs-mdx/esbuild": ["esbuild@0.27.0", "", {}],
    "msw": ["msw@2.11.2", "", {}],
    "sharp": ["sharp@0.34.5", "", {}],
  },
}`);

test("converts every pinned Bun resolution into exact pnpm overrides", () => {
  assert.deepEqual(createPinnedPnpmOverrides(bunLock), {
    "core-js-pure": "3.45.0",
    esbuild: "0.25.12",
    foo: "2.0.0",
    "foo-alias": "npm:foo@2.0.0",
    "fumadocs-mdx": "14.0.3",
    "fumadocs-mdx@14.0.3>esbuild": "0.27.0",
    msw: "2.11.2",
    parent: "1.0.0",
    "parent@1.0.0>foo": "1.0.0",
    sharp: "0.34.5",
    "workspace-package@3.0.0>foo": "1.5.0",
  });
});

test("emits pinned resolutions and reviewed build scripts as workspace configuration", () => {
  assert.deepEqual(
    convertReferencePackageToPinnedPnpmWorkspace(
      { pnpm: { overrides: { stale: "9.9.9" } } },
      bunLock,
    ),
    {
      packageJson: {},
      workspace: {
        packages: ["apps/*", "apps/examples/*", "packages/*"],
        overrides: createPinnedPnpmOverrides(bunLock),
        allowBuilds: {
          "core-js-pure@3.45.0": false,
          "esbuild@0.25.12": true,
          "esbuild@0.27.0": true,
          "msw@2.11.2": false,
          "sharp@0.34.5": true,
        },
        ignoredBuiltDependencies: ["core-js-pure@3.45.0", "msw@2.11.2"],
        onlyBuiltDependencies: ["esbuild@0.25.12", "esbuild@0.27.0", "sharp@0.34.5"],
        strictDepBuilds: true,
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
