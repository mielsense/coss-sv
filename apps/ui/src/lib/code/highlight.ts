import { documentationHighlighter, resolveDocumentationLanguage } from "./shiki.js";

export type HighlightedTokenStyle = {
  color: string;
  fontStyle: "italic" | "normal";
  fontWeight: "bold" | "normal";
  textDecoration: "none" | "underline";
};

export type HighlightedToken = {
  content: string;
  dark: HighlightedTokenStyle;
  light: HighlightedTokenStyle;
};

export type HighlightedSource = {
  language: string;
  lines: readonly (readonly HighlightedToken[])[];
  raw: string;
};

function tokenStyle(
  style: { color?: string; fontStyle?: number } | undefined,
): HighlightedTokenStyle {
  const fontStyle = style?.fontStyle ?? 0;
  return {
    color: style?.color ?? "currentColor",
    fontStyle: fontStyle & 1 ? "italic" : "normal",
    fontWeight: fontStyle & 2 ? "bold" : "normal",
    textDecoration: fontStyle & 4 ? "underline" : "none",
  };
}

export async function highlightSource(raw: string, language: string): Promise<HighlightedSource> {
  const highlighter = await documentationHighlighter;
  const lines = highlighter.codeToTokensWithThemes(raw, {
    lang: resolveDocumentationLanguage(language),
    themes: {
      dark: "github-dark",
      light: "github-light",
    },
  });

  return {
    language,
    lines: lines.map((line) =>
      line.map((token) => ({
        content: token.content,
        dark: tokenStyle(token.variants.dark),
        light: tokenStyle(token.variants.light),
      })),
    ),
    raw,
  };
}
