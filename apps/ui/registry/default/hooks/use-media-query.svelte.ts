import { MediaQuery } from "svelte/reactivity";

export const BREAKPOINTS = {
  "2xl": 1536,
  "3xl": 1600,
  "4xl": 2000,
  lg: 1024,
  md: 800,
  sm: 640,
  xl: 1280,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export type BreakpointQuery = Breakpoint | `max-${Breakpoint}` | `${Breakpoint}:max-${Breakpoint}`;

export type MediaQueryInput = {
  min?: Breakpoint | number;
  max?: Breakpoint | number;
  /** Touch-like input (finger). Use `fine` for a mouse or trackpad. */
  pointer?: "coarse" | "fine";
};

function resolveMin(value: Breakpoint | number): string {
  const pixels = typeof value === "number" ? value : BREAKPOINTS[value];
  return `(min-width: ${pixels}px)`;
}

function resolveMax(value: Breakpoint | number): string {
  const pixels = typeof value === "number" ? value : BREAKPOINTS[value];
  return `(max-width: ${pixels - 1}px)`;
}

export function resolveMediaQuery(
  query: BreakpointQuery | MediaQueryInput | (string & {}),
): string {
  if (typeof query !== "string") {
    const parts: string[] = [];
    if (query.min != null) parts.push(resolveMin(query.min));
    if (query.max != null) parts.push(resolveMax(query.max));
    if (query.pointer) parts.push(`(pointer: ${query.pointer})`);
    return parts.length > 0 ? parts.join(" and ") : "(min-width: 0px)";
  }

  if (query.startsWith("(")) return query;

  const parts: string[] = [];
  for (const segment of query.split(":")) {
    if (segment.startsWith("max-")) {
      const breakpoint = segment.slice(4);
      if (breakpoint in BREAKPOINTS) parts.push(resolveMax(breakpoint as Breakpoint));
    } else if (segment in BREAKPOINTS) {
      parts.push(resolveMin(segment as Breakpoint));
    }
  }

  return parts.length > 0 ? parts.join(" and ") : query;
}

/** Creates an SSR-safe reactive media query with a `false` server fallback. */
export function useMediaQuery(
  query: BreakpointQuery | MediaQueryInput | (string & {}),
): MediaQuery {
  return new MediaQuery(resolveMediaQuery(query), false);
}

/** Equivalent to `useMediaQuery("max-md")`. */
export function useIsMobile(): MediaQuery {
  return useMediaQuery("max-md");
}
