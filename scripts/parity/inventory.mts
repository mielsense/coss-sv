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
import { parse } from "svelte/compiler";
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

function isPathInside(parent: string, child: string) {
  const pathFromParent = relative(parent, child);
  return pathFromParent === "" || (!pathFromParent.startsWith("..") && !isAbsolute(pathFromParent));
}

function inspectCanonicalPath(root: string, path: string, label: string) {
  const resolvedRoot = realpathSync(root);
  const segments = normalizedPath(path).split("/");
  if (
    isAbsolute(path) ||
    normalizedPath(path) !== path ||
    segments.some((segment) => segment === "" || segment === "." || segment === "..")
  ) {
    throw new Error(`${label} is not a canonical repository-relative path.`);
  }

  const resolvedTarget = resolve(resolvedRoot, ...segments);
  if (!isPathInside(resolvedRoot, resolvedTarget)) {
    throw new Error(`${label} escapes the repository.`);
  }

  let current = resolvedRoot;
  for (const segment of segments) {
    current = join(current, segment);
    let stats: ReturnType<typeof lstatSync>;
    try {
      stats = lstatSync(current);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return { absolutePath: resolvedTarget, exists: false, root: resolvedRoot };
      }
      throw error;
    }
    if (stats.isSymbolicLink()) {
      throw new Error(`${label} must not contain a symbolic-link path segment.`);
    }
    const realCurrent = realpathSync(current);
    if (!isPathInside(resolvedRoot, realCurrent)) {
      throw new Error(`${label} escapes the repository.`);
    }
  }

  return { absolutePath: resolvedTarget, exists: true, root: resolvedRoot };
}

const canonicalSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isCanonicalParityId(kind: ParityKind, id: string) {
  if (kind !== "doc") return canonicalSlugPattern.test(id);
  const segments = id.split("/");
  return (
    (segments.length === 1 && canonicalSlugPattern.test(segments[0] ?? "")) ||
    (segments.length === 2 &&
      (segments[0] === "components" || segments[0] === "hooks") &&
      canonicalSlugPattern.test(segments[1] ?? ""))
  );
}

function assertCanonicalParityId(kind: ParityKind, id: string) {
  if (!isCanonicalParityId(kind, id)) {
    throw new Error(`${kind}:${JSON.stringify(id)} has an invalid canonical ${kind} id.`);
  }
}

