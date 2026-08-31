import { defineRegistryItems } from "./registry.js";

export const registryLibs = defineRegistryItems([
  {
    name: "change-event-details",
    type: "registry:lib",
    description: "Creates cancelable COSS change callback details from native events.",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "../../packages/ui/src/lib/change-event-details.ts",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "date-format",
    type: "registry:lib",
    description: "Formats COSS date-picker labels with stable ordinal dates.",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "registry/default/lib/date-format.ts",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "demo-delay",
    type: "registry:lib",
    description: "Cancels simulated form delays when a particle preview is destroyed.",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "registry/default/lib/demo-delay.ts",
        type: "registry:lib",
      },
    ],
  },
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
  {
    name: "selection-change-context",
    type: "registry:lib",
    description: "Shares native selection events with COSS-compatible root change callbacks.",
    dependencies: [],
    registryDependencies: ["local:change-event-details"],
    files: [
      {
        path: "../../packages/ui/src/lib/selection-change-context.ts",
        type: "registry:lib",
      },
    ],
  },
]);
