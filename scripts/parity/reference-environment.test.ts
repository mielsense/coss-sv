import assert from "node:assert/strict";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, dirname, join } from "node:path";
import test from "node:test";

import {
  assertIsolatedChildEnvironment,
  createIsolatedChildEnvironment,
  isolatedPathEnvironmentKeys,
} from "./reference-environment.mts";

test("overrides every package-manager and user path with an isolated temporary path", () => {
  const root = mkdtempSync(join(tmpdir(), "coss-sv-reference-env-"));

  try {
    const environment = createIsolatedChildEnvironment(root, {
      HOME: "/Users/example",
      COREPACK_HOME: "/Users/example/.cache/corepack",
      npm_config_store_dir: "/Users/example/.pnpm-store",
    });

    assert.doesNotThrow(() => assertIsolatedChildEnvironment(root, environment));
    for (const key of isolatedPathEnvironmentKeys) {
      assert.ok(environment[key]?.startsWith(root), `${key} must stay below the temp root`);
    }
    assert.notEqual(environment.HOME, "/Users/example");
    assert.equal(environment.PATH?.split(delimiter)[0], dirname(process.execPath));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }

  assert.equal(existsSync(root), false);
});

test("rejects an effective package-manager path outside the temporary root", () => {
  const root = mkdtempSync(join(tmpdir(), "coss-sv-reference-env-invalid-"));

  try {
    const environment = createIsolatedChildEnvironment(root);
    environment.PNPM_HOME = "/tmp/shared-pnpm-home";
    assert.throws(
      () => assertIsolatedChildEnvironment(root, environment),
      /PNPM_HOME escapes the temporary reference root/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
