export const previewThemes = ["light", "dark"] as const;
export const previewAlignments = ["start", "center", "end"] as const;
export const previewWidths = {
  mobile: 390,
  tablet: 768,
  desktop: 1200,
} as const;

export type PreviewTheme = (typeof previewThemes)[number];
export type PreviewAlignment = (typeof previewAlignments)[number];
export type PreviewWidth = keyof typeof previewWidths;

export type PreviewQuery =
  | {
      ok: true;
      align: PreviewAlignment;
      theme: PreviewTheme;
      width: PreviewWidth;
      widthPixels: number;
    }
  | { errors: string[]; ok: false };

export function parsePreviewQuery(parameters: URLSearchParams): PreviewQuery {
  const errors: string[] = [];
  const alignments = parameters.getAll("align");
  const themes = parameters.getAll("theme");
  const widths = parameters.getAll("width");
  const theme = themes.length === 1 ? themes[0] : undefined;
  const width = widths.length === 1 ? widths[0] : undefined;
  const align =
    alignments.length === 0 ? "center" : alignments.length === 1 ? alignments[0] : undefined;

  if (!align || !previewAlignments.includes(align as PreviewAlignment)) {
    errors.push("align must be start, center, or end");
  }
  if (!theme || !previewThemes.includes(theme as PreviewTheme)) {
    errors.push("theme must be light or dark");
  }
  if (!width || !Object.hasOwn(previewWidths, width)) {
    errors.push("width must be mobile, tablet, or desktop");
  }
  for (const key of new Set(parameters.keys())) {
    if (key !== "align" && key !== "theme" && key !== "width") {
      errors.push(`unexpected preview parameter: ${key}`);
    }
  }

  if (errors.length > 0) return { errors, ok: false };
  const validatedTheme = theme as PreviewTheme;
  const validatedAlignment = align as PreviewAlignment;
  const validatedWidth = width as PreviewWidth;
  return {
    ok: true,
    align: validatedAlignment,
    theme: validatedTheme,
    width: validatedWidth,
    widthPixels: previewWidths[validatedWidth],
  };
}
