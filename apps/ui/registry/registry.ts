import { type BigIntStats, constants } from "node:fs";
import { type FileHandle, lstat, open, readFile, realpath } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const registryFileTypes = [
  "registry:lib",
  "registry:block",
  "registry:component",
  "registry:ui",
  "registry:hook",
  "registry:page",
  "registry:file",
  "registry:theme",
  "registry:style",
  "registry:item",
  "registry:base",
  "registry:font",
] as const;

export const registryTypes = [
  ...registryFileTypes,
  "registry:example",
  "registry:internal",
] as const;

export type RegistryType = (typeof registryTypes)[number];
export type RegistryFileType = (typeof registryFileTypes)[number];

export type RegistryFile = {
  path: string;
  type: RegistryFileType;
  target?: string;
};

export type RegistryCssVariables = {
  theme?: Record<string, string>;
  light?: Record<string, string>;
  dark?: Record<string, string>;
};

export type RegistryItem = {
  name: string;
  title?: string;
  description?: string;
  type: RegistryType;
  author?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies: string[];
  files: RegistryFile[];
  cssVars?: RegistryCssVariables;
  docs?: string;
  categories?: string[];
  meta?: Record<string, unknown>;
};

export type RegistryAliases = {
  lib?: string;
  ui?: string;
  components?: string;
  utils?: string;
  hooks?: string;
};

export type RegistryDefinition = {
  $schema?: string;
  name: string;
  homepage: string;
  aliases?: RegistryAliases;
  overrideDependencies?: string[];
  items: RegistryItem[];
};

export type ValidationOptions = {
  allowedSourceRoots?: string[];
  allowedInstallRoots?: string[];
};

export type CapturedRegistrySource = {
  itemIndex: number;
  fileIndex: number;
  bytes: Uint8Array;
};

