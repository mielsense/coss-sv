<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";
  export type DialogCloseProps = Omit<
    SvelteHTMLElements["button"],
    "children" | "disabled" | "id"
  > & {
    as?: keyof HTMLElementTagNameMap;
    children?: Snippet<[{ disabled: boolean }]>;
    disabled?: boolean;
    id?: string;
    ref?: HTMLElement | null;
  };
</script>

<script lang="ts">
  import { Dialog as DialogPrimitive } from "@shardsui/svelte";
  import type { Component } from "svelte";
  const ClosePrimitive = DialogPrimitive.Close as unknown as Component<
    DialogCloseProps,
    object,
    "ref"
  >;
  let { ref = $bindable(null), ...props }: DialogCloseProps = $props();
</script>

<ClosePrimitive bind:ref data-slot="dialog-close" {...props} />
