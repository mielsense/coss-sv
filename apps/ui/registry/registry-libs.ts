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
  {
    name: "segmented-control",
    type: "registry:lib",
    description: "Shares COSS segmented-control sizing and state styles across primitives.",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "../../packages/ui/src/lib/segmented-control.ts",
        type: "registry:lib",
      },
    ],
  },
]);
