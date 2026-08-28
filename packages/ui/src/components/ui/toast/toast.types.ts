import type {
  ToastManager as PrimitiveToastManager,
  Toast as ToastPrimitive,
} from "@shardsui/svelte";
import type { ComponentProps, Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import type { ToastManager } from "./toast-manager.js";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastSwipeDirection = "up" | "down" | "left" | "right";

export type ToastData = {
  rootProps?: Omit<
    ComponentProps<typeof ToastPrimitive.Root>,
    "children" | "class" | "swipeDirection" | "toast"
  >;
  tooltipStyle?: boolean;
};

type PrimitiveProviderProps = ComponentProps<typeof ToastPrimitive.Provider>;
export type ToastPortalContainerRef = {
  current: HTMLElement | ShadowRoot | null;
};
export type ToastPortalContainer = HTMLElement | ShadowRoot | ToastPortalContainerRef | null;
// biome-ignore lint/suspicious/noConfusingVoidType: Base UI callback refs may return teardown cleanup.
export type ToastPortalRefCallback = (node: HTMLDivElement | null) => void | (() => void);
export type ToastPortalRefObject = {
  current: HTMLDivElement | null;
};
export type ToastPortalRef = ToastPortalRefCallback | ToastPortalRefObject | null;
export type ToastPortalProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
  container?: ToastPortalContainer | undefined;
  ref?: ToastPortalRef | undefined;
};

export type ToastProviderProps<Data extends object = ToastData> = Omit<
  PrimitiveProviderProps,
  "children" | "toastManager"
> & {
  children?: Snippet;
  portalProps?: ToastPortalProps;
  position?: ToastPosition;
  toastManager?: ToastManager<Data> | PrimitiveToastManager<Data>;
};

export type AnchoredToastProviderProps<Data extends object = ToastData> = Omit<
  PrimitiveProviderProps,
  "children" | "toastManager"
> & {
  children?: Snippet;
  portalProps?: ToastPortalProps;
  toastManager?: ToastManager<Data> | PrimitiveToastManager<Data>;
};

export function getToastSwipeDirection(position: ToastPosition): ToastSwipeDirection[] {
  const verticalDirection: ToastSwipeDirection = position.startsWith("top") ? "up" : "down";

  if (position.includes("center")) return [verticalDirection];
  if (position.includes("left")) return ["left", verticalDirection];
  return ["right", verticalDirection];
}

export function getToastReplayClass(toast: {
  type?: string;
  updateKey?: number;
}): string | undefined {
  const updateKey = toast.updateKey ?? 0;
  if (updateKey <= 0) return undefined;

  const parity = updateKey % 2 === 0 ? "even" : "odd";
  return toast.type === "error"
    ? `animate-toast-error-${parity}`
    : `animate-toast-success-${parity}`;
}
