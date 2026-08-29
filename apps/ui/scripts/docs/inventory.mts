import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export type DocsLane = "D4" | "D5" | "D6" | "D7" | "D8" | "D9" | "D10";

export type DocsOwnership = {
  particle: string;
  primaryPage: string;
  consumingPages: string[];
  componentImports: string[];
  implementationLane: DocsLane;
  sourcePath: string;
  targetPath: string;
};

export type DocsInventory = {
  version: 1;
  counts: {
    componentPages: number;
    hookPages: number;
    particles: number;
    registryComponents: number;
    rootPages: number;
  };
  ownership: DocsOwnership[];
};

type CollectDocsInventoryOptions = {
  referenceRoot?: string;
  repositoryRoot?: string;
};

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultRepositoryRoot = resolve(scriptDirectory, "../../../..");

const lanePages = {
  D4: ["accordion", "collapsible", "tabs", "separator", "frame", "card", "empty", "skeleton"],
  D5: [
    "button",
    "toggle",
    "toggle-group",
    "checkbox",
    "checkbox-group",
    "radio-group",
    "switch",
    "slider",
  ],
  D6: [
    "input",
    "label",
    "textarea",
    "field",
    "fieldset",
    "form",
    "group",
    "input-group",
    "number-field",
    "otp-field",
  ],
  D7: ["dialog", "alert-dialog", "sheet", "drawer", "popover", "preview-card", "tooltip"],
  D8: ["autocomplete", "combobox", "select", "command", "menu", "context-menu", "toolbar"],
  D9: [
    "calendar",
    "date-picker",
    "pagination",
    "breadcrumb",
    "table",
    "scroll-area",
    "segmented-control",
  ],
  D10: ["alert", "avatar", "badge", "kbd", "meter", "progress", "spinner", "toast"],
} as const satisfies Record<DocsLane, readonly string[]>;

const pageLane = new Map<string, DocsLane>(
  Object.entries(lanePages).flatMap(([lane, pages]) =>
    pages.map((page) => [`components/${page}`, lane as DocsLane] as const),
  ),
);

function normalizedPath(path: string): string {
  return path.replaceAll("\\", "/");
}

function withoutExtension(path: string): string {
  return basename(path, extname(path));
}

function filesWithExtension(directory: string, extension: string): string[] {
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && extname(entry.name) === extension)
    .map((entry) => join(directory, entry.name))
    .sort((left, right) => left.localeCompare(right));
}

function findReferenceRoot(repositoryRoot: string, configured?: string): string {
  const candidates = [configured, join(repositoryRoot, "reference")].filter(
    (candidate): candidate is string => Boolean(candidate),
  );
  const reference = candidates.find((candidate) =>
    existsSync(join(candidate, "apps/ui/registry/default/particles")),
  );
  if (!reference) {
    throw new Error(
      "Pinned COSS reference not found. Set COSS_REFERENCE_ROOT to the reference root.",
    );
  }
  return resolve(reference);
}

function pageOrder(directory: string, prefix: "" | "components/" | "hooks/"): string[] {
  const metadata = JSON.parse(readFileSync(join(directory, "meta.json"), "utf8")) as {
    pages?: unknown;
  };
  if (!Array.isArray(metadata.pages) || metadata.pages.some((page) => typeof page !== "string")) {
    throw new Error(`Invalid documentation page order in ${normalizedPath(directory)}/meta.json.`);
  }
  return metadata.pages.map((page) => `${prefix}${page}`);
}

