<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";
  export type DialogBackdropProps = Omit<SvelteHTMLElements["div"], "children" | "id"> & {
    as?: keyof HTMLElementTagNameMap;
    children?: Snippet<
      [{ open: boolean; transitionStatus: "starting" | "ending" | "idle" | undefined }]
    >;
    id?: string;
    ref?: HTMLElement | null;
  };
</script>

<script lang="ts">
  import { Dialog as DialogPrimitive } from "@shardsui/svelte/dialog";
  import { cn } from "@/utils.js";
  let { class: className, ref = $bindable(null), ...props }: DialogBackdropProps = $props();
</script>

<DialogPrimitive.Backdrop
  bind:ref
  class={cn(
    "fixed inset-0 z-50 bg-black/32 backdrop-blur-sm transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0",
    className,
  )}
  data-slot="dialog-backdrop"
  {...props}
/>
