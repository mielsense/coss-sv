import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

export type ParityKind = "component" | "doc" | "particle";
export type ParityStatus = "missing" | "implemented" | "reviewed" | "approved";

export type ParityEntry = {
  id: string;
  kind: ParityKind;
  sourcePaths: string[];
  targetPaths: string[];
  status: ParityStatus;
};

export type StatusBaseline = {
  version: 1;
  entries: Array<Pick<ParityEntry, "id" | "kind" | "status">>;
};

export type ReferenceInventory = {
  counts: {
    components: number;
    docs: number;
    particles: number;
  };
  entries: ParityEntry[];
  particleComponents: Record<string, string[]>;
};

export type TargetManifestDefinition = {
  exportName: string;
  idProperty: "id" | "name";
  kind: ParityKind;
  path: string;
  wrapperName: string;
};

export type TargetManifestSnapshot = TargetManifestDefinition & {
  duplicates: string[];
  exists: boolean;
  ids: string[];
};

export type TargetManifests = Record<ParityKind, TargetManifestSnapshot>;

export type TargetManifestComparison = Record<
  ParityKind,
  { duplicates: string[]; extra: string[]; missing: string[] }
>;

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../..");
const matrixPath = join(repositoryRoot, "docs/porting/PARITY-MATRIX.md");
const baselinePath = join(scriptDirectory, "status-baseline.json");
const artifactPath = join(repositoryRoot, "artifacts/parity/reference-inventory.json");
const startMarker = "<!-- parity:start -->";
const endMarker = "<!-- parity:end -->";
const statusOrder: ParityStatus[] = ["missing", "implemented", "reviewed", "approved"];

export const targetManifestDefinitions = [
  {
    exportName: "registryUi",
    idProperty: "name",
    kind: "component",
    path: "apps/ui/registry/registry-ui.ts",
    wrapperName: "defineRegistryItems",
  },
  {
    exportName: "registryParticles",
    idProperty: "name",
    kind: "particle",
    path: "apps/ui/registry/registry-particles.ts",
    wrapperName: "defineRegistryItems",
  },
  {
    // D1 owns this completeness manifest. Homepage categories are navigation metadata, not parity evidence.
    exportName: "docsManifest",
    idProperty: "id",
    kind: "doc",
    path: "apps/ui/src/lib/content/docs-manifest.ts",
    wrapperName: "defineDocsManifest",
  },
] as const satisfies readonly TargetManifestDefinition[];

function filesWithExtension(directory: string, extension: string) {
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && extname(entry.name) === extension)
    .map((entry) => join(directory, entry.name))
    .sort((left, right) => left.localeCompare(right));
}

function withoutExtension(path: string) {
  return basename(path, extname(path));
}

function normalizedPath(path: string) {
  return path.replaceAll("\\", "/");
}

function parityKey({ id, kind }: Pick<ParityEntry, "id" | "kind">) {
  return `${kind}:${id}`;
}

function findReferenceDirectory(root: string) {
  // biome-ignore lint/suspicious/noUndeclaredEnvVars: worktrees and CI may keep the pinned reference elsewhere.
  const configured = process.env.COSS_REFERENCE_ROOT?.trim();
  const candidates = [configured, join(root, "reference")].filter(
    (candidate): candidate is string => Boolean(candidate),
  );

  const dotGit = join(root, ".git");
  if (existsSync(dotGit) && statSync(dotGit).isFile()) {
    const gitDirectoryMatch = /^gitdir:\s*(.+)$/m.exec(readFileSync(dotGit, "utf8"));
    if (gitDirectoryMatch?.[1]) {
      const gitDirectory = resolve(root, gitDirectoryMatch[1].trim());
      const commonDirectoryFile = join(gitDirectory, "commondir");
      if (existsSync(commonDirectoryFile)) {
        const commonGitDirectory = resolve(
          gitDirectory,
          readFileSync(commonDirectoryFile, "utf8").trim(),
        );
        candidates.push(join(dirname(commonGitDirectory), "reference"));
      }
    }
  }

  for (const candidate of candidates) {
    if (existsSync(join(candidate, "apps/ui/registry/default/ui"))) return resolve(candidate);
  }

  throw new Error(
    "Pinned COSS reference not found. Set COSS_REFERENCE_ROOT to its read-only reference directory.",
  );
}

