import { codeToHtml } from "shiki";

export type HighlightedSource = {
  highlighted: string;
  language: string;
  raw: string;
};

export async function highlightSource(raw: string, language: string): Promise<HighlightedSource> {
  const highlighted = await codeToHtml(raw, {
    defaultColor: false,
    lang: language,
    themes: {
      dark: "github-dark",
      light: "github-light",
    },
  });

  return { highlighted, language, raw };
}
