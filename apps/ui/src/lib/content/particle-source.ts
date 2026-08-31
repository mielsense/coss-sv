import { readFile, realpath, stat } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { type HighlightedSource, highlightSource } from "../code/highlight.js";
import { presentRegistryAliases } from "../registry/present-source-aliases.js";

export type ParticleSourceLoader = (id: string) => Promise<HighlightedSource>;
export type ParticleRegistryDocument = {
  files?: Array<{ content?: string; target?: string }>;
};

const leadingModuleScript =
  /^\s*<script\b(?=[^>]*(?:\bmodule\b|\bcontext\s*=\s*["']module["']))[^>]*>[\s\S]*?<\/script>\s*/;

export function stripParticleMetadata(source: string): string {
  return source.replace(leadingModuleScript, "");
}

function validateParticleId(id: string): void {
  if (!/^p-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    throw new Error(`invalid particle ID ${id}`);
  }
}

export async function highlightRegistryParticleSource(
  id: string,
  document: ParticleRegistryDocument,
): Promise<HighlightedSource> {
  validateParticleId(id);
  const file = document.files?.find(({ target }) => target === `${id}.svelte`);
  if (file?.content === undefined) throw new Error(`particle source ${id} is unavailable`);
  if (Buffer.byteLength(file.content) > 256 * 1024) {
    throw new Error(`particle source ${id} exceeds the source limit`);
  }
  return highlightSource(presentRegistryAliases(stripParticleMetadata(file.content)), "svelte");
}

export function createParticleSourceLoader(particleRoot: string): ParticleSourceLoader {
  return async (id) => {
    validateParticleId(id);

    const canonicalRoot = await realpath(particleRoot);
    const sourcePath = resolve(canonicalRoot, `${id}.svelte`);
    const canonicalSource = await realpath(sourcePath);
    const fromRoot = relative(canonicalRoot, canonicalSource);
    if (fromRoot.startsWith("..") || fromRoot === "") {
      throw new Error(`particle source ${id} escapes the particle root`);
    }
    if (!(await stat(canonicalSource)).isFile()) {
      throw new Error(`particle source ${id} is not a file`);
    }

    return highlightSource(
      presentRegistryAliases(stripParticleMetadata(await readFile(canonicalSource, "utf8"))),
      "svelte",
    );
  };
}
