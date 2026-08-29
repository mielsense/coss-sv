import { type HighlightedSource, highlightSource } from "../code/highlight.js";
import { createDocumentationHeadingSlugger } from "./headings.js";
import { withoutFencedCode } from "./markdown.js";
import type { ParticleSourceLoader } from "./particle-source.js";

export type PageKind = "root" | "component" | "hook" | "migration" | "changelog";

export type PageMetadata = {
  title: string;
  description: string;
  links?: {
    api?: string;
    doc?: string;
  };
};

export type ApiProperty = {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: string;
};

export type SourcePage = {
  kind: PageKind;
  slug: string;
  source: string;
};

export type PreviewReference = {
  id: string;
  align: "center" | "start" | "end";
  source: HighlightedSource;
};

export type InstallCommands = {
  pnpm: string;
  shadcnSvelte: string;
};

export type TableOfContentsItem = {
  depth: number;
  id: string;
  text: string;
};

export type ContentRecord = {
  api: ApiProperty[];
  codeBlocks: HighlightedSource[];
  installCommands: InstallCommands[];
  kind: PageKind;
  markdown: string;
  metadata: PageMetadata;
  previews: PreviewReference[];
  raw: string;
  slug: string;
  tableOfContents: TableOfContentsItem[];
};

export type CompileDocsOptions = {
  api?: Record<string, ApiProperty[]>;
  order: string[];
  pages: SourcePage[];
  particleIds: ReadonlySet<string>;
  loadParticleSource?: ParticleSourceLoader;
};

export type CompiledDocs = {
  bySlug: ReadonlyMap<string, ContentRecord>;
  pages: ContentRecord[];
};

type ParsedFrontmatter = {
  body: string;
  metadata: PageMetadata;
};

function parseScalar(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFrontmatter(source: string, slug: string): ParsedFrontmatter {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!match?.[1]) throw new Error(`documentation page ${slug} is missing frontmatter`);

  const values = new Map<string, string>();
  let section = "";
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const entry = /^(\s*)([\w-]+):\s*(.*)$/.exec(line);
    if (!entry?.[2]) throw new Error(`invalid frontmatter in ${slug}: ${line}`);
    const indent = entry[1]?.length ?? 0;
    const key = entry[2];
    const value = entry[3] ?? "";
    if (indent === 0 && value === "") {
      section = key;
      continue;
    }
    const path = indent > 0 && section ? `${section}.${key}` : key;
    values.set(path, parseScalar(value));
  }

  const title = values.get("title");
  const description = values.get("description");
  if (!title || !description) {
    throw new Error(`documentation page ${slug} needs title and description frontmatter`);
  }
  const api = values.get("links.api");
  const doc = values.get("links.doc");

  return {
    body: source.slice(match[0].length),
    metadata: {
      title,
      description,
      ...(api || doc ? { links: { ...(api ? { api } : {}), ...(doc ? { doc } : {}) } } : {}),
    },
  };
}

