<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";
  export type DialogViewportProps = Omit<SvelteHTMLElements["div"], "children" | "id"> & {
    as?: keyof HTMLElementTagNameMap;
    children?: Snippet<
      [
        {
          nested: boolean;
          nestedDialogOpen: boolean;
          open: boolean;
          transitionStatus: "starting" | "ending" | "idle" | undefined;
        },
      ]
    >;
    id?: string;
    ref?: HTMLElement | null;
  };
</script>

<script lang="ts">
  import { Dialog as DialogPrimitive } from "@shardsui/svelte";
  import { cn } from "$lib/utils.js";
  let { class: className, ref = $bindable(null), ...props }: DialogViewportProps = $props();
</script>

<DialogPrimitive.Viewport
  bind:ref
  class={cn("fixed inset-0 z-50 grid grid-rows-[1fr_auto_3fr] justify-items-center p-4", className)}
  data-slot="dialog-viewport"
  {...props}
/>