function sourcePath(referenceDirectory: string, absolutePath: string) {
  return normalizedPath(join("reference", relative(referenceDirectory, absolutePath)));
}

function targetPath(root: string, absolutePath: string) {
  return normalizedPath(relative(root, absolutePath));
}

function entry(
  root: string,
  referenceDirectory: string,
  kind: ParityKind,
  id: string,
  source: string,
  target: string,
  manifest: string,
): ParityEntry {
  return {
    id,
    kind,
    sourcePaths: [sourcePath(referenceDirectory, source)],
    targetPaths: [targetPath(root, target), manifest],
    status: "missing",
  };
}

function particleComponentImports(path: string) {
  const source = readFileSync(path, "utf8");
  const components = new Set<string>();
  const importPattern = /(?:from\s*|import\s*)["']@\/registry\/default\/ui\/([^"']+)["']/g;

  for (const match of source.matchAll(importPattern)) {
    if (match[1]) components.add(withoutExtension(match[1]));
  }

  if (source.includes('from "@/registry/default/lib/segmented-control"')) {
    components.add("segmented-control");
  }

  return [...components].sort((left, right) => left.localeCompare(right));
}

export function collectReferenceInventory(root = repositoryRoot): ReferenceInventory {
  const referenceDirectory = findReferenceDirectory(root);
  const referenceDocs = join(referenceDirectory, "apps/ui/content/docs");
  const referenceUi = join(referenceDirectory, "apps/ui/registry/default/ui");
  const referenceParticles = join(referenceDirectory, "apps/ui/registry/default/particles");

  const components = filesWithExtension(referenceUi, ".tsx").map((source) => {
    const id = withoutExtension(source);
    return entry(
      root,
      referenceDirectory,
      "component",
      id,
      source,
      join(root, `packages/ui/src/components/ui/${id}`),
      "apps/ui/registry/registry-ui.ts",
    );
  });

  const componentDocs = filesWithExtension(join(referenceDocs, "components"), ".mdx").map(
    (source) => {
      const id = withoutExtension(source);
      return entry(
        root,
        referenceDirectory,
        "doc",
        `components/${id}`,
        source,
        join(root, `apps/ui/content/docs/components/${id}.md`),
        "apps/ui/src/lib/content/docs-manifest.ts",
      );
    },
  );

  const rootDocs = filesWithExtension(join(referenceDocs, "(root)"), ".mdx").map((source) => {
    const id = withoutExtension(source);
    return entry(
      root,
      referenceDirectory,
      "doc",
      id,
      source,
      join(root, `apps/ui/content/docs/${id}.md`),
      "apps/ui/src/lib/content/docs-manifest.ts",
    );
  });

  const hookDocs = filesWithExtension(join(referenceDocs, "hooks"), ".mdx").map((source) => {
    const id = withoutExtension(source);
    return entry(
      root,
      referenceDirectory,
      "doc",
      `hooks/${id}`,
      source,
      join(root, `apps/ui/content/docs/hooks/${id}.md`),
      "apps/ui/src/lib/content/docs-manifest.ts",
    );
  });

  const particleComponents: Record<string, string[]> = {};
  const particles = filesWithExtension(referenceParticles, ".tsx").map((source) => {
    const id = withoutExtension(source);
    particleComponents[id] = particleComponentImports(source);
    return entry(
      root,
      referenceDirectory,
      "particle",
      id,
      source,
      join(root, `apps/ui/registry/default/particles/${id}.svelte`),
      "apps/ui/registry/registry-particles.ts",
    );
  });

  return {
    counts: {
      components: components.length,
      docs: componentDocs.length + rootDocs.length + hookDocs.length,
      particles: particles.length,
    },
    entries: [...components, ...componentDocs, ...rootDocs, ...hookDocs, ...particles],
    particleComponents,
  };
}

