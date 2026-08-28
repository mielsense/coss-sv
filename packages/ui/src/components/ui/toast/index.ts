import { Toast as ToastPrimitive } from "@shardsui/svelte";

export type {
  ToastManagerAddOptions,
  ToastManagerPositionerProps,
  ToastObject,
} from "@shardsui/svelte";
export type { AnchoredToastProviderProps } from "./anchored-toast-provider.svelte";
export {
  default as AnchoredProvider,
  default as AnchoredToastProvider,
} from "./anchored-toast-provider.svelte";
export type {
  ToastData,
  ToastPortalContainer,
  ToastPortalContainerRef,
  ToastPortalProps,
  ToastPortalRef,
  ToastPortalRefCallback,
  ToastPortalRefObject,
  ToastPosition,
  ToastSwipeDirection,
} from "./toast.types.js";
export {
  getToastManager,
  ToastManager as Manager,
  ToastManager,
  type ToastManagerContext,
  type ToastManagerPromiseOptions,
  type ToastManagerUpdateOptions,
} from "./toast-manager.js";
export { anchoredToastManager, toastManager } from "./toast-managers.js";
export type { ToastProviderProps } from "./toast-provider.svelte";
export { default as Provider, default as ToastProvider } from "./toast-provider.svelte";
export { ToastPrimitive };