export type ValidatedRegistry = {
  manifest: RegistryDefinition;
  sources: CapturedRegistrySource[];
};

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const logicalTrustRoot = resolve(appRoot, "../..");
const defaultSourceRoots = [
  resolve(appRoot, "../../packages/ui/src"),
  resolve(appRoot, "registry/default/lib"),
  resolve(appRoot, "registry/default/particles"),
  resolve(appRoot, "src/lib/registry"),
];
const defaultInstallRoots = ["src/lib/components", "src/lib/hooks", "src/lib"];
const forbiddenPackages = new Set(["react", "react-dom", "react-is"]);
const forbiddenPathPattern = /(^|[\\/])(reference|shardsui)([\\/]|$)/i;
const importPattern = /(?:from\s*|import\s*(?:\(\s*)?|require\(\s*)["']([^"']+)["']/g;

export function defineRegistryItems<const Items extends readonly RegistryItem[]>(
  items: Items,
): Items {
  return items;
}

export function createRegistry(items: readonly RegistryItem[]): RegistryDefinition {
  return {
    $schema: "https://shadcn-svelte.com/schema/registry.json",
    name: "coss-sv",
    homepage: "https://coss-sv.vercel.app",
    aliases: {
      lib: "$lib",
      ui: "$lib/components/ui",
      components: "$lib/components",
      utils: "$lib/utils",
      hooks: "$lib/hooks",
    },
    items: [...items].sort((left, right) => left.name.localeCompare(right.name)),
  };
}

export function serializeRegistry(registry: RegistryDefinition): string {
  return `${JSON.stringify(registry, null, 2)}\n`;
}

function isRegistryType(value: string): value is RegistryType {
  return (registryTypes as readonly string[]).includes(value);
}

function isRegistryFileType(value: string): value is RegistryFileType {
  return (registryFileTypes as readonly string[]).includes(value);
}

function isWithin(root: string, candidate: string): boolean {
  const pathFromRoot = relative(root, candidate);
  return (
    pathFromRoot === "" ||
    (!pathFromRoot.startsWith(`..${sep}`) && pathFromRoot !== ".." && !isAbsolute(pathFromRoot))
  );
}

function containsForbiddenTrustSegment(trustRoot: string, candidate: string): boolean {
  const segments = relative(trustRoot, candidate).split(sep);
  return segments.some(
    (segment) =>
      segment.toLowerCase() === "reference" ||
      segment.toLowerCase() === "shardsui" ||
      segment === ".worktrees",
  );
}

async function canonicalTrustRoot(): Promise<string> {
  const trustRootStats = await lstat(logicalTrustRoot, { bigint: true });
  if (trustRootStats.isSymbolicLink() || !trustRootStats.isDirectory()) {
    throw new Error(`Current project trust root must be a real directory: ${logicalTrustRoot}`);
  }
  return await realpath(logicalTrustRoot);
}

async function canonicalAllowedSourceRoot(
  configuredRoot: string,
  trustRoot: string,
): Promise<string> {
  const logicalRoot = resolve(appRoot, configuredRoot);
  if (!isWithin(logicalTrustRoot, logicalRoot)) {
    throw new Error(
      `Allowed source root is outside the current project trust root: ${configuredRoot}`,
    );
  }

  const pathFromTrustRoot = relative(logicalTrustRoot, logicalRoot);
  let currentPath = logicalTrustRoot;
  for (const segment of pathFromTrustRoot.split(sep).filter(Boolean)) {
    currentPath = resolve(currentPath, segment);
    let stats: BigIntStats;
    try {
      stats = await lstat(currentPath, { bigint: true });
    } catch {
      throw new Error(`Allowed source root path is missing: ${configuredRoot}`);
    }
    if (stats.isSymbolicLink() || !stats.isDirectory()) {
      throw new Error(
        `Allowed source root must be a real non-symlink directory: ${configuredRoot}`,
      );
    }
  }

  const canonicalRoot = await realpath(logicalRoot);
  if (
    !isWithin(trustRoot, canonicalRoot) ||
    containsForbiddenTrustSegment(trustRoot, canonicalRoot)
  ) {
    throw new Error(
      `Allowed source root is outside the current project trust boundary: ${configuredRoot}`,
    );
  }
  return canonicalRoot;
}

function packageName(specifier: string): string {
  const trimmed = specifier.trim().toLowerCase();
  const aliasSeparator = trimmed.indexOf("@npm:");
  const packageSpecifier =
    aliasSeparator === -1
      ? trimmed.startsWith("npm:")
        ? trimmed.slice("npm:".length)
        : trimmed
      : trimmed.slice(aliasSeparator + "@npm:".length);

  if (packageSpecifier.startsWith("@")) {
    const separator = packageSpecifier.indexOf("@", packageSpecifier.indexOf("/") + 1);
    return separator === -1 ? packageSpecifier : packageSpecifier.slice(0, separator);
  }

  const separator = packageSpecifier.indexOf("@");
  return separator === -1 ? packageSpecifier : packageSpecifier.slice(0, separator);
}

function isForbiddenDependency(specifier: string): boolean {
  const name = packageName(specifier);
  return (
    forbiddenPackages.has(name) ||
    name.startsWith("@base-ui/") ||
    name.startsWith("@base-ui-components/")
  );
}

function validateDependencies(owner: string, dependencies: readonly string[]): void {
  for (const dependency of dependencies) {
    if (isForbiddenDependency(dependency)) {
      throw new Error(`${owner} has a forbidden dependency: ${dependency}`);
    }
  }
}

function validateItemName(name: string): void {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    throw new Error(`Registry item name must be a safe lowercase slug: ${name}`);
  }
}

function validateTarget(itemName: string, target: string, allowedInstallRoots: string[]): void {
  const normalized = target.replaceAll("\\", "/").replace(/^\.\//, "");
  if (isAbsolute(target) || normalized.startsWith("~/") || normalized.split("/").includes("..")) {
    throw new Error(
      `Registry item ${itemName} has a target outside the configured install roots: ${target}`,
    );
  }

  const isAllowed = allowedInstallRoots.some(
    (root) => normalized === root || normalized.startsWith(`${root}/`),
  );
  if (!isAllowed) {
    throw new Error(
      `Registry item ${itemName} has a target outside the configured install roots: ${target}`,
    );
  }
}

function validateSourceImports(itemName: string, sourcePath: string, content: string): void {
  importPattern.lastIndex = 0;
  for (const match of content.matchAll(importPattern)) {
    const specifier = match[1];
    if (!specifier) continue;
    if (isForbiddenDependency(specifier) || forbiddenPathPattern.test(specifier)) {
      throw new Error(
        `Registry item ${itemName} has a forbidden source import in ${sourcePath}: ${specifier}`,
      );
    }
  }
}

function sameFileIdentity(
  left: { dev: bigint; ino: bigint },
  right: { dev: bigint; ino: bigint },
): boolean {
  return left.dev === right.dev && left.ino === right.ino;
}

async function captureSourceFile(
  itemName: string,
  sourcePath: string,
  absolutePath: string,
  sourceRoots: string[],
  trustRoot: string,
): Promise<Uint8Array> {
  let pathBefore: BigIntStats;
  try {
    pathBefore = await lstat(absolutePath, { bigint: true });
  } catch {
    throw new Error(`Registry item ${itemName} points to a missing source file: ${sourcePath}`);
  }
  if (pathBefore.isSymbolicLink()) {
    throw new Error(`Registry item ${itemName} source must not be a symbolic link: ${sourcePath}`);
  }
  if (!pathBefore.isFile()) {
    throw new Error(`Registry item ${itemName} source must be a regular file: ${sourcePath}`);
  }
  if (pathBefore.nlink !== 1n) {
    throw new Error(
      `Registry item ${itemName} source must have exactly one hard link: ${sourcePath}`,
    );
  }

  let handle: FileHandle;
  try {
    handle = await open(absolutePath, constants.O_RDONLY | constants.O_NOFOLLOW);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ELOOP") {
      throw new Error(
        `Registry item ${itemName} source must not be a symbolic link: ${sourcePath}`,
      );
    }
    throw new Error(`Registry item ${itemName} could not open source file: ${sourcePath}`, {
      cause: error,
    });
  }

  try {
    const openedBefore = await handle.stat({ bigint: true });
    if (!openedBefore.isFile()) {
      throw new Error(`Registry item ${itemName} source must be a regular file: ${sourcePath}`);
    }
    if (!sameFileIdentity(pathBefore, openedBefore)) {
      throw new Error(
        `Registry item ${itemName} source changed while it was being validated: ${sourcePath}`,
      );
    }

    const canonicalPath = await realpath(absolutePath);
    if (
      !sourceRoots.some((root) => isWithin(root, canonicalPath)) ||
      containsForbiddenTrustSegment(trustRoot, canonicalPath)
    ) {
      throw new Error(
        `Registry item ${itemName} source is outside the allowed source roots: ${sourcePath}`,
      );
    }

    const bytes = await handle.readFile();
    const openedAfter = await handle.stat({ bigint: true });
    const pathAfter = await lstat(absolutePath, { bigint: true });
    const canonicalPathAfter = await realpath(absolutePath);
    if (
      pathAfter.isSymbolicLink() ||
      !pathAfter.isFile() ||
      !sameFileIdentity(openedBefore, openedAfter) ||
      !sameFileIdentity(openedAfter, pathAfter) ||
      openedBefore.nlink !== 1n ||
      openedAfter.nlink !== 1n ||
      pathAfter.nlink !== 1n ||
      openedBefore.size !== openedAfter.size ||
      openedBefore.mtimeNs !== openedAfter.mtimeNs ||
      openedBefore.ctimeNs !== openedAfter.ctimeNs ||
      !sourceRoots.some((root) => isWithin(root, canonicalPathAfter)) ||
      containsForbiddenTrustSegment(trustRoot, canonicalPathAfter)
    ) {
      throw new Error(
        `Registry item ${itemName} source changed while it was being validated: ${sourcePath}`,
      );
    }
    return Uint8Array.from(bytes);
  } finally {
    await handle.close();
  }
}

function validateLocalDependencyCycles(items: readonly RegistryItem[]): void {
  const itemsByName = new Map(items.map((item) => [item.name, item]));
  const state = new Map<string, "visiting" | "visited">();
  const path: string[] = [];

  function visit(name: string): void {
    const currentState = state.get(name);
    if (currentState === "visited") return;
    if (currentState === "visiting") {
      const cycleStart = path.indexOf(name);
      const cycle = [...path.slice(cycleStart), name];
      throw new Error(`Local registry dependency cycle: ${cycle.join(" -> ")}`);
    }

    state.set(name, "visiting");
    path.push(name);
    const item = itemsByName.get(name);
    if (item) {
      for (const dependency of item.registryDependencies) {
        if (dependency.startsWith("local:")) visit(dependency.slice("local:".length));
      }
    }
    path.pop();
    state.set(name, "visited");
  }

  for (const item of items) visit(item.name);
}

export async function validateRegistry(
  registry: RegistryDefinition,
  options: ValidationOptions = {},
): Promise<ValidatedRegistry> {
  const manifest = structuredClone(registry);
  const trustRoot = await canonicalTrustRoot();
  const sourceRoots = await Promise.all(
    (options.allowedSourceRoots ?? defaultSourceRoots).map((root) =>
      canonicalAllowedSourceRoot(root, trustRoot),
    ),
  );
  const installRoots = options.allowedInstallRoots ?? defaultInstallRoots;
  const itemNames = new Set<string>();
  const sources: CapturedRegistrySource[] = [];

  validateDependencies("Registry overrideDependencies", manifest.overrideDependencies ?? []);

  for (const [itemIndex, item] of manifest.items.entries()) {
    if (!isRegistryType(item.type)) {
      throw new Error(
        `Registry item ${item.name} has an unsupported registry type: ${String(item.type)}`,
      );
    }
    validateItemName(item.name);
    if (itemNames.has(item.name))
      throw new Error(`Registry item names must be unique: ${item.name}`);
    itemNames.add(item.name);

    validateDependencies(`Registry item ${item.name}`, [
      ...(item.dependencies ?? []),
      ...(item.devDependencies ?? []),
    ]);
    validateDependencies(
      `Registry item ${item.name} registryDependencies`,
      item.registryDependencies.filter((dependency) => !dependency.startsWith("local:")),
    );

    for (const [fileIndex, file] of item.files.entries()) {
      if (!isRegistryFileType(file.type)) {
        throw new Error(
          `Registry item ${item.name} has an unsupported registry file type: ${String(file.type)}`,
        );
      }
      if (forbiddenPathPattern.test(file.path)) {
        throw new Error(
          `Registry item ${item.name} has a forbidden local reference path: ${file.path}`,
        );
      }
      if (file.target) validateTarget(item.name, file.target, installRoots);

      const absolutePath = resolve(appRoot, file.path);
      const bytes = await captureSourceFile(
        item.name,
        file.path,
        absolutePath,
        sourceRoots,
        trustRoot,
      );
      validateSourceImports(
        item.name,
        file.path,
        new TextDecoder("utf-8", { fatal: true }).decode(bytes),
      );
      sources.push({ itemIndex, fileIndex, bytes });
    }
  }

  for (const item of manifest.items) {
    for (const dependency of item.registryDependencies) {
      if (!dependency.startsWith("local:")) continue;
      const dependencyName = dependency.slice("local:".length);
      if (!itemNames.has(dependencyName)) {
        throw new Error(
          `Registry item ${item.name} has a missing local registry dependency: ${dependencyName}`,
        );
      }
    }
  }

  validateLocalDependencyCycles(manifest.items);
  return { manifest, sources };
}

export async function assertGeneratedFileCurrent(path: string, expected: string): Promise<void> {
  let actual: string;
  try {
    actual = await readFile(path, "utf8");
  } catch {
    throw new Error(`Missing generated registry file: ${path}`);
  }

  if (actual !== expected) {
    throw new Error(`Found a stale generated registry file: ${path}`);
  }
}
