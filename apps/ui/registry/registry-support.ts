import { defineRegistryItems } from "./registry.js";

export const registrySupport = defineRegistryItems([
  {
    name: "particle-metadata",
    type: "registry:file",
    description: "Validates documentation preview metadata.",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "src/lib/registry/particle-metadata.ts",
        type: "registry:file",
        target: "src/lib/registry/particle-metadata.ts",
      },
    ],
  },
]);
