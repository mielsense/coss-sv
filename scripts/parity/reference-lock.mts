import ts from "typescript";

type BunPackageMetadata = Record<string, unknown>;
type BunPackageRecord = [string, string?, BunPackageMetadata?, string?];

export type PinnedBunLock = {
  lockfileVersion: number;
  packages: Record<string, BunPackageRecord>;
  workspaces: Record<string, Record<string, unknown>>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parsePinnedBunLock(source: string): PinnedBunLock {
  const parsed = ts.parseConfigFileTextToJson("bun.lock", source);
  if (parsed.error) {
    throw new Error(
      `Pinned bun.lock is not valid JSONC: ${ts.flattenDiagnosticMessageText(parsed.error.messageText, "\n")}`,
    );
  }
  if (
    !isRecord(parsed.config) ||
    !isRecord(parsed.config.packages) ||
    !isRecord(parsed.config.workspaces)
  ) {
    throw new Error("Pinned bun.lock must contain package and workspace maps.");
  }

  for (const [key, value] of Object.entries(parsed.config.packages)) {
    const isWorkspace = Array.isArray(value) && String(value[0]).includes("@workspace:");
    if (
      !Array.isArray(value) ||
      typeof value[0] !== "string" ||
      (!isWorkspace && !isRecord(value[2]))
    ) {
      throw new Error(`Pinned bun.lock package ${key} has an unsupported record.`);
    }
  }
  return parsed.config as PinnedBunLock;
}

function packageIdentity(specifier: string) {
  const versionSeparator = specifier.lastIndexOf("@");
  if (versionSeparator <= 0 || versionSeparator === specifier.length - 1) {
    throw new Error(`Pinned package specifier is not name@version: ${specifier}`);
  }
  return {
    name: specifier.slice(0, versionSeparator),
    version: specifier.slice(versionSeparator + 1),
  };
}

function packageIdentityFromRecord(lock: PinnedBunLock, specifier: string) {
  const workspaceSeparator = specifier.indexOf("@workspace:");
  if (workspaceSeparator > 0) {
    const workspacePath = specifier.slice(workspaceSeparator + "@workspace:".length);
    const version = lock.workspaces[workspacePath]?.version;
    if (typeof version !== "string" || version.length === 0) {
      throw new Error(`Pinned workspace package has no version: ${specifier}`);
    }
    return { name: specifier.slice(0, workspaceSeparator), version };
  }
  return packageIdentity(specifier);
}

export function createPinnedPnpmOverrides(lock: PinnedBunLock) {
  const allRecords = Object.entries(lock.packages);
  const records = allRecords.filter(([, value]) => !value[0].includes("@workspace:"));
  const keysByDescendingLength = allRecords
    .map(([key]) => key)
    .sort((left, right) => right.length - left.length);
  const identities = new Map(
    allRecords.map(([key, value]) => [key, packageIdentityFromRecord(lock, value[0])] as const),
  );
  const overrides: Record<string, string> = {};

  for (const [key] of records) {
    const parentKey = keysByDescendingLength.find(
      (candidate) => candidate !== key && key.startsWith(`${candidate}/`),
    );
    const alias = parentKey ? key.slice(parentKey.length + 1) : key;
    const identity = identities.get(key);
    if (!identity) throw new Error(`Pinned package identity is missing for ${key}.`);
    const selector = parentKey
      ? `${identities.get(parentKey)?.name}@${identities.get(parentKey)?.version}>${alias}`
      : alias;
    const value =
      alias === identity.name ? identity.version : `npm:${identity.name}@${identity.version}`;
    const existing = overrides[selector];
    if (existing && existing !== value) {
      throw new Error(`Pinned bun.lock cannot be represented by pnpm override ${selector}.`);
    }
    overrides[selector] = value;
  }

  if (Object.keys(overrides).length === 0) {
    throw new Error("Pinned bun.lock did not produce any exact pnpm overrides.");
  }
  return overrides;
}

export function convertReferencePackageToPinnedPnpmWorkspace(
  packageJson: Record<string, unknown>,
  lock: PinnedBunLock,
) {
  const { pnpm: _legacyPnpmSettings, ...packageJsonWithoutLegacyPnpmSettings } = packageJson;
  const reviewedBuildPackages = new Map<string, boolean>([
    ["core-js-pure", false],
    ["esbuild", true],
    ["msw", false],
    ["sharp", true],
  ]);
  const allowBuilds: Record<string, boolean> = {};

  for (const value of Object.values(lock.packages)) {
    if (value[0].includes("@workspace:")) continue;
    const identity = packageIdentityFromRecord(lock, value[0]);
    const decision = reviewedBuildPackages.get(identity.name);
    if (decision !== undefined) {
      allowBuilds[`${identity.name}@${identity.version}`] = decision;
    }
  }

  const reviewedBuildSelectors = Object.keys(allowBuilds).sort();
  const ignoredBuiltDependencies = Array.from(
    new Set(
      reviewedBuildSelectors
        .filter((selector) => !allowBuilds[selector])
        .map((selector) => packageIdentity(selector).name),
    ),
  ).sort();

  return {
    packageJson: packageJsonWithoutLegacyPnpmSettings,
    workspace: {
      packages: ["apps/*", "apps/examples/*", "packages/*"],
      overrides: createPinnedPnpmOverrides(lock),
      allowBuilds,
      // pnpm 10.22 compares ignored builds by package name, while the
      // allow-list supports the exact name@version selectors retained below.
      ignoredBuiltDependencies,
      onlyBuiltDependencies: reviewedBuildSelectors.filter((selector) => allowBuilds[selector]),
      strictDepBuilds: true,
    },
  };
}
