import { highlightSource } from "$lib/code/highlight.js";
import type { PageServerLoad } from "./$types";
import source from "./source.txt?raw";

export const load = (async () => ({
  source: await highlightSource(source, "svelte"),
})) satisfies PageServerLoad;
