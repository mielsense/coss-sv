<script module lang="ts">
export type { ToastProviderProps } from "./toast.types.js";
</script>

<script lang="ts" generics="Data extends object = import('./toast.types.js').ToastData">
import { type ToastManager, Toast as ToastPrimitive } from "@shardsui/svelte";
import type { ToastProviderProps } from "./toast.types.js";
import { toastManager as defaultManager } from "./toast-managers.js";
import ToastStack from "./toast-stack.svelte";

let {
  children,
  limit = 3,
  portalProps,
  position = "bottom-right",
  timeout = 5000,
  toastManager = defaultManager as ToastManager<Data>,
}: ToastProviderProps<Data> = $props();
</script>

<ToastPrimitive.Provider {limit} {timeout} {toastManager}>
  {@render children?.()}
  <ToastStack {portalProps} {position} />
</ToastPrimitive.Provider>
