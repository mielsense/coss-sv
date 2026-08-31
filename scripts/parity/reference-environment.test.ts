import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, dirname, join } from "node:path";
import test from "node:test";
import * as referenceEnvironment from "./reference-environment.mts";

import {
  assertIsolatedChildEnvironment,
  createIsolatedChildEnvironment,
  createReferenceWorkspaceCompatibilityLinks,
  isolatedPathEnvironmentKeys,
  referenceServerArguments,
} from "./reference-environment.mts";

test("detects when the parity launcher's parent process has exited", () => {
  const parentProcessExists = Reflect.get(referenceEnvironment, "parentProcessExists");
  assert.equal(typeof parentProcessExists, "function");
  assert.equal(
    parentProcessExists(42, () => {
      const error = new Error("missing process") as NodeJS.ErrnoException;
      error.code = "ESRCH";
      throw error;
    }),
    false,
  );
});

test("starts the pinned Next reference with the bounded Webpack bundler", () => {
  assert.deepEqual(referenceServerArguments(), [
    "--filter",
    "ui",
    "exec",
    "next",
    "dev",
    "--webpack",
    "--port",
    "4000",
  ]);
});

test("exposes the UI workspace package from the directory used by the CSS resolver", () => {
  const root = mkdtempSync(join(tmpdir(), "coss-sv-reference-links-"));
  const packageRoot = join(root, "packages/ui");

  try {
    mkdirSync(packageRoot, { recursive: true });
    writeFileSync(join(packageRoot, "package.json"), '{"name":"@coss/ui"}\n');

    const link = createReferenceWorkspaceCompatibilityLinks(root);

    assert.equal(realpathSync(link), realpathSync(packageRoot));
    assert.equal(link, join(root, "apps/node_modules/@coss/ui"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("overrides every package-manager and user path with an isolated temporary path", () => {
  const root = mkdtempSync(join(tmpdir(), "coss-sv-reference-env-"));

  try {
    const environment = createIsolatedChildEnvironment(root, {
      HOME: "/Users/example",
      COREPACK_HOME: "/Users/example/.cache/corepack",
      npm_config_strict_peer_dependencies: "true",
      npm_config_store_dir: "/Users/example/.pnpm-store",
      PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN: "true",
    });

    assert.doesNotThrow(() => assertIsolatedChildEnvironment(root, environment));
    for (const key of isolatedPathEnvironmentKeys) {
      assert.ok(environment[key]?.startsWith(root), `${key} must stay below the temp root`);
    }
    assert.notEqual(environment.HOME, "/Users/example");
    assert.equal(environment.npm_config_strict_peer_dependencies, undefined);
    assert.equal(environment.PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN, undefined);
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
