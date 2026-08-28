import { Toast as ToastPrimitive } from "@shardsui/svelte";
import type { ToastData } from "./toast.types.js";

export const toastManager = new ToastPrimitive.Manager<ToastData>();
export const anchoredToastManager = new ToastPrimitive.Manager<ToastData>();
