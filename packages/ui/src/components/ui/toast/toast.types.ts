import type { ToastManager, Toast as ToastPrimitive } from "@shardsui/svelte";
import type { ComponentProps, Snippet } from "svelte";

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
export type ToastPortalProps = ComponentProps<typeof ToastPrimitive.Portal>;

export type ToastProviderProps<Data extends object = ToastData> = Omit<
  PrimitiveProviderProps,
  "children" | "toastManager"
> & {
  children?: Snippet;
  portalProps?: ToastPortalProps;
  position?: ToastPosition;
  toastManager?: ToastManager<Data>;
};

export type AnchoredToastProviderProps<Data extends object = ToastData> = Omit<
  PrimitiveProviderProps,
  "children" | "toastManager"
> & {
  children?: Snippet;
  portalProps?: ToastPortalProps;
  toastManager?: ToastManager<Data>;
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