function tableOfContents(markdown: string): TableOfContentsItem[] {
  const slugger = createDocumentationHeadingSlugger();
  return Array.from(withoutFencedCode(markdown).matchAll(/^(#{1,6})\s+(.+)$/gm)).map((match) => {
    const heading = slugger.heading(match[2] ?? "");
    return { depth: match[1]?.length ?? 1, ...heading };
  });
}

function previewReferences(
  markdown: string,
  particleIds: ReadonlySet<string>,
): Array<Omit<PreviewReference, "source">> {
  return Array.from(
    withoutFencedCode(markdown).matchAll(
      /<ComponentPreview\b((?:[^>"']|"[^"]*"|'[^']*')*?)\s*\/?\s*>/g,
    ),
  ).map((match) => {
    const attributes = match[1] ?? "";
    const id = /\bname=["']([^"']+)["']/.exec(attributes)?.[1];
    if (!id) throw new Error("ComponentPreview is missing its particle name");
    if (!particleIds.has(id)) throw new Error(`unknown particle ${id}`);
    const requestedAlign = /\balign=["']([^"']+)["']/.exec(attributes)?.[1] ?? "center";
    if (
      !(["center", "start", "end"] as const).includes(requestedAlign as PreviewReference["align"])
    ) {
      throw new Error(`invalid preview alignment ${requestedAlign} for ${id}`);
    }
    return { align: requestedAlign as PreviewReference["align"], id };
  });
}

function installCommands(markdown: string): InstallCommands[] {
  return Array.from(withoutFencedCode(markdown).matchAll(/<InstallCommand\b([\s\S]*?)\/>/g)).map(
    (match) => {
      const attributes = match[1] ?? "";
      const pnpm = /\bpnpm=["']([^"']+)["']/.exec(attributes)?.[1];
      const shadcnSvelte = /\bshadcnSvelte=["']([^"']+)["']/.exec(attributes)?.[1];
      if (!pnpm || !shadcnSvelte) {
        throw new Error("InstallCommand requires pnpm and shadcnSvelte commands");
      }
      validatePnpmCommand(pnpm);
      validateShadcnSvelteCommand(shadcnSvelte);
      return { pnpm, shadcnSvelte };
    },
  );
}

const reactCommand =
  /(?:^|[\s/])(?:@base-ui\/react|@types\/react|react(?:-dom)?)(?:@[^\s]+)?(?=\s|$)/i;
const otherPackageManager = /(?:^|\s)(?:bun|bunx|npm|npx|yarn)(?=\s|$)/i;

function validatePnpmCommand(command: string): void {
  const normalized = command.trim();
  if (!/^pnpm(?:\s|$)/i.test(normalized) || otherPackageManager.test(normalized)) {
    throw new Error("pnpm command must use pnpm");
  }
  if (reactCommand.test(command)) throw new Error("pnpm command must not install React");
}

function validateShadcnSvelteCommand(command: string): void {
  const normalized = command.trim();
  if (!/^pnpm(?:\s|$)/i.test(normalized) || otherPackageManager.test(normalized)) {
    throw new Error("shadcn-svelte command must use pnpm");
  }
  if (!/(?:^|\s)shadcn-svelte(?:@[^\s]+)?(?=\s|$)/i.test(normalized)) {
    throw new Error("shadcn-svelte command must use shadcn-svelte");
  }
  if (reactCommand.test(normalized)) {
    throw new Error("shadcn-svelte command must not install React");
  }
}

async function codeBlocks(markdown: string): Promise<HighlightedSource[]> {
  const blocks = Array.from(markdown.matchAll(/^```([^\s`]*)[^\n]*\n([\s\S]*?)\n```\s*$/gm));
  return Promise.all(
    blocks.map(async (match) => {
      const language = match[1] || "text";
      const raw = match[2] ?? "";
      if (
        language === "tsx" ||
        language === "jsx" ||
        /\bfrom\s+["'](?:react|react-dom|next\/|@base-ui\/react)/.test(raw)
      ) {
        throw new Error("React source is not allowed in Svelte documentation");
      }
      return highlightSource(raw, language);
    }),
  );
}

function validateApi(slug: string, api: readonly ApiProperty[]): ApiProperty[] {
  return api.map((property) => {
    if (!property.name || !property.type || !property.description) {
      throw new Error(`invalid API metadata for ${slug}`);
    }
    return { ...property };
  });
}

export async function compileDocs(options: CompileDocsOptions): Promise<CompiledDocs> {
  const sources = new Map<string, SourcePage>();
  for (const page of options.pages) {
    if (sources.has(page.slug)) throw new Error(`duplicate documentation slug ${page.slug}`);
    sources.set(page.slug, page);
  }
  if (new Set(options.order).size !== options.order.length) {
    throw new Error("documentation metadata order contains duplicate slugs");
  }

  const pages = await Promise.all(
    options.order.map(async (slug): Promise<ContentRecord> => {
      const page = sources.get(slug);
      if (!page) throw new Error(`documentation metadata references missing slug ${slug}`);
      const { body, metadata } = parseFrontmatter(page.source, slug);
      const previewDescriptors = previewReferences(body, options.particleIds);
      if (previewDescriptors.length > 0 && !options.loadParticleSource) {
        throw new Error(`documentation compiler needs a particle source loader for ${slug}`);
      }
      const previews = await Promise.all(
        previewDescriptors.map(async (preview) => ({
          ...preview,
          source: await (options.loadParticleSource as ParticleSourceLoader)(preview.id),
        })),
      );
      return {
        api: validateApi(slug, options.api?.[slug] ?? []),
        codeBlocks: await codeBlocks(body),
        installCommands: installCommands(body),
        kind: page.kind,
        markdown: body,
        metadata,
        previews,
        raw: page.source,
        slug,
        tableOfContents: tableOfContents(body),
      };
    }),
  );

  if (pages.length !== sources.size) {
    const omitted = [...sources.keys()].filter((slug) => !options.order.includes(slug));
    throw new Error(`documentation metadata order omits: ${omitted.join(", ")}`);
  }

  return { bySlug: new Map(pages.map((page) => [page.slug, page])), pages };
}
