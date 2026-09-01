export type PackageManager = "bun" | "npm" | "pnpm" | "yarn";

export type PackageManagerCommand = {
  command: string;
  value: PackageManager;
};

export function shadcnInstallCommands(registryTargets: string): readonly PackageManagerCommand[] {
  return [
    { command: `bunx --bun shadcn-svelte@latest add ${registryTargets}`, value: "bun" },
    { command: `npx shadcn-svelte@latest add ${registryTargets}`, value: "npm" },
    { command: `pnpm dlx shadcn-svelte@latest add ${registryTargets}`, value: "pnpm" },
    { command: `yarn dlx shadcn-svelte@latest add ${registryTargets}`, value: "yarn" },
  ];
}

export function dependencyInstallCommands(
  dependencies: readonly string[],
): readonly PackageManagerCommand[] {
  const targets = dependencies.join(" ");
  return [
    { command: `bun add ${targets}`, value: "bun" },
    { command: `npm install ${targets}`, value: "npm" },
    { command: `pnpm add ${targets}`, value: "pnpm" },
    { command: `yarn add ${targets}`, value: "yarn" },
  ];
}
