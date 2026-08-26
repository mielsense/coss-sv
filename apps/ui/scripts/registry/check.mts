import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { assertGeneratedFileCurrent } from "../../registry/registry.js";
import { buildValidatedRegistry } from "./build.mjs";
import { registrySource } from "./generate.mjs";
import { appRoot, listFiles, normalizedJson, runLocalShadcn } from "./lib.mjs";

const expectedCliVersion = "1.5.0";
const registryPath = resolve(appRoot, "registry.json");
const committedOutput = resolve(appRoot, "static/r");
const temporaryRoot = await mkdtemp(join(tmpdir(), "coss-sv-registry-check-"));
const temporaryOutput = resolve(temporaryRoot, "r");

try {
  const version = await runLocalShadcn(["--version"], { quiet: true });
  if (version !== expectedCliVersion) {
    throw new Error(
      `Expected shadcn-svelte ${expectedCliVersion}, found ${version || "no version"}`,
    );
  }

  await assertGeneratedFileCurrent(registryPath, await registrySource());
  await buildValidatedRegistry({ registryPath, outputPath: temporaryOutput, quiet: true });

  const expectedFiles = await listFiles(temporaryOutput);
  const actualFiles = await listFiles(committedOutput);
  if (JSON.stringify(actualFiles) !== JSON.stringify(expectedFiles)) {
    throw new Error(
      `Generated registry files are stale. Expected [${expectedFiles.join(", ")}], found [${actualFiles.join(", ")}].`,
    );
  }

  for (const file of expectedFiles) {
    const expectedPath = resolve(temporaryOutput, file);
    const actualPath = resolve(committedOutput, file);
    if ((await normalizedJson(actualPath)) !== (await normalizedJson(expectedPath))) {
      throw new Error(`Generated registry file is stale: static/r/${file}`);
    }

    const raw = (await readFile(actualPath, "utf8")).toLowerCase();
    if (/([\\/]reference[\\/]|[\\/]shardsui[\\/]|@base-ui|from ["']react["'])/.test(raw)) {
      throw new Error(
        `Generated registry file contains a forbidden source or dependency: static/r/${file}`,
      );
    }
  }

  console.log(
    `Registry schema, security, and freshness checks passed for ${actualFiles.length} file(s).`,
  );
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
