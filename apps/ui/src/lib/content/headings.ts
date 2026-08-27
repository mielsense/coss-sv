export type DocumentationHeading = {
  id: string;
  text: string;
};

export function documentationHeading(text: string): DocumentationHeading {
  const explicit = /\s+\{#([^}]+)\}\s*$/.exec(text);
  const visibleText = text
    .replace(/\s+\{#[^}]+\}\s*$/, "")
    .replaceAll("`", "")
    .trim();
  const id =
    explicit?.[1] ??
    visibleText
      .normalize("NFKD")
      .replace(/[?'’]/g, "")
      .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();

  return { id, text: visibleText };
}
