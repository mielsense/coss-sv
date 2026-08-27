import { defineRegistryItems } from "./registry.js";

export const registryUi = defineRegistryItems([
  {
    name: "separator",
    type: "registry:ui",
    description: "Visually or semantically separates content.",
    dependencies: ["@shardsui/svelte@0.1.0-beta.0"],
    registryDependencies: [],
    files: [
      {
        path: "../../packages/ui/src/components/ui/separator/separator.svelte",
        type: "registry:ui",
      },
      {
        path: "../../packages/ui/src/components/ui/separator/index.ts",
        type: "registry:ui",
      },
    ],
  },
]);