function previewReferences(source: string): string[] {
  return Array.from(source.matchAll(/<ComponentPreview\b((?:[^>"']|"[^"]*"|'[^']*')*?)\s*\/?\s*>/g))
    .flatMap((match) => {
      const name = /\bname=["']([^"']+)["']/.exec(match[1] ?? "")?.[1];
      return name ? [name] : [];
    })
    .filter((name) => name.startsWith("p-"));
}

function particleComponentImports(path: string): string[] {
  const source = readFileSync(path, "utf8");
  const components = new Set<string>();
  for (const match of source.matchAll(
    /(?:from\s*|import\s*)["']@\/registry\/default\/ui\/([^"']+)["']/g,
  )) {
    if (match[1]) components.add(withoutExtension(match[1]));
  }
  if (source.includes('from "@/registry/default/lib/segmented-control"')) {
    components.add("segmented-control");
  }
  return [...components].sort((left, right) => left.localeCompare(right));
}

function particlePrefix(particle: string): string {
  const match = /^p-(.+)-\d+$/.exec(particle);
  if (!match?.[1]) throw new Error(`Particle ID does not end in a numeric suffix: ${particle}`);
  return match[1];
}

export function docsOwnershipPath(repositoryRoot = defaultRepositoryRoot): string {
  return join(repositoryRoot, "docs/porting/docs-ownership.json");
}

export function collectDocsInventory(options: CollectDocsInventoryOptions = {}): DocsInventory {
  const repositoryRoot = resolve(options.repositoryRoot ?? defaultRepositoryRoot);
  const referenceRoot = findReferenceRoot(
    repositoryRoot,
    options.referenceRoot ?? process.env.COSS_REFERENCE_ROOT?.trim(),
  );
  const docsRoot = join(referenceRoot, "apps/ui/content/docs");
  const componentDocsRoot = join(docsRoot, "components");
  const rootDocsRoot = join(docsRoot, "(root)");
  const hookDocsRoot = join(docsRoot, "hooks");
  const particlesRoot = join(referenceRoot, "apps/ui/registry/default/particles");
  const registryComponentsRoot = join(referenceRoot, "apps/ui/registry/default/ui");

  const componentPages = pageOrder(componentDocsRoot, "components/");
  const rootPages = pageOrder(rootDocsRoot, "");
  const hookPages = pageOrder(hookDocsRoot, "hooks/");
  const orderedPages = [...componentPages, ...rootPages, ...hookPages];
  const pageFiles = new Map<string, string>();

  for (const page of componentPages) {
    pageFiles.set(page, join(componentDocsRoot, `${page.slice("components/".length)}.mdx`));
  }
  for (const page of rootPages) pageFiles.set(page, join(rootDocsRoot, `${page}.mdx`));
  for (const page of hookPages) {
    pageFiles.set(page, join(hookDocsRoot, `${page.slice("hooks/".length)}.mdx`));
  }

  for (const [page, path] of pageFiles) {
    if (!existsSync(path))
      throw new Error(`Documentation metadata references a missing page: ${page}`);
  }

  const particles = filesWithExtension(particlesRoot, ".tsx");
  const particleIds = new Set(particles.map(withoutExtension));
  const consumers = new Map<string, Set<string>>();
  for (const page of orderedPages) {
    const path = pageFiles.get(page);
    if (!path) throw new Error(`Missing source path for documentation page: ${page}`);
    for (const particle of previewReferences(readFileSync(path, "utf8"))) {
      if (!particleIds.has(particle)) {
        throw new Error(`${page} references unknown particle ${particle}.`);
      }
      const pages = consumers.get(particle) ?? new Set<string>();
      pages.add(page);
      consumers.set(particle, pages);
    }
  }

  const pageRank = new Map(orderedPages.map((page, index) => [page, index]));
  const componentPageSet = new Set(componentPages);
  const ownership = particles.map((sourcePath): DocsOwnership => {
    const particle = withoutExtension(sourcePath);
    const explicitConsumers = [...(consumers.get(particle) ?? [])].sort(
      (left, right) =>
        (pageRank.get(left) ?? Number.POSITIVE_INFINITY) -
        (pageRank.get(right) ?? Number.POSITIVE_INFINITY),
    );
    const fallbackPage = `components/${particlePrefix(particle)}`;
    const primaryPage = explicitConsumers[0] ?? fallbackPage;
    if (explicitConsumers.length === 0 && !componentPageSet.has(fallbackPage)) {
      throw new Error(`Cannot assign unreferenced particle ${particle} to a component page.`);
    }
    const implementationLane = pageLane.get(primaryPage);
    if (!implementationLane) {
      throw new Error(`No documentation implementation lane owns ${primaryPage} for ${particle}.`);
    }

    return {
      particle,
      primaryPage,
      consumingPages: explicitConsumers,
      componentImports: particleComponentImports(sourcePath),
      implementationLane,
      sourcePath: normalizedPath(join("reference", relative(referenceRoot, sourcePath))),
      targetPath: `apps/ui/registry/default/particles/${particle}.svelte`,
    };
  });

  return {
    version: 1,
    counts: {
      componentPages: componentPages.length,
      hookPages: hookPages.length,
      particles: particles.length,
      registryComponents: filesWithExtension(registryComponentsRoot, ".tsx").length,
      rootPages: rootPages.length,
    },
    ownership,
  };
}

export function serializeDocsOwnership(inventory: DocsInventory): string {
  const inlineArrays = new Map<string, { prefixLength: number; values: readonly string[] }>();
  const ownership = inventory.ownership.map((entry, index) => {
    const consumingPages = `__DOCS_OWNERSHIP_CONSUMERS_${index}__`;
    const componentImports = `__DOCS_OWNERSHIP_IMPORTS_${index}__`;
    inlineArrays.set(consumingPages, {
      prefixLength: '      "consumingPages": '.length,
      values: entry.consumingPages,
    });
    inlineArrays.set(componentImports, {
      prefixLength: '      "componentImports": '.length,
      values: entry.componentImports,
    });

    return { ...entry, consumingPages, componentImports };
  });
  let output = JSON.stringify({ ...inventory, ownership }, null, 2);

  for (const [placeholder, { prefixLength, values }] of inlineArrays) {
    const inlineValues = `[${values.map((value) => JSON.stringify(value)).join(", ")}]`;
    const serializedValues =
      prefixLength + inlineValues.length > 100
        ? `[\n${values.map((value) => `        ${JSON.stringify(value)}`).join(",\n")}\n      ]`
        : inlineValues;
    output = output.replace(JSON.stringify(placeholder), serializedValues);
  }

  return `${output}\n`;
}

function runCli(): void {
  const repositoryRoot = defaultRepositoryRoot;
  const inventory = collectDocsInventory({ repositoryRoot });
  const output = serializeDocsOwnership(inventory);
  const path = docsOwnershipPath(repositoryRoot);
  const check = process.argv.includes("--check");
  const write = process.argv.includes("--write");

  if (check) {
    if (!existsSync(path) || readFileSync(path, "utf8") !== output) {
      throw new Error(
        "docs/porting/docs-ownership.json is stale. Run docs inventory with --write.",
      );
    }
    process.stdout.write(
      `Documentation ownership is current for ${inventory.counts.particles} particles.\n`,
    );
    return;
  }

  if (write) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, output);
    process.stdout.write(
      `Wrote documentation ownership for ${inventory.counts.particles} particles.\n`,
    );
    return;
  }

  process.stdout.write(output);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) runCli();
