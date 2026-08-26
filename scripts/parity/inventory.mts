import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export type ParityKind = "component" | "doc" | "particle";
export type ParityStatus = "missing" | "implemented";

export type ParityEntry = {
  id: string;
  kind: ParityKind;
  sourcePath: string;
  targetPath: string;
  status: ParityStatus;
};

export type ReferenceInventory = {
  components: ParityEntry[];
  componentDocs: ParityEntry[];
  rootDocs: ParityEntry[];
  hookDocs: ParityEntry[];
  particles: ParityEntry[];
};

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../..");
const matrixPath = join(repositoryRoot, "docs/porting/PARITY-MATRIX.md");
const startMarker = "<!-- parity:start -->";
const endMarker = "<!-- parity:end -->";

function filesWithExtension(directory: string, extension: string) {
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && extname(entry.name) === extension)
    .map((entry) => join(directory, entry.name))
    .sort((left, right) => left.localeCompare(right));
}

function withoutExtension(path: string) {
  return basename(path, extname(path));
}

function entry(
  root: string,
  kind: ParityKind,
  id: string,
  sourcePath: string,
  targetPath: string,
): ParityEntry {
  return {
    id,
    kind,
    sourcePath: relative(root, sourcePath),
    targetPath: relative(root, targetPath),
    status: existsSync(targetPath) ? "implemented" : "missing",
  };
}

export function collectReferenceInventory(root = repositoryRoot): ReferenceInventory {
  const referenceDocs = join(root, "reference/apps/ui/content/docs");
  const referenceUi = join(root, "reference/apps/ui/registry/default/ui");
  const referenceParticles = join(root, "reference/apps/ui/registry/default/particles");

  const components = filesWithExtension(referenceUi, ".tsx").map((sourcePath) => {
    const id = withoutExtension(sourcePath);
    return entry(
      root,
      "component",
      id,
      sourcePath,
      join(root, `packages/ui/src/components/ui/${id}`),
    );
  });

  const componentDocs = filesWithExtension(join(referenceDocs, "components"), ".mdx").map(
    (sourcePath) => {
      const id = withoutExtension(sourcePath);
      return entry(
        root,
        "doc",
        `components/${id}`,
        sourcePath,
        join(root, `apps/ui/content/docs/components/${id}.md`),
      );
    },
  );

  const rootDocs = filesWithExtension(join(referenceDocs, "(root)"), ".mdx").map((sourcePath) => {
    const id = withoutExtension(sourcePath);
    return entry(root, "doc", id, sourcePath, join(root, `apps/ui/content/docs/${id}.md`));
  });

  const hookDocs = filesWithExtension(join(referenceDocs, "hooks"), ".mdx").map((sourcePath) => {
    const id = withoutExtension(sourcePath);
    return entry(
      root,
      "doc",
      `hooks/${id}`,
      sourcePath,
      join(root, `apps/ui/content/docs/hooks/${id}.md`),
    );
  });

  const particles = filesWithExtension(referenceParticles, ".tsx").map((sourcePath) => {
    const id = withoutExtension(sourcePath);
    return entry(
      root,
      "particle",
      id,
      sourcePath,
      join(root, `apps/ui/registry/default/particles/${id}.svelte`),
    );
  });

  return { components, componentDocs, rootDocs, hookDocs, particles };
}

function renderGroup(title: string, entries: ParityEntry[]) {
  const rows = entries.map(
    ({ id, sourcePath, status, targetPath }) =>
      `| \`${id}\` | \`${sourcePath}\` | \`${targetPath}\` | ${status} |`,
  );

  return [
    `## ${title}`,
    "",
    "| ID | Reference | Target | Status |",
    "| --- | --- | --- | --- |",
    ...rows,
  ].join("\n");
}

export function renderInventory(inventory: ReferenceInventory) {
  const groups = [
    renderGroup("Components", inventory.components),
    renderGroup("Component documentation", inventory.componentDocs),
    renderGroup("Root documentation", inventory.rootDocs),
    renderGroup("Hook documentation", inventory.hookDocs),
    renderGroup("Particles", inventory.particles),
  ];

  return [
    "Generated from the pinned local reference. Component, page, and particle identifiers must not be renamed to hide missing work.",
    "",
    ...groups,
  ].join("\n\n");
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

export function expectedMatrix(root = repositoryRoot) {
  const current = readFileSync(join(root, "docs/porting/PARITY-MATRIX.md"), "utf8");
  return updateGeneratedSection(current, renderInventory(collectReferenceInventory(root)));
}

function main() {
  const mode = process.argv[2] ?? "--check";
  const current = readFileSync(matrixPath, "utf8");
  const expected = expectedMatrix();

  if (mode === "--write") {
    writeFileSync(matrixPath, expected);
    console.log("Updated docs/porting/PARITY-MATRIX.md.");
    return;
  }

  if (mode !== "--check") {
    throw new Error(`Unknown mode ${mode}. Use --check or --write.`);
  }

  if (current !== expected) {
    throw new Error("docs/porting/PARITY-MATRIX.md is stale. Run pnpm parity:write.");
  }

  console.log("Parity inventory is current.");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
