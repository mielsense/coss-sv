import {
  documentationHighlighter,
  documentationThemes,
  resolveDocumentationLanguage,
} from "../code/shiki.js";

export async function highlightCode(code: string, language?: string | null): Promise<string> {
  const highlighter = await documentationHighlighter;
  const html = highlighter.codeToHtml(code, {
    defaultColor: false,
    lang: resolveDocumentationLanguage(language),
    themes: documentationThemes,
  });

  return `<div class="docs-code-block">{@html ${JSON.stringify(html)}}<CopyButton value={${JSON.stringify(code)}} /></div>`;
}
