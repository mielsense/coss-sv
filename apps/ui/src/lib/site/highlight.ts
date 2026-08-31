import { documentationHighlighter, resolveDocumentationLanguage } from "../code/shiki.js";

export async function highlightCode(code: string, language?: string | null): Promise<string> {
  const highlighter = await documentationHighlighter;
  const html = highlighter.codeToHtml(code, {
    defaultColor: false,
    lang: resolveDocumentationLanguage(language),
    themes: {
      dark: "github-dark",
      light: "github-light",
    },
  });

  return `<div class="docs-code-block">{@html ${JSON.stringify(html)}}<CopyButton value={${JSON.stringify(code)}} /></div>`;
}
