import { defineRegistryItems } from "./registry.js";

export const registryHooks = defineRegistryItems([
  {
    name: "use-media-query",
    type: "registry:hook",
    description: "Creates reactive media queries from breakpoint shorthand or CSS queries.",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "registry/default/hooks/use-media-query.svelte.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-copy-to-clipboard",
    type: "registry:hook",
    description: "Copies text and exposes temporary success feedback.",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "registry/default/hooks/use-copy-to-clipboard.svelte.ts",
        type: "registry:hook",
      },
    ],
  },
]);
