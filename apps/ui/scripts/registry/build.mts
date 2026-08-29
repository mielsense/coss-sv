import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  type RegistryDefinition,
  type ValidatedRegistry,
  type ValidationOptions,
  validateRegistry,
} from "../../registry/registry.js";
import { appRoot, runLocalShadcn } from "./lib.mjs";
import { createUiExportMap, transformParticleSource } from "./particle-source.mjs";

type BuildOptions = {
  registryPath: string;
  outputPath: string;
  projectPath?: string;
  validation?: ValidationOptions;
  env?: NodeJS.ProcessEnv;
  quiet?: boolean;
};

export type StagedRegistry = {
  root: string;
  registryPath: string;
  sourcePaths: string[];
};

export async function withStagedRegistry<Result>(
  validated: ValidatedRegistry,
  registryDirectory: string,
  callback: (staged: StagedRegistry) => Promise<Result>,
): Promise<Result> {
  const root = await mkdtemp(join(registryDirectory, ".registry-build-"));
  try {
    const uiExports = createUiExportMap(
      await readFile(resolve(appRoot, "../../packages/ui/src/index.ts"), "utf8"),
    );
    const sourceRoot = resolve(root, "sources");
    await mkdir(sourceRoot, { mode: 0o700 });
    const manifest = structuredClone(validated.manifest);
    const sourcePaths: string[] = [];
    const stagedSources = new Set<string>();

    for (const source of validated.sources) {
      const file = manifest.items[source.itemIndex]?.files[source.fileIndex];
      if (!file) throw new Error("Validated registry source no longer matches its manifest");
      const sourceKey = `${source.itemIndex}:${source.fileIndex}`;
      if (stagedSources.has(sourceKey)) {
        throw new Error("Validated registry contains a duplicate captured source");
      }
      const stagedDirectory = resolve(
        sourceRoot,
        String(source.itemIndex),
        String(source.fileIndex),
      );
      await mkdir(stagedDirectory, { recursive: true, mode: 0o700 });
      const stagedPath = resolve(stagedDirectory, basename(file.path));
      const item = manifest.items[source.itemIndex];
      const bytes =
        item?.type === "registry:block" && basename(file.path).startsWith("p-")
          ? transformParticleSource(Buffer.from(source.bytes).toString("utf8"), uiExports)
          : source.bytes;
      await writeFile(stagedPath, bytes, { flag: "wx", mode: 0o400 });
      file.path = stagedPath;
      sourcePaths.push(stagedPath);
      stagedSources.add(sourceKey);
    }

    for (const [itemIndex, item] of manifest.items.entries()) {
      for (const fileIndex of item.files.keys()) {
        if (!stagedSources.has(`${itemIndex}:${fileIndex}`)) {
          throw new Error("Validated registry manifest contains an unstaged source file");
        }
      }
    }

    const registryPath = resolve(root, "registry.json");
    await writeFile(registryPath, `${JSON.stringify(manifest, null, 2)}\n`, {
      encoding: "utf8",
      flag: "wx",
      mode: 0o400,
    });
    return await callback({ root, registryPath, sourcePaths });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

export async function buildValidatedRegistry(options: BuildOptions): Promise<void> {
  const registryBytes = await readFile(options.registryPath, "utf8");
  let registry: RegistryDefinition;
  try {
    registry = JSON.parse(registryBytes) as RegistryDefinition;
  } catch (error) {
    throw new Error(`Could not parse registry JSON at ${options.registryPath}`, { cause: error });
  }
  const validated = await validateRegistry(registry, options.validation);

  await withStagedRegistry(validated, dirname(options.registryPath), async (staged) => {
    const arguments_ = ["registry", "build", staged.registryPath];
    if (options.projectPath) arguments_.push("-c", options.projectPath);
    arguments_.push("-o", options.outputPath);
    const runOptions: { env?: NodeJS.ProcessEnv; quiet?: boolean } = {};
    if (options.env !== undefined) runOptions.env = options.env;
    if (options.quiet !== undefined) runOptions.quiet = options.quiet;
    await runLocalShadcn(arguments_, runOptions);
  });
}

const registryPath = resolve(appRoot, "registry.json");

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await buildValidatedRegistry({
    registryPath,
    outputPath: resolve(appRoot, "static/r"),
  });
}
