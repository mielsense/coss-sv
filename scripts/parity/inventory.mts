import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

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

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../..");
const matrixPath = join(repositoryRoot, "docs/porting/PARITY-MATRIX.md");
const baselinePath = join(scriptDirectory, "status-baseline.json");
const artifactPath = join(repositoryRoot, "artifacts/parity/reference-inventory.json");
const startMarker = "<!-- parity:start -->";
const endMarker = "<!-- parity:end -->";
const statusOrder: ParityStatus[] = ["missing", "implemented", "reviewed", "approved"];

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
): ParityEntry {
  return {
    id,
    kind,
    sourcePaths: [sourcePath(referenceDirectory, source)],
    targetPaths: [targetPath(root, target)],
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

export function formatMissingReport(entries: ParityEntry[]) {
  const missing = entries.filter(({ status }) => status === "missing");
  const componentCount = missing.filter(({ kind }) => kind === "component").length;
  const docCount = missing.filter(({ kind }) => kind === "doc").length;
  const particleCount = missing.filter(({ kind }) => kind === "particle").length;
  const lines = missing.map((item) => `- ${parityKey(item)}`);

  return [
    "Planned parity work",
    `components: ${componentCount}`,
    `docs: ${docCount}`,
    `particles: ${particleCount}`,
    `total: ${missing.length}`,
    "",
    ...lines,
  ].join("\n");
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

function writeNormalizedArtifact(inventory: ReferenceInventory) {
  mkdirSync(dirname(artifactPath), { recursive: true });
  writeFileSync(artifactPath, `${JSON.stringify(inventory, null, 2)}\n`);
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

function assertPromotedTargetsExist(root: string, entries: ParityEntry[]) {
  for (const item of entries) {
    if (item.status === "missing") continue;
    for (const path of item.targetPaths) {
      if (!existsSync(join(root, path))) {
        throw new Error(`${parityKey(item)} is ${item.status}, but target ${path} does not exist.`);
      }
    }
  }
}

function main() {
  const mode = process.argv[2] ?? "--check";
  const inventory = collectReferenceInventory();

  if (mode === "--write") {
    const baseline = writeBaseline(inventory);
    const completedInventory = withBaseline(inventory, baseline);
    const current = readFileSync(matrixPath, "utf8");
    writeFileSync(matrixPath, updateGeneratedSection(current, renderInventory(completedInventory)));
    writeNormalizedArtifact(completedInventory);
    console.log("Updated the parity status baseline and generated matrix section.");
    return;
  }

  if (mode !== "--check" && mode !== "--require-complete") {
    throw new Error(`Unknown mode ${mode}. Use --check, --write, or --require-complete.`);
  }

  const completedInventory = withBaseline(inventory, loadStatusBaseline());
  assertPromotedTargetsExist(repositoryRoot, completedInventory.entries);
  writeNormalizedArtifact(completedInventory);

  const current = readFileSync(matrixPath, "utf8");
  const expected = updateGeneratedSection(current, renderInventory(completedInventory));
  if (current !== expected) {
    throw new Error("docs/porting/PARITY-MATRIX.md is stale. Run pnpm parity:write.");
  }

  const report = formatMissingReport(completedInventory.entries);
  if (
    mode === "--require-complete" &&
    completedInventory.entries.some(({ status }) => status !== "approved")
  ) {
    console.error(report);
    process.exitCode = 1;
    return;
  }

  console.log("Parity inventory and status baseline are current.");
  console.log(report.split("\n").slice(0, 5).join("\n"));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
