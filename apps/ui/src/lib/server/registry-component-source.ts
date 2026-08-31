import { highlightSource } from "../code/highlight.js";
import type { ComponentSourceBundle } from "../content/component-source.js";
import { presentRegistryAliases } from "../registry/present-source-aliases.js";

export type RegistryDocument = {
  dependencies?: string[];
  files?: Array<{ content?: string; target?: string; type?: string }>;
  registryDependencies?: string[];
};

export type RegistryDocumentLoader = (name: string) => Promise<RegistryDocument>;

const maximumFiles = 128;
const maximumSourceBytes = 2 * 1024 * 1024;
const highlightConcurrency = 4;
const validRegistryName = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function displayPath(target: string, type: string): string {
  if (type === "registry:lib") return `lib/${target}`;
  if (type === "registry:hook") return `hooks/${target}`;
  return `components/ui/${target}`;
}

async function mapConcurrent<Input, Output>(
  values: readonly Input[],
  concurrency: number,
  transform: (value: Input, index: number) => Promise<Output>,
): Promise<Output[]> {
  const output = new Array<Output>(values.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      const value = values[index];
      if (value !== undefined) output[index] = await transform(value, index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, () => worker()));
  return output;
}

export async function loadRegistryComponentSource(
  components: readonly string[],
  loadDocument: RegistryDocumentLoader,
): Promise<ComponentSourceBundle> {
  const dependencies = new Set<string>();
  const files = new Map<string, { content: string; type: string }>();
  const visited = new Set<string>();
  let sourceBytes = 0;

  async function visit(name: string): Promise<void> {
    if (!validRegistryName.test(name)) throw new Error("Invalid registry item name");
    if (visited.has(name)) return;
    visited.add(name);

    const document = await loadDocument(name);
    for (const dependency of document.dependencies ?? []) dependencies.add(dependency);
    for (const file of document.files ?? []) {
      if (!file.target || file.content === undefined) {
        throw new Error("Registry source contains an incomplete file");
      }
      const previous = files.get(file.target);
      if (previous) sourceBytes -= Buffer.byteLength(previous.content);
      sourceBytes += Buffer.byteLength(file.content);
      files.set(file.target, { content: file.content, type: file.type ?? "registry:ui" });
      if (files.size > maximumFiles || sourceBytes > maximumSourceBytes) {
        throw new Error("Registry source exceeds the manual-installation limit");
      }
    }
    for (const dependency of document.registryDependencies ?? []) {
      await visit(dependency.replace(/^\.\//, "").replace(/\.json$/, ""));
    }
  }

  for (const component of components) await visit(component);
  if (files.size === 0) throw new Error("Registry source has no files");

  const sourceFiles = [...files.entries()];
  return {
    dependencies: [...dependencies].sort(),
    files: await mapConcurrent(sourceFiles, highlightConcurrency, async ([target, file]) => ({
      path: displayPath(target, file.type),
      source: await highlightSource(
        presentRegistryAliases(file.content),
        target.endsWith(".svelte") ? "svelte" : "typescript",
      ),
    })),
  };
}