function readTargetManifest(root: string, definition: TargetManifestDefinition) {
  const canonicalPath = inspectCanonicalPath(root, definition.path, definition.path);
  if (!canonicalPath.exists) {
    return { ...definition, duplicates: [], exists: false, ids: [] };
  }
  const absolutePath = canonicalPath.absolutePath;

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
    assertCanonicalParityId(definition.kind, idExpression.text);
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

function isGeneratedSourceName(path: string) {
  const stem = basename(path, extname(path)).toLowerCase();
  return /(?:^|[._-])(?:gen|generated)(?:$|[._-])/.test(stem);
}

function withoutHtmlComments(source: string) {
  return source.replaceAll(/<!--[\s\S]*?-->/g, "").trim();
}

function isPlaceholderText(source: string) {
  const normalized = source
    .replaceAll(/&(?:nbsp|#160|#x0*a0);/gi, " ")
    .replaceAll(/^[\s#>*_`~!.,:;()[\]{}-]+|[\s#>*_`~!.,:;()[\]{}-]+$/g, "")
    .replaceAll(/\s+/g, " ")
    .trim()
    .toLowerCase();
  return (
    normalized.length === 0 ||
    /^(todo|fixme|tbd|placeholder|coming soon)([:\s.!_-].*)?$/.test(normalized)
  );
}

type TemplateNode = {
  alternate?: TemplateFragment | null;
  attributes?: TemplateAttribute[];
  body?: TemplateFragment;
  catch?: TemplateFragment;
  consequent?: TemplateFragment;
  data?: string;
  expression?: ExpressionNode;
  fallback?: TemplateFragment;
  fragment?: TemplateFragment;
  index?: string;
  name?: string;
  parameters?: ExpressionNode[];
  pending?: TemplateFragment;
  test?: ExpressionNode;
  then?: TemplateFragment;
  type: string;
  context?: ExpressionNode;
};

type TemplateFragment = { nodes?: TemplateNode[] };

type TemplateAttribute = {
  name?: string;
  type?: string;
  value?: boolean | TemplateNode | TemplateNode[];
};

type ExpressionNode = {
  alternate?: ExpressionNode;
  argument?: ExpressionNode;
  arguments?: ExpressionNode[];
  async?: boolean;
  body?: ExpressionNode | ScriptNode[];
  callee?: ExpressionNode;
  computed?: boolean;
  consequent?: ExpressionNode;
  declarations?: ExpressionNode[];
  elements?: Array<ExpressionNode | null>;
  expression?: ExpressionNode;
  expressions?: ExpressionNode[];
  id?: ExpressionNode;
  init?: ExpressionNode | null;
  key?: ExpressionNode;
  kind?: string;
  left?: ExpressionNode;
  local?: ExpressionNode;
  name?: string;
  object?: ExpressionNode;
  operator?: string;
  optional?: boolean;
  params?: ExpressionNode[];
  properties?: ExpressionNode[];
  property?: ExpressionNode;
  quasis?: Array<{ value?: { cooked?: string | null; raw?: string } }>;
  right?: ExpressionNode;
  specifiers?: ExpressionNode[];
  test?: ExpressionNode;
  type?: string;
  value?: unknown;
};

type ScriptNode = ExpressionNode & { body?: ScriptNode[] };

type Evaluation = { kind: "closed" } | { kind: "known"; value: unknown } | { kind: "runtime" };

type Binding =
  | { expression: ExpressionNode; kind: "expression" }
  | { functionNode: ExpressionNode; kind: "function" }
  | Evaluation;

type LexicalBindings = Map<string, Binding>;

type SnippetDefinition = {
  bindings: LexicalBindings;
  body: TemplateFragment;
  parameters: ExpressionNode[];
};

type RenderContext = {
  bindings: LexicalBindings;
  resolvingSnippets: Set<string>;
  snippets: Map<string, SnippetDefinition>;
};

type RenderEvidence = {
  dynamic: boolean;
  structural: boolean;
  text: string[];
};

function mergeRenderEvidence(target: RenderEvidence, source: RenderEvidence) {
  target.dynamic ||= source.dynamic;
  target.structural ||= source.structural;
  target.text.push(...source.text);
}

function known(value: unknown): Evaluation {
  return { kind: "known", value };
}

function runtime(): Evaluation {
  return { kind: "runtime" };
}

function closed(): Evaluation {
  return { kind: "closed" };
}

function unwrapRenderExpression(expression: ExpressionNode | undefined) {
  let current = expression;
  while (
    current &&
    new Set([
      "ChainExpression",
      "TSAsExpression",
      "TSNonNullExpression",
      "TSSatisfiesExpression",
      "TSTypeAssertion",
      "TypeCastExpression",
    ]).has(current.type ?? "")
  ) {
    current = current.expression;
  }
  return current;
}

function bindingEvaluation(
  binding: Binding | undefined,
  bindings: LexicalBindings,
  resolvingBindings: Set<string>,
): Evaluation {
  if (!binding) return closed();
  if (binding.kind === "known" || binding.kind === "runtime" || binding.kind === "closed") {
    return binding;
  }
  if (binding.kind === "function") return closed();
  return evaluateExpression(binding.expression, bindings, resolvingBindings);
}

function containsRuntimeProvenance(
  value: unknown,
  bindings: LexicalBindings,
  seen = new Set<unknown>(),
): boolean {
  if (!value || typeof value !== "object" || seen.has(value)) return false;
  seen.add(value);
  const node = value as ExpressionNode;
  if (node.type === "Identifier" && node.name) {
    const binding = bindings.get(node.name);
    if (binding?.kind === "runtime") return true;
    if (binding?.kind === "expression") {
      return containsRuntimeProvenance(binding.expression, bindings, seen);
    }
    if (binding?.kind === "function") {
      return containsRuntimeProvenance(binding.functionNode.body, bindings, seen);
    }
    return false;
  }
  return Object.entries(value).some(
    ([key, child]) =>
      !new Set(["type", "name", "raw", "value", "start", "end", "loc"]).has(key) &&
      (Array.isArray(child)
        ? child.some((item) => containsRuntimeProvenance(item, bindings, seen))
        : containsRuntimeProvenance(child, bindings, seen)),
  );
}

function evaluatePropertyKey(
  property: ExpressionNode,
  bindings: LexicalBindings,
  resolvingBindings: Set<string>,
): Evaluation {
  if (!property.computed && property.key?.type === "Identifier") return known(property.key.name);
  return evaluateExpression(property.key, bindings, resolvingBindings);
}

type KnownRecord = { __parityRecord: true; values: Map<unknown, unknown> };

function isKnownRecord(value: unknown): value is KnownRecord {
  return Boolean(
    value &&
      typeof value === "object" &&
      "__parityRecord" in value &&
      (value as KnownRecord).__parityRecord,
  );
}

function evaluateExpression(
  expression: ExpressionNode | undefined,
  bindings: LexicalBindings,
  resolvingBindings = new Set<string>(),
): Evaluation {
  const node = unwrapRenderExpression(expression);
  if (!node) return closed();

  if (node.type === "Literal" || node.type === "StringLiteral") {
    return known(node.value);
  }
  if (node.type === "Identifier") {
    if (node.name === "undefined") return known(undefined);
    if (!node.name || resolvingBindings.has(node.name)) return closed();
    return bindingEvaluation(
      bindings.get(node.name),
      bindings,
      new Set(resolvingBindings).add(node.name),
    );
  }
  if (node.type === "TemplateLiteral") {
    const values = (node.expressions ?? []).map((item) =>
      evaluateExpression(item, bindings, resolvingBindings),
    );
    if (values.some((item) => item.kind === "runtime")) return runtime();
    if (values.some((item) => item.kind === "closed")) return closed();
    const quasis = node.quasis ?? [];
    let value = "";
    for (const [index, quasi] of quasis.entries()) {
      value += quasi.value?.cooked ?? quasi.value?.raw ?? "";
      const item = values[index];
      if (item?.kind === "known") value += String(item.value ?? "");
    }
    return known(value);
  }
  if (node.type === "ArrayExpression") {
    const values = (node.elements ?? []).map((item) =>
      item ? evaluateExpression(item, bindings, resolvingBindings) : known(undefined),
    );
    if (values.some((item) => item.kind === "runtime")) return runtime();
    if (values.some((item) => item.kind === "closed")) return closed();
    return known(values.map((item) => (item.kind === "known" ? item.value : undefined)));
  }
  if (node.type === "ObjectExpression") {
    const values = new Map<unknown, unknown>();
    for (const property of node.properties ?? []) {
      if (property.type === "SpreadElement") {
        const spread = evaluateExpression(property.argument, bindings, resolvingBindings);
        if (spread.kind === "runtime") return runtime();
        if (spread.kind !== "known" || !isKnownRecord(spread.value)) return closed();
        for (const [key, value] of spread.value.values) values.set(key, value);
        continue;
      }
      const key = evaluatePropertyKey(property, bindings, resolvingBindings);
      const value = evaluateExpression(property.value, bindings, resolvingBindings);
      if (key.kind === "runtime" || value.kind === "runtime") return runtime();
      if (key.kind !== "known" || value.kind !== "known") return closed();
      values.set(key.value, value.value);
    }
    return known({ __parityRecord: true, values } satisfies KnownRecord);
  }
  if (node.type === "SequenceExpression") {
    const last = node.expressions?.at(-1);
    return evaluateExpression(last, bindings, resolvingBindings);
  }
  if (node.type === "UnaryExpression") {
    if (node.operator === "void") return known(undefined);
    const argument = evaluateExpression(node.argument, bindings, resolvingBindings);
    if (argument.kind !== "known") return argument;
    if (node.operator === "!") return known(!argument.value);
    if (node.operator === "+") return known(Number(argument.value));
    if (node.operator === "-") return known(-Number(argument.value));
    if (node.operator === "~") return known(~Number(argument.value));
    return closed();
  }
  if (node.type === "LogicalExpression") {
    const left = evaluateExpression(node.left, bindings, resolvingBindings);
    if (left.kind !== "known") return left;
    if (node.operator === "&&") {
      return left.value ? evaluateExpression(node.right, bindings, resolvingBindings) : left;
    }
    if (node.operator === "||") {
      return left.value ? left : evaluateExpression(node.right, bindings, resolvingBindings);
    }
    if (node.operator === "??") {
      return left.value === null || left.value === undefined
        ? evaluateExpression(node.right, bindings, resolvingBindings)
        : left;
    }
    return closed();
  }
  if (node.type === "ConditionalExpression") {
    const test = evaluateExpression(node.test, bindings, resolvingBindings);
    if (test.kind === "known") {
      return evaluateExpression(
        test.value ? node.consequent : node.alternate,
        bindings,
        resolvingBindings,
      );
    }
    if (test.kind === "closed") return closed();
    const consequent = evaluateExpression(node.consequent, bindings, resolvingBindings);
    const alternate = evaluateExpression(node.alternate, bindings, resolvingBindings);
    if (
      consequent.kind === "known" &&
      alternate.kind === "known" &&
      Object.is(consequent.value, alternate.value)
    ) {
      return consequent;
    }
    return runtime();
  }
  if (node.type === "BinaryExpression") {
    const left = evaluateExpression(node.left, bindings, resolvingBindings);
    const right = evaluateExpression(node.right, bindings, resolvingBindings);
    if (left.kind === "runtime" || right.kind === "runtime") return runtime();
    if (left.kind !== "known" || right.kind !== "known") return closed();
    switch (node.operator) {
      case "===":
        return known(left.value === right.value);
      case "!==":
        return known(left.value !== right.value);
      case "<":
        return known((left.value as number) < (right.value as number));
      case "<=":
        return known((left.value as number) <= (right.value as number));
      case ">":
        return known((left.value as number) > (right.value as number));
      case ">=":
        return known((left.value as number) >= (right.value as number));
      case "+":
        return known((left.value as number) + (right.value as number));
      case "-":
        return known(Number(left.value) - Number(right.value));
      case "*":
        return known(Number(left.value) * Number(right.value));
      case "/":
        return known(Number(left.value) / Number(right.value));
      case "%":
        return known(Number(left.value) % Number(right.value));
      case "**":
        return known(Number(left.value) ** Number(right.value));
      default:
        return closed();
    }
  }
  if (node.type === "MemberExpression") {
    const object = evaluateExpression(node.object, bindings, resolvingBindings);
    if (object.kind === "runtime") return runtime();
    if (object.kind === "known" && (object.value === null || object.value === undefined)) {
      return known(undefined);
    }
    if (object.kind === "known") {
      const property = node.computed
        ? evaluateExpression(node.property, bindings, resolvingBindings)
        : node.property?.type === "Identifier"
          ? known(node.property.name)
          : closed();
      if (property.kind === "runtime") return runtime();
      if (property.kind === "known") {
        if (isKnownRecord(object.value)) return known(object.value.values.get(property.value));
        if (
          property.value === "length" &&
          (typeof object.value === "string" || Array.isArray(object.value))
        ) {
          return known(object.value.length);
        }
        if (Array.isArray(object.value) && typeof property.value === "number") {
          return known(object.value[property.value]);
        }
      }
    }
    return closed();
  }
  if (node.type === "CallExpression") {
    const calleeNode = unwrapRenderExpression(node.callee);
    const argumentsList = node.arguments ?? [];
    if (calleeNode?.type === "Identifier") {
      if (calleeNode.name?.startsWith("$") && !bindings.has(calleeNode.name)) return runtime();
      if (calleeNode.name === "Boolean" && !bindings.has("Boolean")) {
        const argument = evaluateExpression(argumentsList[0], bindings, resolvingBindings);
        return argument.kind === "known" ? known(Boolean(argument.value)) : argument;
      }
      const binding = calleeNode.name ? bindings.get(calleeNode.name) : undefined;
      if (binding?.kind === "function") {
        return evaluateFunctionCall(
          binding.functionNode,
          argumentsList,
          bindings,
          resolvingBindings,
        );
      }
    }
    if (
      calleeNode?.type === "ArrowFunctionExpression" ||
      calleeNode?.type === "FunctionExpression"
    ) {
      return evaluateFunctionCall(calleeNode, argumentsList, bindings, resolvingBindings);
    }
    const callee = evaluateExpression(calleeNode, bindings, resolvingBindings);
    if (callee.kind === "runtime") return runtime();
    if (callee.kind === "known" && (callee.value === null || callee.value === undefined)) {
      return known(undefined);
    }
    return closed();
  }
  return containsRuntimeProvenance(node, bindings) ? runtime() : closed();
}

function bindPattern(
  pattern: ExpressionNode | undefined,
  evaluation: Evaluation,
  bindings: LexicalBindings,
) {
  if (!pattern) return;
  if (pattern.type === "Identifier" && pattern.name) {
    bindings.set(pattern.name, evaluation);
    return;
  }
  if (pattern.type === "AssignmentPattern") {
    const assigned =
      evaluation.kind === "known" && evaluation.value === undefined
        ? evaluateExpression(pattern.right, bindings)
        : evaluation;
    bindPattern(pattern.left, assigned, bindings);
    return;
  }
  if (pattern.type === "RestElement") {
    bindPattern(pattern.argument, evaluation, bindings);
    return;
  }
  if (pattern.type === "ArrayPattern") {
    const values =
      evaluation.kind === "known" && Array.isArray(evaluation.value) ? evaluation.value : [];
    for (const [index, element] of (pattern.elements ?? []).entries()) {
      const item =
        evaluation.kind === "runtime"
          ? runtime()
          : evaluation.kind === "known" && Array.isArray(evaluation.value)
            ? known(values[index])
            : closed();
      bindPattern(element ?? undefined, item, bindings);
    }
    return;
  }
  if (pattern.type === "ObjectPattern") {
    for (const property of pattern.properties ?? []) {
      if (property.type === "RestElement") {
        bindPattern(property.argument, evaluation, bindings);
        continue;
      }
      const key = evaluatePropertyKey(property, bindings, new Set());
      const item =
        evaluation.kind === "runtime"
          ? runtime()
          : evaluation.kind === "known" && isKnownRecord(evaluation.value) && key.kind === "known"
            ? known(evaluation.value.values.get(key.value))
            : closed();
      bindPattern(property.value, item, bindings);
    }
  }
}

function addFunctionLocalBindings(statements: ScriptNode[], bindings: LexicalBindings) {
  for (const statement of statements) {
    if (statement.type === "FunctionDeclaration" && statement.id?.name) {
      bindings.set(statement.id.name, { functionNode: statement, kind: "function" });
    }
  }
  for (const statement of statements) {
    if (statement.type !== "VariableDeclaration") continue;
    for (const declaration of statement.declarations ?? []) {
      const evaluation =
        statement.kind === "const"
          ? evaluateExpression(declaration.init ?? undefined, bindings)
          : runtime();
      bindPattern(declaration.id, evaluation, bindings);
    }
  }
}

function evaluateFunctionCall(
  functionNode: ExpressionNode,
  argumentsList: ExpressionNode[],
  bindings: LexicalBindings,
  resolvingBindings: Set<string>,
): Evaluation {
  if (functionNode.async)
    return containsRuntimeProvenance(functionNode, bindings) ? runtime() : closed();
  const functionBindings = new Map(bindings);
  for (const [index, parameter] of (functionNode.params ?? []).entries()) {
    const argument =
      parameter.type === "RestElement"
        ? evaluateArgumentList(argumentsList.slice(index), bindings, resolvingBindings)
        : index < argumentsList.length
          ? evaluateExpression(argumentsList[index], bindings, resolvingBindings)
          : known(undefined);
    bindPattern(parameter, argument, functionBindings);
    if (parameter.type === "RestElement") break;
  }
  if (Array.isArray(functionNode.body)) {
    addFunctionLocalBindings(functionNode.body, functionBindings);
    const returned = functionNode.body.find((statement) => statement.type === "ReturnStatement");
    return returned
      ? evaluateExpression(returned.argument, functionBindings, resolvingBindings)
      : known(undefined);
  }
  if (functionNode.body?.type === "BlockStatement" && Array.isArray(functionNode.body.body)) {
    addFunctionLocalBindings(functionNode.body.body, functionBindings);
    const returned = functionNode.body.body.find(
      (statement) => statement.type === "ReturnStatement",
    );
    return returned
      ? evaluateExpression(returned.argument, functionBindings, resolvingBindings)
      : known(undefined);
  }
  return evaluateExpression(
    functionNode.body as ExpressionNode | undefined,
    functionBindings,
    resolvingBindings,
  );
}

function evaluateArgumentList(
  argumentsList: ExpressionNode[],
  bindings: LexicalBindings,
  resolvingBindings = new Set<string>(),
): Evaluation {
  const values = argumentsList.map((argument) =>
    evaluateExpression(argument, bindings, resolvingBindings),
  );
  if (values.some((value) => value.kind === "runtime")) return runtime();
  if (values.some((value) => value.kind === "closed")) return closed();
  return known(values.map((value) => (value.kind === "known" ? value.value : undefined)));
}

function addVisibleText(evidence: RenderEvidence, value: string) {
  if (value.trim() && !isPlaceholderText(value)) evidence.text.push(value);
}

function inspectExpression(
  expression: ExpressionNode | undefined,
  bindings: LexicalBindings,
): RenderEvidence {
  const evidence: RenderEvidence = { dynamic: false, structural: false, text: [] };
  const result = evaluateExpression(expression, bindings);
  if (result.kind === "runtime") {
    evidence.dynamic = true;
    return evidence;
  }
  if (result.kind === "closed") return evidence;
  if (typeof result.value === "string") addVisibleText(evidence, result.value);
  else if (typeof result.value === "number" || typeof result.value === "bigint") {
    addVisibleText(evidence, String(result.value));
  } else if (Array.isArray(result.value)) {
    addVisibleText(evidence, result.value.join(","));
  }
  return evidence;
}

function inspectHtmlExpression(
  expression: ExpressionNode | undefined,
  bindings: LexicalBindings,
): RenderEvidence {
  const result = evaluateExpression(expression, bindings);
  if (result.kind === "runtime") return { dynamic: true, structural: false, text: [] };
  if (result.kind === "closed") return { dynamic: false, structural: false, text: [] };
  if (typeof result.value !== "string" && typeof result.value !== "number") {
    return { dynamic: false, structural: false, text: [] };
  }
  const html = String(result.value);
  const visibleText = html
    .replaceAll(/<!--[\s\S]*?-->/g, " ")
    .replaceAll(/<(script|style|head|template|title|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
    .replaceAll(/<[^>]+>/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim();
  return {
    dynamic: false,
    structural: false,
    text: visibleText.length > 0 && !isPlaceholderText(visibleText) ? [visibleText] : [],
  };
}

function renderedSnippetName(expression: ExpressionNode | undefined) {
  const unwrapped = expression?.type === "ChainExpression" ? expression.expression : expression;
  if (unwrapped?.type !== "CallExpression") return undefined;
  return unwrapped.callee?.type === "Identifier" ? unwrapped.callee.name : undefined;
}

function staticAttributeValue(attribute: TemplateAttribute, bindings: LexicalBindings): Evaluation {
  if (attribute.value === true) return known(true);
  if (attribute.value && typeof attribute.value === "object" && !Array.isArray(attribute.value)) {
    return attribute.value.type === "ExpressionTag"
      ? evaluateExpression(attribute.value.expression, bindings)
      : closed();
  }
  if (!Array.isArray(attribute.value)) return closed();
  if (attribute.value.length === 1 && attribute.value[0]?.type === "ExpressionTag") {
    return evaluateExpression(attribute.value[0].expression, bindings);
  }
  let value = "";
  for (const node of attribute.value) {
    if (node.type === "Text") value += node.data ?? "";
    else if (node.type === "ExpressionTag") {
      const expression = evaluateExpression(node.expression, bindings);
      if (expression.kind !== "known") return expression;
      value += String(expression.value ?? "");
    } else return closed();
  }
  return known(value);
}

function isInertElement(node: TemplateNode, bindings: LexicalBindings) {
  const attributes = new Map(
    (node.attributes ?? [])
      .filter((attribute) => attribute.type === "Attribute" && attribute.name)
      .map((attribute) => [
        attribute.name?.toLowerCase() ?? "",
        staticAttributeValue(attribute, bindings),
      ]),
  );
  const enabledBooleanAttribute = (name: string) => {
    const value = attributes.get(name);
    if (value?.kind !== "known") return false;
    return value.value !== false && value.value !== null && value.value !== undefined;
  };
  if (enabledBooleanAttribute("hidden") || enabledBooleanAttribute("inert")) return true;
  const ariaHidden = attributes.get("aria-hidden");
  if (ariaHidden?.kind === "known" && String(ariaHidden.value).toLowerCase() === "true")
    return true;
  const inputType = attributes.get("type");
  if (
    node.name === "input" &&
    inputType?.kind === "known" &&
    String(inputType.value).toLowerCase() === "hidden"
  ) {
    return true;
  }
  const styleAttribute = attributes.get("style");
  const style = String(styleAttribute?.kind === "known" ? styleAttribute.value : "")
    .replaceAll(/\s+/g, "")
    .toLowerCase();
  return /(?:^|;)(?:display:none|visibility:hidden|content-visibility:hidden)(?:!important)?(?:;|$)/.test(
    style,
  );
}

function withLocalSnippets(fragment: TemplateFragment | undefined, context: RenderContext) {
  const snippets = new Map(context.snippets);
  for (const node of fragment?.nodes ?? []) {
    if (node.type === "SnippetBlock" && node.expression?.name && node.body) {
      snippets.set(node.expression.name, {
        bindings: new Map(context.bindings),
        body: node.body,
        parameters: node.parameters ?? [],
      });
    }
  }
  return snippets;
}

function inspectTemplateFragment(
  fragment: TemplateFragment | undefined,
  context: RenderContext,
): RenderEvidence {
  const evidence: RenderEvidence = { dynamic: false, structural: false, text: [] };
  const snippets = withLocalSnippets(fragment, context);
  const nestedContext = { ...context, snippets };

  for (const node of fragment?.nodes ?? []) {
    if (node.type === "Text") {
      if (node.data) addVisibleText(evidence, node.data);
      continue;
    }
    if (node.type === "ExpressionTag") {
      mergeRenderEvidence(evidence, inspectExpression(node.expression, context.bindings));
      continue;
    }
    if (node.type === "HtmlTag") {
      mergeRenderEvidence(evidence, inspectHtmlExpression(node.expression, context.bindings));
      continue;
    }
    if (node.type === "RenderTag") {
      const snippetName = renderedSnippetName(node.expression);
      const snippet = snippetName ? snippets.get(snippetName) : undefined;
      if (snippet && snippetName && !context.resolvingSnippets.has(snippetName)) {
        const call = unwrapRenderExpression(node.expression);
        const snippetBindings = new Map(snippet.bindings);
        for (const [index, parameter] of snippet.parameters.entries()) {
          const argument =
            parameter.type === "RestElement"
              ? evaluateArgumentList(call?.arguments?.slice(index) ?? [], context.bindings)
              : index < (call?.arguments?.length ?? 0)
                ? evaluateExpression(call?.arguments?.[index], context.bindings)
                : known(undefined);
          bindPattern(parameter, argument, snippetBindings);
          if (parameter.type === "RestElement") break;
        }
        mergeRenderEvidence(
          evidence,
          inspectTemplateFragment(snippet.body, {
            ...nestedContext,
            bindings: snippetBindings,
            resolvingSnippets: new Set(context.resolvingSnippets).add(snippetName),
          }),
        );
      } else {
        mergeRenderEvidence(evidence, inspectExpression(node.expression, context.bindings));
      }
      continue;
    }
    if (
      node.type === "SvelteHead" ||
      node.type === "TitleElement" ||
      new Set(["base", "head", "link", "meta", "title"]).has(node.name?.toLowerCase() ?? "")
    ) {
      continue;
    }
    if (node.type === "IfBlock") {
      const test = evaluateExpression(node.test, context.bindings);
      if (test.kind === "known") {
        mergeRenderEvidence(
          evidence,
          inspectTemplateFragment(
            test.value ? node.consequent : (node.alternate ?? undefined),
            nestedContext,
          ),
        );
      } else if (test.kind === "runtime") {
        mergeRenderEvidence(evidence, inspectTemplateFragment(node.consequent, nestedContext));
        mergeRenderEvidence(
          evidence,
          inspectTemplateFragment(node.alternate ?? undefined, nestedContext),
        );
      }
      continue;
    }
    if (node.type === "EachBlock") {
      const collection = evaluateExpression(node.expression, context.bindings);
      const values =
        collection.kind === "known" && Array.isArray(collection.value)
          ? collection.value
          : collection.kind === "known" && typeof collection.value === "string"
            ? [...collection.value]
            : [];
      if (collection.kind === "known" && values.length === 0) {
        mergeRenderEvidence(evidence, inspectTemplateFragment(node.fallback, nestedContext));
      } else if (collection.kind === "known") {
        for (const [index, value] of values.entries()) {
          const iterationBindings = new Map(context.bindings);
          bindPattern(node.context, known(value), iterationBindings);
          if (node.index) iterationBindings.set(node.index, known(index));
          mergeRenderEvidence(
            evidence,
            inspectTemplateFragment(node.body, { ...nestedContext, bindings: iterationBindings }),
          );
        }
      } else if (collection.kind === "runtime") {
        const iterationBindings = new Map(context.bindings);
        bindPattern(node.context, runtime(), iterationBindings);
        if (node.index) iterationBindings.set(node.index, runtime());
        mergeRenderEvidence(
          evidence,
          inspectTemplateFragment(node.body, { ...nestedContext, bindings: iterationBindings }),
        );
        mergeRenderEvidence(evidence, inspectTemplateFragment(node.fallback, nestedContext));
      }
      continue;
    }
    if (
      node.type === "Component" ||
      node.type === "SvelteComponent" ||
      node.type === "SvelteElement" ||
      node.type === "SvelteSelf" ||
      node.type === "SlotElement"
    ) {
      evidence.dynamic = true;
      continue;
    }
    if (node.type === "RegularElement") {
      if (isInertElement(node, context.bindings)) continue;
      const childEvidence = inspectTemplateFragment(node.fragment, nestedContext);
      mergeRenderEvidence(evidence, childEvidence);
      if (
        childEvidence.text.length === 0 &&
        !childEvidence.dynamic &&
        (node.attributes?.length ||
          !new Set([
            "article",
            "aside",
            "div",
            "footer",
            "header",
            "main",
            "p",
            "section",
            "span",
          ]).has(node.name ?? ""))
      ) {
        evidence.structural = true;
      }
      continue;
    }
    if (node.type === "SnippetBlock") continue;
    for (const child of [
      node.body,
      node.catch,
      node.consequent,
      node.fallback,
      node.fragment,
      node.pending,
      node.then,
    ]) {
      mergeRenderEvidence(evidence, inspectTemplateFragment(child, nestedContext));
    }
  }
  return evidence;
}

function addScriptBindings(
  bindings: LexicalBindings,
  script: { content?: ScriptNode } | null | undefined,
) {
  const statements = script?.content?.body ?? [];
  for (const statement of statements) {
    if (statement.type === "ImportDeclaration") {
      for (const specifier of statement.specifiers ?? []) {
        if (specifier.local?.name) bindings.set(specifier.local.name, runtime());
      }
    }
    if (statement.type === "FunctionDeclaration" && statement.id?.name) {
      bindings.set(statement.id.name, { functionNode: statement, kind: "function" });
    }
  }
  for (const statement of statements) {
    if (statement.type !== "VariableDeclaration") continue;
    for (const declaration of statement.declarations ?? []) {
      const evaluation =
        statement.kind === "const"
          ? evaluateExpression(declaration.init ?? undefined, bindings)
          : runtime();
      bindPattern(declaration.id, evaluation, bindings);
    }
  }
}

function collectConstBindings(
  instance: { content?: ScriptNode } | null | undefined,
  module: { content?: ScriptNode } | null | undefined,
) {
  const bindings: LexicalBindings = new Map();
  addScriptBindings(bindings, module);
  addScriptBindings(bindings, instance);
  return bindings;
}

function hasAuthoredSvelteContent(path: string) {
  if (isGeneratedSourceName(path)) return false;
  const source = readFileSync(path, "utf8");
  try {
    const ast = parse(source, { modern: true }) as {
      fragment: TemplateFragment;
      instance?: { content?: ScriptNode } | null;
      module?: { content?: ScriptNode } | null;
    };
    const evidence = inspectTemplateFragment(ast.fragment, {
      bindings: collectConstBindings(ast.instance, ast.module),
      resolvingSnippets: new Set(),
      snippets: new Map(),
    });
    return evidence.text.length > 0 || evidence.dynamic || evidence.structural;
  } catch {
    return false;
  }
}

function hasAuthoredMarkdownContent(path: string) {
  const source = withoutHtmlComments(readFileSync(path, "utf8"))
    .replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*(?:\r?\n|$)/, "")
    .replaceAll(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replaceAll(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replaceAll(/<[^>]+>/g, " ")
    .replaceAll(/[`*_~#>|]/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim();
  return !isPlaceholderText(source) && /[A-Za-z0-9]/.test(source);
}

function componentHasAuthoredSource(path: string, id: string): boolean {
  const stats = lstatSync(path);
  if (stats.isSymbolicLink()) return false;
  if (stats.isFile()) {
    const name = basename(path);
    return (
      extname(name) === ".svelte" &&
      (name === "root.svelte" || name === `${id}.svelte`) &&
      hasAuthoredSvelteContent(path)
    );
  }
  if (!stats.isDirectory()) return false;

  const canonicalRootNames = new Set(["root.svelte", `${id}.svelte`]);
  return readdirSync(path, { withFileTypes: true }).some(
    (directoryEntry) =>
      directoryEntry.isFile() &&
      canonicalRootNames.has(directoryEntry.name) &&
      !isGeneratedSourceName(directoryEntry.name) &&
      hasAuthoredSvelteContent(join(path, directoryEntry.name)),
  );
}

function promotedTargetError(root: string, item: ParityEntry) {
  const path = item.targetPaths[0];
  if (!path) return `${parityKey(item)} has no canonical authored target path.`;

  const expectedComponentRoot = `packages/ui/src/components/ui/${item.id}`;
  const expectedParticle = `apps/ui/registry/default/particles/${item.id}.svelte`;
  const expectedDoc = `apps/ui/content/docs/${item.id}.md`;
  const isCanonical =
    (item.kind === "component" && path === expectedComponentRoot) ||
    (item.kind === "particle" && path === expectedParticle) ||
    (item.kind === "doc" && path === expectedDoc);

  if (!isCanonical) {
    return `${parityKey(item)} uses non-canonical or generated target ${path}.`;
  }

  const kindRoot = {
    component: "packages/ui/src/components/ui",
    doc: "apps/ui/content/docs",
    particle: "apps/ui/registry/default/particles",
  }[item.kind];
  const canonicalTarget = inspectCanonicalPath(root, path, path);
  const canonicalKindRoot = resolve(canonicalTarget.root, kindRoot);
  if (!isPathInside(canonicalKindRoot, canonicalTarget.absolutePath)) {
    return `${parityKey(item)} resolves outside its canonical ${kindRoot} subtree.`;
  }
  const absolutePath = canonicalTarget.absolutePath;
  if (!canonicalTarget.exists) {
    return `${parityKey(item)} is ${item.status} but lacks a real authored target at ${path}.`;
  }

  const stats = lstatSync(absolutePath);
  let valid = false;
  if (item.kind === "component") {
    valid = componentHasAuthoredSource(absolutePath, item.id);
  } else if (item.kind === "particle") {
    valid =
      stats.isFile() &&
      !stats.isSymbolicLink() &&
      extname(absolutePath) === ".svelte" &&
      hasAuthoredSvelteContent(absolutePath);
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
  for (const item of entries) assertCanonicalParityId(item.kind, item.id);
  for (const kind of ["component", "doc", "particle"] as const) {
    for (const id of manifests[kind].ids) assertCanonicalParityId(kind, id);
  }
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
