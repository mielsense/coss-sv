import type { PreviewConfiguration } from "./preview-contract.js";

export type PreviewRuntime = {
  readonly config: Readonly<PreviewConfiguration>;
  id(prefix?: string): string;
  now(): Date;
  random(): number;
};

export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

export function createPreviewRuntime(config: PreviewConfiguration): PreviewRuntime {
  const frozenConfig = Object.freeze({ ...config });
  const random = createSeededRandom(config.seed);
  let idCounter = 0;

  return Object.freeze({
    config: frozenConfig,
    id(prefix = "preview") {
      idCounter += 1;
      return `${prefix}-${config.seed.toString(36)}-${idCounter.toString(36)}`;
    },
    now() {
      return new Date(config.now);
    },
    random,
  });
}
