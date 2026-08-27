import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  type CompiledDocs,
  compileDocs,
  type PageKind,
  type SourcePage,
} from "../../src/lib/content/compiler.js";

type CompileDocumentationTreeOptions = {
  contentRoot: string;
  ownershipPath: string;
};

type OwnershipFile = {
  ownership?: Array<{ particle?: unknown }>;
};

type PageGroup = {
  directory: string;
  kind(slug: string): PageKind;
  route(slug: string): string;
};

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "../..");
const repositoryRoot = resolve(appRoot, "../..");

const groups: readonly PageGroup[] = [
  {
    directory: "(root)",
    kind: (slug) =>
      slug === "changelog" ? "changelog" : slug.includes("migration") ? "migration" : "root",
    route: (slug) => (slug === "index" ? "" : slug),
  },
  {
    directory: "components",
    kind: () => "component",
    route: (slug) => `components/${slug}`,
  },
  {
    directory: "hooks",
    kind: () => "hook",
    route: (slug) => `hooks/${slug}`,
  },
];

function metadataOrder(path: string): string[] {
  const metadata = JSON.parse(readFileSync(path, "utf8")) as { pages?: unknown };
  if (!Array.isArray(metadata.pages) || metadata.pages.some((page) => typeof page !== "string")) {
    throw new Error(`invalid documentation metadata order in ${path}`);
  }
  return metadata.pages;
}

function resolvePageSource(directory: string, slug: string): string {
  const candidates = [join(directory, `${slug}.svx`), join(directory, `${slug}.md`)];
  const sourcePath = candidates.find(existsSync);
  if (!sourcePath) throw new Error(`missing documentation source ${join(directory, slug)}`);
  return sourcePath;
}

function particleIds(path: string): Set<string> {
  const parsed = JSON.parse(readFileSync(path, "utf8")) as OwnershipFile;
  if (!Array.isArray(parsed.ownership))
    throw new Error(`invalid documentation ownership file ${path}`);
  const ids = parsed.ownership.map(({ particle }) => particle);
  if (ids.some((particle) => typeof particle !== "string")) {
    throw new Error(`invalid particle ID in documentation ownership file ${path}`);
  }
  return new Set(ids as string[]);
}

export async function compileDocumentationTree(
  options: CompileDocumentationTreeOptions,
): Promise<CompiledDocs> {
  const pages: SourcePage[] = [];
  const order: string[] = [];

  for (const group of groups) {
    const directory = join(options.contentRoot, group.directory);
    for (const sourceSlug of metadataOrder(join(directory, "meta.json"))) {
      const slug = group.route(sourceSlug);
      pages.push({
        kind: group.kind(sourceSlug),
        slug,
        source: readFileSync(resolvePageSource(directory, sourceSlug), "utf8"),
      });
      order.push(slug);
    }
  }

  return compileDocs({ order, pages, particleIds: particleIds(options.ownershipPath) });
}

export function serializeCompiledDocs(compiled: CompiledDocs): string {
  return `${JSON.stringify({ version: 1, pages: compiled.pages }, null, 2)}\n`;
}

async function runCli(): Promise<void> {
  const contentRoot = resolve(
    process.env.COSS_CONTENT_ROOT?.trim() || join(appRoot, "content/docs"),
  );
  const ownershipPath = resolve(
    process.env.COSS_DOCS_OWNERSHIP?.trim() ||
      join(repositoryRoot, "docs/porting/docs-ownership.json"),
  );
  const outputPath = resolve(
    process.env.COSS_COMPILED_DOCS?.trim() ||
      join(appRoot, ".svelte-kit/generated/docs-content.json"),
  );
  const compiled = await compileDocumentationTree({ contentRoot, ownershipPath });
  const output = serializeCompiledDocs(compiled);

  if (process.argv.includes("--write")) {
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, output);
    process.stdout.write(`Compiled ${compiled.pages.length} documentation pages.\n`);
    return;
  }
  if (process.argv.includes("--check")) {
    if (!existsSync(outputPath) || readFileSync(outputPath, "utf8") !== output) {
      throw new Error("compiled documentation is stale; run the compiler with --write");
    }
    process.stdout.write(`Compiled documentation is current for ${compiled.pages.length} pages.\n`);
    return;
  }

  process.stdout.write(output);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await runCli();
