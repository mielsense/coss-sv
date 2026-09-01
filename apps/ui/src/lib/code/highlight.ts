import { documentationHighlighter, resolveDocumentationLanguage } from "./shiki.js";

export type HighlightedThemeStyle = {
  color: string;
  fontStyle: "italic" | "normal";
  fontWeight: "bold" | "normal";
  textDecoration: "none" | "underline";
};

export type HighlightedTokenStyle = {
  dark: HighlightedThemeStyle;
  light: HighlightedThemeStyle;
};

export type HighlightedToken = readonly [content: string, style: number];

export type HighlightedSource = {
  language: string;
  lines: readonly (readonly HighlightedToken[])[];
  palette: readonly HighlightedTokenStyle[];
  raw: string;
};

function tokenStyle(
  style: { color?: string; fontStyle?: number } | undefined,
): HighlightedThemeStyle {
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
  const palette: HighlightedTokenStyle[] = [];
  const styleIndexes = new Map<string, number>();

  return {
    language,
    lines: lines.map((line) =>
      line.map((token) => {
        const style = {
          dark: tokenStyle(token.variants.dark),
          light: tokenStyle(token.variants.light),
        };
        const key = JSON.stringify(style);
        let styleIndex = styleIndexes.get(key);
        if (styleIndex === undefined) {
          styleIndex = palette.length;
          styleIndexes.set(key, styleIndex);
          palette.push(style);
        }
        return [token.content, styleIndex] as const;
      }),
    ),
    palette,
    raw,
  };
}
