import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
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

export async function buildValidatedRegistry(
  registry: RegistryDefinition,
  options: BuildOptions,
): Promise<void> {
  await validateRegistry(registry, options.validation);
  await runLocalShadcn(
    ["registry", "build", options.registryPath, "-o", options.outputPath],
    options.quiet === undefined ? {} : { quiet: options.quiet },
  );
}

const registryPath = resolve(appRoot, "registry.json");

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const registry = JSON.parse(await readFile(registryPath, "utf8")) as RegistryDefinition;
  await buildValidatedRegistry(registry, {
    registryPath,
    outputPath: resolve(appRoot, "static/r"),
  });
}
