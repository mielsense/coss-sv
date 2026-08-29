import ts from "typescript";

const packageImportPattern = /(^[\t ]*)import\s*\{([^}]*)\}\s*from\s*["']@coss-sv\/ui["'];/gm;
const directHugeiconsPattern =
  /(^[\t ]*)import\s*\{\s*HugeiconsIcon\s*\}\s*from\s*["']@hugeicons\/svelte["'];/gm;
const segmentedControlImportPattern = /["']@coss-sv\/ui\/lib\/segmented-control["']/g;
const dateFormatImportPattern = /["']\.\.\/lib\/date-format\.js["']/g;

type UiExportOwner = {
  kind: "default" | "named" | "namespace";
  target: string;
};

function localTarget(moduleSpecifier: string): string | undefined {
  const component = /^\.\/components\/ui\/([^/]+)\/index\.js$/.exec(moduleSpecifier)?.[1];
  if (component) return `$lib/components/ui/${component}/index.js`;
  if (moduleSpecifier === "./lib/hugeicons-icon.svelte") return "$lib/hugeicons-icon.svelte";
  if (moduleSpecifier === "./lib/segmented-control.js") return "$lib/segmented-control.js";
  if (moduleSpecifier === "./lib/utils.js") return "$lib/utils.js";
  return undefined;
}

export function createUiExportMap(packageIndexSource: string): ReadonlyMap<string, UiExportOwner> {
  const sourceFile = ts.createSourceFile(
    "packages/ui/src/index.ts",
    packageIndexSource,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const exports = new Map<string, UiExportOwner>();

  for (const statement of sourceFile.statements) {
    if (!ts.isExportDeclaration(statement) || !statement.moduleSpecifier) continue;
    if (!ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const target = localTarget(statement.moduleSpecifier.text);
    if (!target || !statement.exportClause) continue;

    const owners: Array<[string, UiExportOwner]> = ts.isNamespaceExport(statement.exportClause)
      ? [[statement.exportClause.name.text, { kind: "namespace", target }]]
      : statement.exportClause.elements.map((element) => [
          element.name.text,
          {
            kind: element.propertyName?.text === "default" ? "default" : "named",
            target,
          },
        ]);
    for (const [name, owner] of owners) {
      const existing = exports.get(name);
      if (existing && (existing.target !== owner.target || existing.kind !== owner.kind)) {
        throw new Error(
          `UI export ${name} is owned by both ${existing.kind} ${existing.target} and ${owner.kind} ${owner.target}.`,
        );
      }
      exports.set(name, owner);
    }
  }

  return exports;
}

function renderImport(indent: string, specifiers: readonly string[], target: string): string {
  const inline = `${indent}import { ${specifiers.join(", ")} } from "${target}";`;
  if (inline.length <= 100) return inline;
  return `${indent}import {\n${specifiers.map((specifier) => `${indent}  ${specifier},`).join("\n")}\n${indent}} from "${target}";`;
}

function rewritePackageImport(
  statement: string,
  indent: string,
  exports: ReadonlyMap<string, UiExportOwner>,
): string {
  const sourceFile = ts.createSourceFile(
    "particle-import.ts",
    statement.trimStart(),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const declaration = sourceFile.statements[0];
  if (!declaration || !ts.isImportDeclaration(declaration)) {
    throw new Error(`Could not parse particle package import: ${statement}`);
  }
  const bindings = declaration.importClause?.namedBindings;
  if (!bindings || !ts.isNamedImports(bindings)) {
    throw new Error(`Particle package imports must use named bindings: ${statement}`);
  }

  const groups = new Map<string, { defaults: string[]; named: string[]; namespaces: string[] }>();
  for (const element of bindings.elements) {
    const exportedName = element.propertyName?.text ?? element.name.text;
    const owner = exports.get(exportedName);
    if (!owner)
      throw new Error(`No consumer-local module owns @coss-sv/ui export ${exportedName}.`);
    const group = groups.get(owner.target) ?? { defaults: [], named: [], namespaces: [] };
    if (owner.kind === "namespace") {
      group.namespaces.push(`${element.isTypeOnly ? "type " : ""}* as ${element.name.text}`);
    } else if (owner.kind === "default") {
      group.defaults.push(`${element.isTypeOnly ? "type " : ""}${element.name.text}`);
    } else {
      group.named.push(element.getText(sourceFile));
    }
    groups.set(owner.target, group);
  }

  return [...groups]
    .flatMap(([target, group]) => [
      ...group.namespaces.map((specifier) => `${indent}import ${specifier} from "${target}";`),
      ...group.defaults.map((specifier) => `${indent}import ${specifier} from "${target}";`),
      ...(group.named.length > 0 ? [renderImport(indent, group.named, target)] : []),
    ])
    .join("\n");
}

export function transformParticleSource(
  source: string,
  exports: ReadonlyMap<string, UiExportOwner>,
): string {
  const transformed = source
    .replace(packageImportPattern, (statement, indent: string) =>
      rewritePackageImport(statement, indent, exports),
    )
    .replace(
      directHugeiconsPattern,
      (_statement, indent: string) =>
        `${indent}import HugeiconsIcon from "$lib/hugeicons-icon.svelte";`,
    )
    .replace(segmentedControlImportPattern, '"$lib/segmented-control.js"')
    .replace(dateFormatImportPattern, '"$lib/date-format.js"');

  if (transformed.includes("@coss-sv/ui") || transformed.includes("@hugeicons/svelte")) {
    throw new Error("Particle source retained a package-only UI or renderer import.");
  }
  return transformed;
}
