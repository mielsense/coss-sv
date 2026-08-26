export const previewThemes = ["light", "dark"] as const;
export const previewWidths = {
  mobile: 390,
  tablet: 768,
  desktop: 1200,
} as const;

export type PreviewTheme = (typeof previewThemes)[number];
export type PreviewWidth = keyof typeof previewWidths;

export type PreviewQuery =
  | {
      ok: true;
      theme: PreviewTheme;
      width: PreviewWidth;
      widthPixels: number;
    }
  | { errors: string[]; ok: false };

export function parsePreviewQuery(parameters: URLSearchParams): PreviewQuery {
  const errors: string[] = [];
  const themes = parameters.getAll("theme");
  const widths = parameters.getAll("width");
  const theme = themes.length === 1 ? themes[0] : undefined;
  const width = widths.length === 1 ? widths[0] : undefined;

  if (!theme || !previewThemes.includes(theme as PreviewTheme)) {
    errors.push("theme must be light or dark");
  }
  if (!width || !Object.hasOwn(previewWidths, width)) {
    errors.push("width must be mobile, tablet, or desktop");
  }
  for (const key of new Set(parameters.keys())) {
    if (key !== "theme" && key !== "width") errors.push(`unexpected preview parameter: ${key}`);
  }

  if (errors.length > 0) return { errors, ok: false };
  const validatedTheme = theme as PreviewTheme;
  const validatedWidth = width as PreviewWidth;
  return {
    ok: true,
    theme: validatedTheme,
    width: validatedWidth,
    widthPixels: previewWidths[validatedWidth],
  };
}
