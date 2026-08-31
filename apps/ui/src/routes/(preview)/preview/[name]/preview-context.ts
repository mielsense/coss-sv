import { createContext } from "svelte";
import type { PreviewRuntime } from "./preview-runtime.js";

export type PreviewRuntimeContext = {
  readonly current: PreviewRuntime;
};

export const [getPreviewRuntimeContext, setPreviewRuntimeContext] =
  createContext<PreviewRuntimeContext>();

export function getPreviewRuntime(): PreviewRuntime {
  return getPreviewRuntimeContext().current;
}
