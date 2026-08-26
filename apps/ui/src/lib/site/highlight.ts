import { codeToHtml } from "shiki";

export async function highlightCode(code: string, language?: string | null): Promise<string> {
  const html = await codeToHtml(code, {
    defaultColor: false,
    lang: language ?? "text",
    themes: {
      dark: "github-dark",
      light: "github-light",
    },
  });

  return `{@html ${JSON.stringify(html)}}`;
}
