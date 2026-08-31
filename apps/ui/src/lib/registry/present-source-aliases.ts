const displayedAliases = {
  components: "@/components",
  hooks: "@/hooks",
  lib: "@",
  ui: "@/components/ui",
  utils: "@/utils",
} as const;

export function presentRegistryAliases(source: string): string {
  return source
    .replaceAll("$COMPONENTS$", displayedAliases.components)
    .replaceAll("$HOOKS$", displayedAliases.hooks)
    .replaceAll("$UI$", displayedAliases.ui)
    .replaceAll("$UTILS$", displayedAliases.utils)
    .replaceAll("$LIB$", displayedAliases.lib);
}