export function loadStatusBaseline(path = baselinePath): StatusBaseline {
  const parsed = JSON.parse(readFileSync(path, "utf8")) as StatusBaseline;
  if (parsed.version !== 1 || !Array.isArray(parsed.entries)) {
    throw new Error("Parity status baseline must use schema version 1 with an entries array.");
  }
  return parsed;
}

export function validateStatusBaseline(entries: ParityEntry[], baseline: StatusBaseline) {
  const expectedKeys = new Set(entries.map(parityKey));
  const baselineKeys = baseline.entries.map(parityKey);
  const actualKeys = new Set(baselineKeys);

  if (actualKeys.size !== baselineKeys.length) {
    throw new Error("Parity status baseline contains duplicate entries.");
  }

  const missing = [...expectedKeys].filter((key) => !actualKeys.has(key));
  const extra = [...actualKeys].filter((key) => !expectedKeys.has(key));
  if (missing.length > 0 || extra.length > 0) {
    throw new Error(
      `Parity status baseline does not match the source inventory. Missing: ${missing.join(", ") || "none"}. Extra: ${extra.join(", ") || "none"}.`,
    );
  }

  for (const item of baseline.entries) {
    if (!statusOrder.includes(item.status)) {
      throw new Error(`${parityKey(item)} has unknown parity status ${String(item.status)}.`);
    }
  }
}

export function applyStatusBaseline(entries: ParityEntry[], baseline: StatusBaseline) {
  validateStatusBaseline(entries, baseline);
  const statuses = new Map(baseline.entries.map((item) => [parityKey(item), item.status]));
  return entries.map((item) => ({ ...item, status: statuses.get(parityKey(item)) ?? "missing" }));
}

export function createAllMissingBaseline(entries: ParityEntry[]): StatusBaseline {
  return {
    version: 1,
    entries: entries.map(({ id, kind }) => ({ id, kind, status: "missing" })),
  };
}

function unwrapExpression(expression: ts.Expression): ts.Expression {
  let current = expression;
  while (
    ts.isParenthesizedExpression(current) ||
    ts.isAsExpression(current) ||
    ts.isSatisfiesExpression(current) ||
    ts.isTypeAssertionExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

function propertyName(property: ts.PropertyName) {
  if (ts.isIdentifier(property) || ts.isStringLiteral(property)) return property.text;
  return undefined;
}

function readTargetManifest(root: string, definition: TargetManifestDefinition) {
  const absolutePath = resolve(root, definition.path);
  let manifestStats: ReturnType<typeof lstatSync>;
  try {
    manifestStats = lstatSync(absolutePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { ...definition, duplicates: [], exists: false, ids: [] };
    }
    throw error;
  }
  const rootPath = realpathSync(root);
  const pathFromRoot = relative(rootPath, realpathSync(absolutePath));
  if (manifestStats.isSymbolicLink() || pathFromRoot.startsWith("..") || isAbsolute(pathFromRoot)) {
    throw new Error(`${definition.path} must be a real canonical manifest inside the repository.`);
  }

  const sourceFile = ts.createSourceFile(
    definition.path,
    readFileSync(absolutePath, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  let initializer: ts.Expression | undefined;

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    const isExported = statement.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    );
    if (!isExported) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === definition.exportName) {
        initializer = declaration.initializer;
      }
    }
  }

  const unwrappedInitializer = initializer ? unwrapExpression(initializer) : undefined;
  if (
    !unwrappedInitializer ||
    !ts.isCallExpression(unwrappedInitializer) ||
    !ts.isIdentifier(unwrappedInitializer.expression) ||
    unwrappedInitializer.expression.text !== definition.wrapperName
  ) {
    throw new Error(
      `${definition.path} must export ${definition.exportName} = ${definition.wrapperName}([...]).`,
    );
  }

  const firstArgument = unwrappedInitializer.arguments[0];
  const manifestArray = firstArgument ? unwrapExpression(firstArgument) : undefined;
  if (!manifestArray || !ts.isArrayLiteralExpression(manifestArray)) {
    throw new Error(`${definition.path} must pass a literal array to ${definition.wrapperName}.`);
  }

  const ids: string[] = [];
  for (const element of manifestArray.elements) {
    const record = unwrapExpression(element);
    if (!ts.isObjectLiteralExpression(record)) {
      throw new Error(`${definition.path} manifest entries must be literal objects.`);
    }
    const idAssignment = record.properties.find(
      (property): property is ts.PropertyAssignment =>
        ts.isPropertyAssignment(property) && propertyName(property.name) === definition.idProperty,
    );
    const idExpression = idAssignment ? unwrapExpression(idAssignment.initializer) : undefined;
    if (
      !idExpression ||
      (!ts.isStringLiteral(idExpression) && !ts.isNoSubstitutionTemplateLiteral(idExpression))
    ) {
      throw new Error(
        `${definition.path} entries need a literal ${definition.idProperty} property.`,
      );
    }
    ids.push(idExpression.text);
  }

  const seen = new Set<string>();
  const duplicateSet = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) duplicateSet.add(id);
    seen.add(id);
  }

  return {
    ...definition,
    duplicates: [...duplicateSet].sort((left, right) => left.localeCompare(right)),
    exists: true,
    ids,
  };
}

