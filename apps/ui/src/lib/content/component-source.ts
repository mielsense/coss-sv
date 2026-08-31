import type { HighlightedSource } from "../code/highlight.js";

export type ComponentSourceFile = {
  path: string;
  source: HighlightedSource;
};

export type ComponentSourceBundle = {
  dependencies: string[];
  files: ComponentSourceFile[];
};
