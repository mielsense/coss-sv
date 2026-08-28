import type { ToastData } from "./toast.types.js";
import { ToastManager } from "./toast-manager.js";

export const toastManager = new ToastManager<ToastData>();
export const anchoredToastManager = new ToastManager<ToastData>();