export function collectTargetManifests(
  root = repositoryRoot,
  definitions: readonly TargetManifestDefinition[] = targetManifestDefinitions,
): TargetManifests {
  const snapshots = definitions.map((definition) => readTargetManifest(root, definition));
  const byKind = new Map(snapshots.map((snapshot) => [snapshot.kind, snapshot]));

  for (const kind of ["component", "doc", "particle"] as const) {
    if (!byKind.has(kind)) throw new Error(`No canonical ${kind} target manifest is configured.`);
  }
  if (byKind.size !== snapshots.length) {
    throw new Error("Each target manifest kind must have exactly one canonical definition.");
  }

  return Object.fromEntries(byKind) as TargetManifests;
}

export function compareTargetManifests(
  entries: ParityEntry[],
  manifests: TargetManifests,
): TargetManifestComparison {
  return Object.fromEntries(
    (["component", "doc", "particle"] as const).map((kind) => {
      const expected = new Set(entries.filter((entry) => entry.kind === kind).map(({ id }) => id));
      const actual = new Set(manifests[kind].ids);
      return [
        kind,
        {
          duplicates: manifests[kind].duplicates,
          extra: [...actual]
            .filter((id) => !expected.has(id))
            .sort((left, right) => left.localeCompare(right)),
          missing: [...expected]
            .filter((id) => !actual.has(id))
            .sort((left, right) => left.localeCompare(right)),
        },
      ];
    }),
  ) as TargetManifestComparison;
}

const ignoredComponentSourceDirectories = new Set([
  ".git",
  ".svelte-kit",
  ".turbo",
  "build",
  "dist",
  "generated",
  "node_modules",
]);

function isGeneratedSourceName(path: string) {
  const name = basename(path).toLowerCase();
  return (
    name.startsWith("generated.") ||
    name.includes(".generated.") ||
    name.startsWith("generated-") ||
    name.includes(".gen.")
  );
}

function withoutHtmlComments(source: string) {
  return source.replaceAll(/<!--[\s\S]*?-->/g, "").trim();
}

