import { readFile, realpath, stat } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { type HighlightedSource, highlightSource } from "../code/highlight.js";

export type ParticleSourceLoader = (id: string) => Promise<HighlightedSource>;

export function createParticleSourceLoader(particleRoot: string): ParticleSourceLoader {
  return async (id) => {
    if (!/^p-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      throw new Error(`invalid particle ID ${id}`);
    }

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

    return highlightSource(await readFile(canonicalSource, "utf8"), "svelte");
  };
}
