export type DocumentationHeading = {
  id: string;
  text: string;
};

function headingParts(text: string): { baseId: string; text: string } {
  const explicit = /\s+\{#([^}]+)\}\s*$/.exec(text);
  const visibleText = text
    .replace(/\s+\{#[^}]+\}\s*$/, "")
    .replaceAll("`", "")
    .trim();
  const baseId =
    explicit?.[1] ??
    visibleText
      .normalize("NFKD")
      .replace(/[?'’]/g, "")
      .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();

  return { baseId, text: visibleText };
}

export type DocumentationHeadingSlugger = {
  heading(text: string): DocumentationHeading;
};

export function createDocumentationHeadingSlugger(): DocumentationHeadingSlugger {
  const used = new Set<string>();

  return {
    heading(text) {
      const { baseId, text: visibleText } = headingParts(text);
      let id = baseId;
      let duplicate = 0;
      while (used.has(id)) {
        duplicate += 1;
        id = `${baseId}-${duplicate}`;
      }
      used.add(id);
      return { id, text: visibleText };
    },
  };
}

export function documentationHeading(text: string): DocumentationHeading {
  return createDocumentationHeadingSlugger().heading(text);
}
