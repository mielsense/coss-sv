import { randomUUID } from "node:crypto";
import { readFile, rm, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  type RegistryDefinition,
  type ValidationOptions,
  validateRegistry,
} from "../../registry/registry.js";
import { appRoot, runLocalShadcn } from "./lib.mjs";

type BuildOptions = {
  registryPath: string;
  outputPath: string;
  validation?: ValidationOptions;
  quiet?: boolean;
};

export async function buildValidatedRegistry(options: BuildOptions): Promise<void> {
  const registryBytes = await readFile(options.registryPath, "utf8");
  let registry: RegistryDefinition;
  try {
    registry = JSON.parse(registryBytes) as RegistryDefinition;
  } catch (error) {
    throw new Error(`Could not parse registry JSON at ${options.registryPath}`, { cause: error });
  }
  await validateRegistry(registry, options.validation);

  const snapshotPath = resolve(
    dirname(options.registryPath),
    `.${basename(options.registryPath)}.validated-${randomUUID()}.json`,
  );
  await writeFile(snapshotPath, registryBytes, { encoding: "utf8", flag: "wx", mode: 0o400 });
  try {
    await runLocalShadcn(
      ["registry", "build", snapshotPath, "-o", options.outputPath],
      options.quiet === undefined ? {} : { quiet: options.quiet },
    );
  } finally {
    await rm(snapshotPath, { force: true });
  }
}

const registryPath = resolve(appRoot, "registry.json");

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await buildValidatedRegistry({
    registryPath,
    outputPath: resolve(appRoot, "static/r"),
  });
}
