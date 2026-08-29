<script module lang="ts">
  export type { AnchoredToastProviderProps } from "./toast.types.js";
</script>

<script lang="ts" generics="Data extends object = import('./toast.types.js').ToastData">
  import {
    type ToastManager as PrimitiveToastManager,
    Toast as ToastPrimitive,
  } from "@shardsui/svelte";
  import AnchoredToastStack from "./anchored-toast-stack.svelte";
  import type { AnchoredToastProviderProps } from "./toast.types.js";
  import type { ToastManager } from "./toast-manager.js";
  import { anchoredToastManager as defaultManager } from "./toast-managers.js";

  let {
    children,
    limit = 3,
    portalProps,
    timeout = 5000,
    toastManager = defaultManager as ToastManager<Data>,
  }: AnchoredToastProviderProps<Data> = $props();

  // The adapter inherits Shards' subscription protocol; only its public promise options are wider.
  const providerManager = $derived(toastManager as unknown as PrimitiveToastManager);
</script>

<ToastPrimitive.Provider {limit} {timeout} toastManager={providerManager}>
  {@render children?.()}
  <AnchoredToastStack {portalProps} />
</ToastPrimitive.Provider>
