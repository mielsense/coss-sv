import {
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { delimiter, dirname, isAbsolute, relative, resolve } from "node:path";

export const isolatedPathEnvironmentKeys = [
  "HOME",
  "USERPROFILE",
  "COREPACK_HOME",
  "PNPM_HOME",
  "XDG_CACHE_HOME",
  "XDG_CONFIG_HOME",
  "XDG_DATA_HOME",
  "XDG_STATE_HOME",
  "npm_config_cache",
  "NPM_CONFIG_CACHE",
  "npm_config_userconfig",
  "NPM_CONFIG_USERCONFIG",
  "npm_config_globalconfig",
  "NPM_CONFIG_GLOBALCONFIG",
  "npm_config_store_dir",
  "PNPM_CONFIG_STORE_DIR",
  "TMPDIR",
] as const;

export function referenceServerArguments(): string[] {
  return ["--filter", "ui", "exec", "next", "dev", "--webpack", "--port", "4000"];
}

export function parentProcessExists(
  pid: number,
  probe: (pid: number, signal: 0) => unknown = process.kill,
): boolean {
  try {
    probe(pid, 0);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ESRCH") return false;
    throw error;
  }
}

function assertBelowRoot(root: string, value: string, key: string) {
  const normalizedRoot = resolve(root);
  const normalizedValue = resolve(value);
  const pathFromRoot = relative(normalizedRoot, normalizedValue);
  if (!isAbsolute(normalizedValue) || pathFromRoot.startsWith("..") || isAbsolute(pathFromRoot)) {
    throw new Error(`${key} escapes the temporary reference root: ${value}`);
  }
}

export function createReferenceWorkspaceCompatibilityLinks(root: string) {
  const packageRoot = resolve(root, "packages/ui");
  const packageManifest = JSON.parse(
    readFileSync(resolve(packageRoot, "package.json"), "utf8"),
  ) as {
    name?: unknown;
  };
  if (packageManifest.name !== "@coss/ui") {
    throw new Error("Pinned reference packages/ui must be the @coss/ui workspace package.");
  }

  const link = resolve(root, "apps/node_modules/@coss/ui");
  assertBelowRoot(root, packageRoot, "@coss/ui workspace package");
  assertBelowRoot(root, link, "@coss/ui compatibility link");
  if (existsSync(link)) {
    throw new Error(`Refusing to replace an existing compatibility link: ${link}`);
  }

  mkdirSync(dirname(link), { recursive: true });
  symlinkSync(relative(dirname(link), packageRoot), link, "dir");
  if (realpathSync(link) !== realpathSync(packageRoot)) {
    throw new Error("The @coss/ui compatibility link did not resolve to packages/ui.");
  }
  return link;
}

export function assertIsolatedChildEnvironment(
  root: string,
  environment: Readonly<NodeJS.ProcessEnv>,
) {
  for (const key of isolatedPathEnvironmentKeys) {
    const value = environment[key];
    if (!value) throw new Error(`${key} is not configured for the temporary reference process.`);
    assertBelowRoot(root, value, key);
  }
}

export function assertEffectivePackageManagerPath(root: string, value: string, label: string) {
  assertBelowRoot(root, value.trim(), label);
}

export function createIsolatedChildEnvironment(
  root: string,
  baseEnvironment: Readonly<NodeJS.ProcessEnv> = process.env,
): NodeJS.ProcessEnv {
  const inheritedEnvironment = { ...baseEnvironment };
  for (const key of Object.keys(inheritedEnvironment)) {
    const normalizedKey = key.toLowerCase();
    if (normalizedKey.startsWith("npm_config_") || normalizedKey.startsWith("pnpm_config_")) {
      delete inheritedEnvironment[key];
    }
  }
  const paths = {
    HOME: resolve(root, "home"),
    USERPROFILE: resolve(root, "home"),
    COREPACK_HOME: resolve(root, "corepack"),
    PNPM_HOME: resolve(root, "pnpm/home"),
    XDG_CACHE_HOME: resolve(root, "xdg/cache"),
    XDG_CONFIG_HOME: resolve(root, "xdg/config"),
    XDG_DATA_HOME: resolve(root, "xdg/data"),
    XDG_STATE_HOME: resolve(root, "xdg/state"),
    npm_config_cache: resolve(root, "npm/cache"),
    NPM_CONFIG_CACHE: resolve(root, "npm/cache"),
    npm_config_userconfig: resolve(root, "npm/user-npmrc"),
    NPM_CONFIG_USERCONFIG: resolve(root, "npm/user-npmrc"),
    npm_config_globalconfig: resolve(root, "npm/global-npmrc"),
    NPM_CONFIG_GLOBALCONFIG: resolve(root, "npm/global-npmrc"),
    npm_config_store_dir: resolve(root, "pnpm/store"),
    PNPM_CONFIG_STORE_DIR: resolve(root, "pnpm/store"),
    TMPDIR: resolve(root, "tmp"),
  } satisfies Record<(typeof isolatedPathEnvironmentKeys)[number], string>;

  for (const value of Object.values(paths)) mkdirSync(dirname(value), { recursive: true });
  for (const key of ["HOME", "COREPACK_HOME", "PNPM_HOME", "TMPDIR"] as const) {
    mkdirSync(paths[key], { recursive: true });
  }
  writeFileSync(paths.npm_config_userconfig, `store-dir=${paths.npm_config_store_dir}\n`);
  writeFileSync(paths.npm_config_globalconfig, "");

  const environment: NodeJS.ProcessEnv = {
    ...inheritedEnvironment,
    ...paths,
    HUSKY: "0",
    NEXT_TELEMETRY_DISABLED: "1",
    PATH: [dirname(process.execPath), inheritedEnvironment.PATH].filter(Boolean).join(delimiter),
  };
  assertIsolatedChildEnvironment(root, environment);
  return environment;
}
