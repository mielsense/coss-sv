const displayedAliases = {
  components: "$lib/components",
  hooks: "$lib/hooks",
  lib: "$lib",
  ui: "$lib/components/ui",
  utils: "$lib/utils",
} as const;

export function presentRegistryAliases(source: string): string {
  return source
    .replaceAll("$COMPONENTS$", displayedAliases.components)
    .replaceAll("$HOOKS$", displayedAliases.hooks)
    .replaceAll("$UI$", displayedAliases.ui)
    .replaceAll("$UTILS$", displayedAliases.utils)
    .replaceAll("$LIB$", displayedAliases.lib);
}