function isPlaceholderText(source: string) {
  const normalized = source
    .replaceAll(/^[\s#>*_`~!.-]+|[\s#>*_`~!.-]+$/g, "")
    .trim()
    .toLowerCase();
  return (
    normalized.length === 0 ||
    /^(todo|fixme|tbd|placeholder|coming soon)([:\s.!_-].*)?$/.test(normalized)
  );
}

function hasRuntimeTypeScript(source: string, path: string) {
  const sourceFile = ts.createSourceFile(
    path,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  return sourceFile.statements.some(
    (statement) =>
      !ts.isImportDeclaration(statement) &&
      !ts.isImportEqualsDeclaration(statement) &&
      !ts.isExportDeclaration(statement) &&
      !ts.isInterfaceDeclaration(statement) &&
      !ts.isTypeAliasDeclaration(statement) &&
      !ts.isEmptyStatement(statement),
  );
}

function hasAuthoredSvelteContent(path: string, requireTemplate = false) {
  if (isGeneratedSourceName(path)) return false;
  const source = withoutHtmlComments(readFileSync(path, "utf8"));
  if (isPlaceholderText(source)) return false;

  const scripts = [...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
  const template = source
    .replaceAll(/<script(?:\s[^>]*)?>[\s\S]*?<\/script>/gi, "")
    .replaceAll(/<style(?:\s[^>]*)?>[\s\S]*?<\/style>/gi, "")
    .trim();
  if (!isPlaceholderText(template) && /<[A-Za-z]|{[#@]/.test(template)) return true;
  if (requireTemplate) return false;
  return scripts.some((match) => hasRuntimeTypeScript(match[1] ?? "", path));
}

function hasAuthoredMarkdownContent(path: string) {
  const source = withoutHtmlComments(readFileSync(path, "utf8")).replace(
    /^---\s*\n[\s\S]*?\n---\s*(?:\n|$)/,
    "",
  );
  return !isPlaceholderText(source) && /[A-Za-z0-9]/.test(source);
}

function isComponentSourceFile(path: string) {
  const name = basename(path);
  if (
    isGeneratedSourceName(path) ||
    name.endsWith(".d.ts") ||
    name.endsWith(".spec.ts") ||
    name.endsWith(".test.ts")
  ) {
    return false;
  }
  if (extname(name) === ".svelte") return hasAuthoredSvelteContent(path);
  if (extname(name) === ".ts") return hasRuntimeTypeScript(readFileSync(path, "utf8"), path);
  return false;
}

function componentHasAuthoredSource(path: string): boolean {
  const stats = lstatSync(path);
  if (stats.isSymbolicLink()) return false;
  if (stats.isFile()) return isComponentSourceFile(path);
  if (!stats.isDirectory()) return false;

  return readdirSync(path, { withFileTypes: true }).some((directoryEntry) => {
    if (directoryEntry.isSymbolicLink()) return false;
    if (
      directoryEntry.isDirectory() &&
      ignoredComponentSourceDirectories.has(directoryEntry.name)
    ) {
      return false;
    }
    return componentHasAuthoredSource(join(path, directoryEntry.name));
  });
}

function resolveTargetInsideRepository(root: string, path: string) {
  const resolvedRoot = realpathSync(root);
  const resolvedTarget = resolve(resolvedRoot, path);
  const pathFromRoot = relative(resolvedRoot, resolvedTarget);
  if (pathFromRoot.startsWith("..") || isAbsolute(pathFromRoot)) {
    throw new Error(`target path escapes the repository: ${path}`);
  }
  if (existsSync(resolvedTarget)) {
    const realTarget = realpathSync(resolvedTarget);
    const realPathFromRoot = relative(resolvedRoot, realTarget);
    if (realPathFromRoot.startsWith("..") || isAbsolute(realPathFromRoot)) {
      throw new Error(`target path escapes the repository through a symlink: ${path}`);
    }
  }
  return resolvedTarget;
}

function promotedTargetError(root: string, item: ParityEntry) {
  const path = item.targetPaths[0];
  if (!path) return `${parityKey(item)} has no canonical authored target path.`;

  const expectedComponentRoot = `packages/ui/src/components/ui/${item.id}`;
  const expectedParticle = `apps/ui/registry/default/particles/${item.id}.svelte`;
  const expectedDoc = `apps/ui/content/docs/${item.id}.md`;
  const isCanonical =
    (item.kind === "component" &&
      (path === expectedComponentRoot || path.startsWith(`${expectedComponentRoot}/`))) ||
    (item.kind === "particle" && path === expectedParticle) ||
    (item.kind === "doc" && path === expectedDoc);

  if (!isCanonical) {
    return `${parityKey(item)} uses non-canonical or generated target ${path}.`;
  }

  const absolutePath = resolveTargetInsideRepository(root, path);
  if (!existsSync(absolutePath)) {
    return `${parityKey(item)} is ${item.status} but lacks a real authored target at ${path}.`;
  }

  const stats = lstatSync(absolutePath);
  let valid = false;
  if (item.kind === "component") {
    valid = componentHasAuthoredSource(absolutePath);
  } else if (item.kind === "particle") {
    valid =
      stats.isFile() &&
      !stats.isSymbolicLink() &&
      extname(absolutePath) === ".svelte" &&
      hasAuthoredSvelteContent(absolutePath, true);
  } else {
    valid =
      stats.isFile() &&
      !stats.isSymbolicLink() &&
      extname(absolutePath) === ".md" &&
      hasAuthoredMarkdownContent(absolutePath);
  }

  return valid
    ? undefined
    : `${parityKey(item)} is ${item.status} but ${path} is not a real authored target.`;
}

export function validateTargetManifestParity(
  entries: ParityEntry[],
  manifests: TargetManifests,
  root = repositoryRoot,
) {
  const comparison = compareTargetManifests(entries, manifests);
  const errors: string[] = [];
  const extras = (["component", "doc", "particle"] as const).flatMap((kind) =>
    comparison[kind].extra.map((id) => `${kind}:${id}`),
  );
  const duplicates = (["component", "doc", "particle"] as const).flatMap((kind) =>
    comparison[kind].duplicates.map((id) => `${kind}:${id}`),
  );

  if (extras.length > 0) errors.push(`Extra: ${extras.join(", ")}.`);
  if (duplicates.length > 0) errors.push(`Duplicates: ${duplicates.join(", ")}.`);

  for (const item of entries) {
    if (item.status === "missing") continue;
    if (!manifests[item.kind].ids.includes(item.id)) {
      errors.push(
        `${parityKey(item)} is ${item.status} but absent from ${manifests[item.kind].path}.`,
      );
    }
    const targetError = promotedTargetError(root, item);
    if (targetError) errors.push(targetError);
  }

  if (errors.length > 0) throw new Error(`Target manifest mismatch. ${errors.join(" ")}`);
}

function renderPathList(paths: string[]) {
  return paths.map((path) => `\`${path}\``).join("<br>");
}

function renderGroup(
  title: string,
  entries: ParityEntry[],
  particleComponents: Record<string, string[]>,
) {
  const isParticleGroup = entries.every(({ kind }) => kind === "particle");
  const header = isParticleGroup
    ? [
        "| ID | Reference | Target | Component imports | Status |",
        "| --- | --- | --- | --- | --- |",
      ]
    : ["| ID | Reference | Target | Status |", "| --- | --- | --- | --- |"];
  const rows = entries.map((item) => {
    const cells = [
      `\`${item.id}\``,
      renderPathList(item.sourcePaths),
      renderPathList(item.targetPaths),
    ];
    if (isParticleGroup) {
      cells.push((particleComponents[item.id] ?? []).map((id) => `\`${id}\``).join(", "));
    }
    cells.push(item.status);
    return `| ${cells.join(" | ")} |`;
  });

  return [`## ${title}`, "", ...header, ...rows].join("\n");
}

export function renderInventory(inventory: ReferenceInventory) {
  const components = inventory.entries.filter(({ kind }) => kind === "component");
  const docs = inventory.entries.filter(({ kind }) => kind === "doc");
  const particles = inventory.entries.filter(({ kind }) => kind === "particle");

  return [
    "Generated from the pinned local reference. The status baseline names every planned item, and source identifiers cannot be renamed to hide missing work.",
    renderGroup("Components", components, inventory.particleComponents),
    renderGroup("Documentation", docs, inventory.particleComponents),
    renderGroup("Particles", particles, inventory.particleComponents),
  ].join("\n\n");
}

export function formatOutstandingReport(entries: ParityEntry[]) {
  const outstanding = entries.filter(({ status }) => status !== "approved");
  const statusCounts = Object.fromEntries(
    statusOrder.map((status) => [
      status,
      entries.filter((entry) => entry.status === status).length,
    ]),
  ) as Record<ParityStatus, number>;
  const summary = [
    "Parity work remaining",
    `components: ${outstanding.filter(({ kind }) => kind === "component").length}`,
    `docs: ${outstanding.filter(({ kind }) => kind === "doc").length}`,
    `particles: ${outstanding.filter(({ kind }) => kind === "particle").length}`,
    `total: ${outstanding.length}`,
    ...statusOrder.map((status) => `${status}: ${statusCounts[status]}`),
  ];
  const groups = statusOrder
    .filter((status) => status !== "approved" && statusCounts[status] > 0)
    .flatMap((status) => [
      `## ${status} (${statusCounts[status]})`,
      ...entries.filter((entry) => entry.status === status).map((item) => `- ${parityKey(item)}`),
    ]);

  return [...summary, "", ...groups].join("\n");
}

export function updateGeneratedSection(document: string, generated: string) {
  const start = document.indexOf(startMarker);
  const end = document.indexOf(endMarker);

  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Parity matrix must contain ${startMarker} followed by ${endMarker}.`);
  }

  const before = document.slice(0, start + startMarker.length);
  const after = document.slice(end);
  return `${before}\n\n${generated}\n\n${after}`;
}

function withBaseline(inventory: ReferenceInventory, baseline: StatusBaseline): ReferenceInventory {
  return { ...inventory, entries: applyStatusBaseline(inventory.entries, baseline) };
}

export function expectedMatrix(root = repositoryRoot) {
  const current = readFileSync(join(root, "docs/porting/PARITY-MATRIX.md"), "utf8");
  const inventory = collectReferenceInventory(root);
  return updateGeneratedSection(
    current,
    renderInventory(withBaseline(inventory, loadStatusBaseline())),
  );
}

function writeNormalizedArtifact(inventory: ReferenceInventory, manifests: TargetManifests) {
  mkdirSync(dirname(artifactPath), { recursive: true });
  writeFileSync(
    artifactPath,
    `${JSON.stringify(
      {
        ...inventory,
        targetComparison: compareTargetManifests(inventory.entries, manifests),
        targetManifests: manifests,
      },
      null,
      2,
    )}\n`,
  );
}

function writeBaseline(inventory: ReferenceInventory) {
  let previous = new Map<string, ParityStatus>();
  if (existsSync(baselinePath)) {
    previous = new Map(loadStatusBaseline().entries.map((item) => [parityKey(item), item.status]));
  }

  const baseline: StatusBaseline = {
    version: 1,
    entries: inventory.entries.map(({ id, kind }) => ({
      id,
      kind,
      status: previous.get(`${kind}:${id}`) ?? "missing",
    })),
  };
  validateStatusBaseline(inventory.entries, baseline);
  writeFileSync(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`);
  return baseline;
}

function main() {
  const mode = process.argv[2] ?? "--check";
  const inventory = collectReferenceInventory();

  if (mode === "--write") {
    const baseline = writeBaseline(inventory);
    const completedInventory = withBaseline(inventory, baseline);
    const manifests = collectTargetManifests();
    validateTargetManifestParity(completedInventory.entries, manifests);
    const current = readFileSync(matrixPath, "utf8");
    writeFileSync(matrixPath, updateGeneratedSection(current, renderInventory(completedInventory)));
    writeNormalizedArtifact(completedInventory, manifests);
    console.log("Updated the parity status baseline and generated matrix section.");
    return;
  }

  if (mode !== "--check" && mode !== "--require-complete") {
    throw new Error(`Unknown mode ${mode}. Use --check, --write, or --require-complete.`);
  }

  const completedInventory = withBaseline(inventory, loadStatusBaseline());
  const manifests = collectTargetManifests();
  validateTargetManifestParity(completedInventory.entries, manifests);
  writeNormalizedArtifact(completedInventory, manifests);

  const current = readFileSync(matrixPath, "utf8");
  const expected = updateGeneratedSection(current, renderInventory(completedInventory));
  if (current !== expected) {
    throw new Error("docs/porting/PARITY-MATRIX.md is stale. Run pnpm parity:write.");
  }

  const report = formatOutstandingReport(completedInventory.entries);
  if (
    mode === "--require-complete" &&
    completedInventory.entries.some(({ status }) => status !== "approved")
  ) {
    console.error(report);
    process.exitCode = 1;
    return;
  }

  console.log("Parity inventory and status baseline are current.");
  console.log(report);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
