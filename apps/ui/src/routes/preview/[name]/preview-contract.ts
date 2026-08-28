export const previewAlignments = ["start", "center", "end"] as const;
export const previewDirections = ["ltr", "rtl"] as const;
export const previewNetworks = ["blocked", "live"] as const;
export const previewReducedMotion = ["reduce", "no-preference"] as const;
export const previewThemes = ["light", "dark"] as const;
export const previewTimers = ["manual", "real"] as const;
export const previewWidths = {
  mobile: 390,
  tablet: 768,
  desktop: 1200,
} as const;

export type PreviewAlignment = (typeof previewAlignments)[number];
export type PreviewDirection = (typeof previewDirections)[number];
export type PreviewNetwork = (typeof previewNetworks)[number];
export type PreviewReducedMotion = (typeof previewReducedMotion)[number];
export type PreviewTheme = (typeof previewThemes)[number];
export type PreviewTimers = (typeof previewTimers)[number];
export type PreviewWidth = keyof typeof previewWidths;

export type PreviewConfiguration = {
  align: PreviewAlignment;
  direction: PreviewDirection;
  locale: string;
  network: PreviewNetwork;
  now: string;
  reducedMotion: PreviewReducedMotion;
  seed: number;
  theme: PreviewTheme;
  timers: PreviewTimers;
  width: PreviewWidth;
  widthPixels: number;
};

export type PreviewQuery = ({ ok: true } & PreviewConfiguration) | { errors: string[]; ok: false };

const defaults = {
  align: "center",
  direction: "ltr",
  locale: "en-US",
  network: "blocked",
  now: "2026-08-26T12:00:00.000Z",
  reducedMotion: "reduce",
  seed: 20260826,
  timers: "manual",
} as const;

const allowedParameters = new Set([
  "align",
  "direction",
  "locale",
  "network",
  "now",
  "reducedMotion",
  "seed",
  "theme",
  "timers",
  "width",
]);

function singleValue(
  parameters: URLSearchParams,
  key: string,
  errors: string[],
): string | undefined {
  const values = parameters.getAll(key);
  if (values.length > 1) {
    errors.push(`${key} must appear once`);
    return undefined;
  }
  return values[0];
}

function isOneOf<T extends string>(value: string, values: readonly T[]): value is T {
  return values.includes(value as T);
}

function parseLocale(value: string, errors: string[]): string | undefined {
  try {
    const [locale] = Intl.getCanonicalLocales(value);
    if (!locale) throw new RangeError("Locale is empty");
    return locale;
  } catch {
    errors.push("locale must be a valid BCP 47 locale");
    return undefined;
  }
}

function parseIsoDate(value: string, errors: string[]): string | undefined {
  const date = new Date(value);
  if (!Number.isFinite(date.valueOf()) || date.toISOString() !== value) {
    errors.push("now must be an ISO 8601 timestamp");
    return undefined;
  }
  return value;
}

function parseSeed(value: string, errors: string[]): number | undefined {
  if (!/^\d+$/.test(value)) {
    errors.push("seed must be an unsigned 32-bit integer");
    return undefined;
  }
  const seed = Number(value);
  if (!Number.isSafeInteger(seed) || seed > 0xffff_ffff) {
    errors.push("seed must be an unsigned 32-bit integer");
    return undefined;
  }
  return seed;
}

export function parsePreviewQuery(parameters: URLSearchParams): PreviewQuery {
  const errors: string[] = [];
  const values = Object.fromEntries(
    [...allowedParameters]
      .filter((key) => key !== "align")
      .map((key) => [key, singleValue(parameters, key, errors)]),
  );

  for (const key of new Set(parameters.keys())) {
    if (!allowedParameters.has(key)) errors.push(`unexpected preview parameter: ${key}`);
  }

  const alignments = parameters.getAll("align");
  const align =
    alignments.length === 0 ? defaults.align : alignments.length === 1 ? alignments[0] : undefined;
  if (!align || !isOneOf(align, previewAlignments)) {
    errors.push("align must be start, center, or end");
  }

  const theme = values.theme;
  if (!theme || !isOneOf(theme, previewThemes)) {
    errors.push("theme must be light or dark");
  }

  const width = values.width;
  if (!width || !Object.hasOwn(previewWidths, width)) {
    errors.push("width must be mobile, tablet, or desktop");
  }

  const direction = values.direction ?? defaults.direction;
  if (!isOneOf(direction, previewDirections)) errors.push("direction must be ltr or rtl");

  const network = values.network ?? defaults.network;
  if (!isOneOf(network, previewNetworks)) errors.push("network must be blocked or live");

  const reducedMotion = values.reducedMotion ?? defaults.reducedMotion;
  if (!isOneOf(reducedMotion, previewReducedMotion)) {
    errors.push("reducedMotion must be reduce or no-preference");
  }

  const timers = values.timers ?? defaults.timers;
  if (!isOneOf(timers, previewTimers)) errors.push("timers must be manual or real");

  const locale = parseLocale(values.locale ?? defaults.locale, errors);
  const now = parseIsoDate(values.now ?? defaults.now, errors);
  const seed = parseSeed(values.seed ?? String(defaults.seed), errors);

  if (errors.length > 0) return { errors, ok: false };

  const validatedWidth = width as PreviewWidth;
  return {
    align: align as PreviewAlignment,
    direction: direction as PreviewDirection,
    locale: locale as string,
    network: network as PreviewNetwork,
    now: now as string,
    ok: true,
    reducedMotion: reducedMotion as PreviewReducedMotion,
    seed: seed as number,
    theme: theme as PreviewTheme,
    timers: timers as PreviewTimers,
    width: validatedWidth,
    widthPixels: previewWidths[validatedWidth],
  };
}
