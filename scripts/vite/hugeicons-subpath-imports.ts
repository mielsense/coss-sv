const packageName = "@hugeicons/core-free-icons";
const iconModules: Readonly<Record<string, string>> = {
  LayersIcon: "Layers01Icon",
};
const namedImport = new RegExp(
  `^[\\t ]*import\\s*\\{([^}]*)\\}\\s*from\\s*["']${packageName}["'];?`,
  "gm",
);
const sourceFile = /\.(?:[cm]?[jt]sx?|svelte|svx)$/;
const iconExport = /^[A-Za-z_$][\w$]*$/;

export function rewriteHugeiconsImports(source: string): string {
  return source.replace(namedImport, (statement, namesSource: string) => {
    const names = namesSource
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);
    if (names.length === 0 || names.some((name) => !iconExport.test(name))) return statement;
    return names
      .map((name) => `import ${name} from "${packageName}/${iconModules[name] ?? name}";`)
      .join("\n");
  });
}

/** Keeps Vite from loading Hugeicons' multi-megabyte root barrel in development and tests. */
export function hugeiconsSubpathImports() {
  return {
    enforce: "pre" as const,
    name: "coss-hugeicons-subpath-imports",
    transform(source: string, id: string) {
      if (!sourceFile.test(id) || id.includes("/node_modules/") || !source.includes(packageName)) {
        return null;
      }
      const code = rewriteHugeiconsImports(source);
      return code === source ? null : { code, map: null };
    },
  };
}
