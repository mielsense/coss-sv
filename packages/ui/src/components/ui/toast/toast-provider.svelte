<script module lang="ts">
  export type { ToastProviderProps } from "./toast.types.js";
</script>

<script lang="ts" generics="Data extends object = import('./toast.types.js').ToastData">
  import {
    type ToastManager as PrimitiveToastManager,
    Toast as ToastPrimitive,
  } from "@shardsui/svelte";
  import type { ToastProviderProps } from "./toast.types.js";
  import type { ToastManager } from "./toast-manager.js";
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

  // The adapter inherits Shards' subscription protocol; only its public promise options are wider.
  const providerManager = $derived(toastManager as unknown as PrimitiveToastManager);
</script>

<ToastPrimitive.Provider {limit} {timeout} toastManager={providerManager}>
  {@render children?.()}
  <ToastStack {portalProps} {position} />
</ToastPrimitive.Provider>
