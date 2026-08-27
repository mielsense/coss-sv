import type { PreprocessorGroup } from "svelte/compiler";

export const documentationComponentNames = [
  "ApiTable",
  "Callout",
  "CodeSource",
  "ComponentPreview",
  "ComponentStatus",
  "FileTree",
  "InstallCommand",
  "LinkedHeading",
  "PageNavigation",
] as const;

export function documentationComponents(): PreprocessorGroup {
  return {
    name: "coss-sv-documentation-components",
    markup({ content, filename }) {
      if (!filename?.endsWith(".svx")) return;
      const imports = `import { ${documentationComponentNames.join(", ")} } from "$lib/content/components";`;
      return {
        code: `<script lang="ts">\n${imports}\n</script>\n\n${content}`,
        filename,
      };
    },
  };
}
