export interface NumberLocale {
  decimal: string;
  digits: ReadonlyMap<string, string>;
  group: string;
  locale: string | string[] | undefined;
  minus: string;
  percent: string;
}

const numberFormatterCache = new Map<string, Intl.NumberFormat>();
const numberLocaleCache = new Map<string, NumberLocale>();
const MAX_FORMATTERS = 64;
const MAX_LOCALES = 32;

function localeKey(locale?: string | string[]): string {
  return Array.isArray(locale) ? locale.join("\u0000") : (locale ?? "");
}

function formatterKey(locale?: string | string[], options?: Intl.NumberFormatOptions): string {
  const entries = Object.entries(options ?? {}).sort(([left], [right]) =>
    left.localeCompare(right),
  );
  return JSON.stringify([localeKey(locale), entries]);
}

function remember<Key, Value>(
  cache: Map<Key, Value>,
  key: Key,
  value: Value,
  limit: number,
): Value {
  cache.set(key, value);
  if (cache.size > limit) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  return value;
}

function numberFormatter(
  locale?: string | string[],
  options?: Intl.NumberFormatOptions,
): Intl.NumberFormat {
  const key = formatterKey(locale, options);
  const cached = numberFormatterCache.get(key);
  if (cached) {
    numberFormatterCache.delete(key);
    numberFormatterCache.set(key, cached);
    return cached;
  }
  return remember(
    numberFormatterCache,
    key,
    new Intl.NumberFormat(locale, options),
    MAX_FORMATTERS,
  );
}

export function createNumberLocale(locale?: string | string[]): NumberLocale {
  const key = localeKey(locale);
  const cached = numberLocaleCache.get(key);
  if (cached) {
    numberLocaleCache.delete(key);
    numberLocaleCache.set(key, cached);
    return cached;
  }

  const parts = numberFormatter(locale).formatToParts(-12345.6);
  const digits = new Map<string, string>();
  const digitFormatter = numberFormatter(locale, { useGrouping: false });
  for (let digit = 0; digit <= 9; digit += 1)
    digits.set(digitFormatter.format(digit), String(digit));
  const numberLocale: NumberLocale = {
    decimal: parts.find((part) => part.type === "decimal")?.value ?? ".",
    digits,
    group: parts.find((part) => part.type === "group")?.value ?? ",",
    locale,
    minus: parts.find((part) => part.type === "minusSign")?.value ?? "-",
    percent:
      numberFormatter(locale, { style: "percent" })
        .formatToParts(1)
        .find((part) => part.type === "percentSign")?.value ?? "%",
  };
  return remember(numberLocaleCache, key, numberLocale, MAX_LOCALES);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function parseNumber(
  raw: string,
  locale: NumberLocale,
  options?: Intl.NumberFormatOptions,
): number | null {
  let normalized = raw.trim();
  if (!normalized || normalized === "-" || normalized === locale.minus) return null;
  for (const [localized, ascii] of locale.digits)
    normalized = normalized.split(localized).join(ascii);
  const affixes = options
    ? numberFormatter(locale.locale, options)
        .formatToParts(-12345.6)
        .filter((part) =>
          ["compact", "currency", "literal", "percentSign", "unit"].includes(part.type),
        )
        .map((part) => part.value)
    : [];
  for (const affix of affixes) {
    normalized = normalized.replace(new RegExp(escapeRegExp(affix), "g"), "");
  }
  normalized = normalized
    .replace(new RegExp(escapeRegExp(locale.group), "g"), "")
    .replace(new RegExp(escapeRegExp(locale.decimal), "g"), ".")
    .replace(new RegExp(escapeRegExp(locale.minus), "g"), "-")
    .replace(/[\u00a0\u202f\s]/g, "")
    .replace(/[\p{Sc}%]/gu, "");
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function decimalPlaces(value: number): number {
  const source = String(value).toLowerCase();
  if (source.includes("e-")) return Number(source.split("e-")[1] ?? 0);
  return source.split(".")[1]?.length ?? 0;
}

export function roundToStep(value: number, step = 1): number {
  const precision = Math.min(15, Math.max(decimalPlaces(value), decimalPlaces(step)));
  return Number(value.toFixed(precision));
}

export function clampValue(value: number, min?: number, max?: number, step = 1): number {
  return roundToStep(
    Math.min(max ?? Number.POSITIVE_INFINITY, Math.max(min ?? Number.NEGATIVE_INFINITY, value)),
    step,
  );
}

export function snapValueToStep(
  value: number,
  step: number,
  min: number | undefined,
  direction: -1 | 1,
  nearest = false,
): number {
  if (step === 0) return value;
  const stepSize = Math.abs(step);
  const base = min ?? 0;
  const tolerance = stepSize * 1e-10 * direction;
  const rawSteps = value - base + tolerance;
  const steps = nearest
    ? Math.round(rawSteps / stepSize)
    : direction > 0
      ? Math.floor(rawSteps / stepSize)
      : Math.ceil(rawSteps / stepSize);
  return roundToStep(base + steps * stepSize, stepSize);
}

export function formatNumber(
  value: number | null,
  locale?: string | string[],
  options?: Intl.NumberFormatOptions,
): string {
  if (value == null || !Number.isFinite(value)) return "";
  return numberFormatter(locale, options).format(value);
}
