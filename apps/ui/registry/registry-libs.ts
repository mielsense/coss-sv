import { defineRegistryItems } from "./registry.js";

export const registryLibs = defineRegistryItems([
  {
    name: "hugeicons-icon",
    type: "registry:lib",
    description: "Renders official Hugeicons data during SSR and client hydration.",
    dependencies: ["@hugeicons/core-free-icons@4.3.0"],
    registryDependencies: [],
    files: [
      {
        path: "../../packages/ui/src/lib/hugeicons-icon.svelte",
        type: "registry:lib",
      },
    ],
  },
]);
