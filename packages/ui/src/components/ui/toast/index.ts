import { Toast as ToastPrimitive } from "@shardsui/svelte";

export type {
  ToastManager,
  ToastManagerAddOptions,
  ToastManagerPositionerProps,
  ToastManagerPromiseOptions,
  ToastManagerUpdateOptions,
  ToastObject,
} from "@shardsui/svelte";
export { ToastPrimitive };
export const Manager = ToastPrimitive.Manager;
export const getToastManager = ToastPrimitive.getToastManager;

export type { AnchoredToastProviderProps } from "./anchored-toast-provider.svelte";
export {
  default as AnchoredProvider,
  default as AnchoredToastProvider,
} from "./anchored-toast-provider.svelte";
export type {
  ToastData,
  ToastPortalProps,
  ToastPosition,
  ToastSwipeDirection,
} from "./toast.types.js";
export { anchoredToastManager, toastManager } from "./toast-managers.js";
export type { ToastProviderProps } from "./toast-provider.svelte";
export { default as Provider, default as ToastProvider } from "./toast-provider.svelte";
