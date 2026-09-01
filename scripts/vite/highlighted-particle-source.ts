import { readFile } from "node:fs/promises";
import type { HighlightedSource } from "../../apps/ui/src/lib/code/highlight.js";
import {
  highlightRegistryParticleSource,
  type ParticleRegistryDocument,
} from "../../apps/ui/src/lib/content/particle-source.js";
import { registryDocumentPath } from "./particle-source-path.mjs";

const query = "coss-particle-source";
const virtualPrefix = "\0coss-sv:particle-source:";
const virtualSuffix = ".js";

type PluginContext = {
  addWatchFile: (id: string) => void;
  resolve: (
    id: string,
    importer?: string,
    options?: { skipSelf?: boolean },
  ) => Promise<{ id: string } | null>;
};

function queriedFilename(id: string): string | undefined {
  const queryIndex = id.indexOf("?");
  if (queryIndex === -1) return;
  const parameters = new URLSearchParams(id.slice(queryIndex + 1));
  return parameters.has(query) ? id.slice(0, queryIndex) : undefined;
}

export function highlightedParticleSource() {
  const cache = new Map<string, Promise<HighlightedSource>>();
  return {
    enforce: "pre" as const,
    name: "coss-sv-highlighted-particle-source",
    async resolveId(this: PluginContext, source: string, importer: string | undefined) {
      const filename = queriedFilename(source);
      if (!filename) return null;
      const resolved = await this.resolve(filename, importer, { skipSelf: true });
      return resolved ? `${virtualPrefix}${encodeURIComponent(resolved.id)}${virtualSuffix}` : null;
    },
    async load(this: PluginContext, id: string) {
      if (!id.startsWith(virtualPrefix) || !id.endsWith(virtualSuffix)) return null;
      const filename = decodeURIComponent(id.slice(virtualPrefix.length, -virtualSuffix.length));
      const registry = registryDocumentPath(filename);
      this.addWatchFile(filename);
      this.addWatchFile(registry.path);
      let sourceRequest = cache.get(registry.path);
      if (!sourceRequest) {
        sourceRequest = readFile(registry.path, "utf8").then((document) =>
          highlightRegistryParticleSource(
            registry.id,
            JSON.parse(document) as ParticleRegistryDocument,
          ),
        );
        cache.set(registry.path, sourceRequest);
        void sourceRequest.catch(() => cache.delete(registry.path));
      }
      const source = await sourceRequest;
      return { code: `export default ${JSON.stringify(source)};`, map: null };
    },
    watchChange() {
      cache.clear();
    },
  };
}
