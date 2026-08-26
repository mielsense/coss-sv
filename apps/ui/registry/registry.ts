import { readFile, realpath } from "node:fs/promises";
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
  projectRoot?: string;
};

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const defaultSourceRoots = [
  resolve(appRoot, "../../packages/ui/src"),
  resolve(appRoot, "registry/default/particles"),
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

export async function validateRegistry(
  registry: RegistryDefinition,
  options: ValidationOptions = {},
): Promise<void> {
  const projectRoot = resolve(options.projectRoot ?? appRoot);
  const sourceRoots = await Promise.all(
    (options.allowedSourceRoots ?? defaultSourceRoots).map(async (root) => {
      const absoluteRoot = resolve(projectRoot, root);
      try {
        return await realpath(absoluteRoot);
      } catch {
        return absoluteRoot;
      }
    }),
  );
  const installRoots = options.allowedInstallRoots ?? defaultInstallRoots;
  const itemNames = new Set<string>();

  validateDependencies("Registry overrideDependencies", registry.overrideDependencies ?? []);

  for (const item of registry.items) {
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

    for (const file of item.files) {
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

      const absolutePath = resolve(projectRoot, file.path);
      let canonicalPath: string;
      try {
        canonicalPath = await realpath(absolutePath);
      } catch {
        throw new Error(`Registry item ${item.name} points to a missing source file: ${file.path}`);
      }
      if (!sourceRoots.some((root) => isWithin(root, canonicalPath))) {
        throw new Error(
          `Registry item ${item.name} source is outside the allowed source roots: ${file.path}`,
        );
      }

      const content = await readFile(canonicalPath, "utf8");
      validateSourceImports(item.name, file.path, content);
    }
  }

  for (const item of registry.items) {
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
