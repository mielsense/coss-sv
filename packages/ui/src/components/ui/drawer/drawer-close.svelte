<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";

  export type DrawerCloseProps<Tag extends keyof SvelteHTMLElements = "button"> = Omit<
    SvelteHTMLElements[Tag],
    "children" | "disabled" | "id"
  > & {
    as?: Tag;
    children?: Snippet<[{ disabled: boolean }]>;
    disabled?: boolean;
    id?: string;
    ref?: HTMLElement | null;
  };
</script>

<script lang="ts" generics="Tag extends keyof SvelteHTMLElements = 'button'">
  import { Dialog as P } from "@shardsui/svelte";
  import type { Component } from "svelte";

  const ClosePrimitive = P.Close as unknown as Component<Record<string, unknown>, object, "ref">;
  let { ref = $bindable(null), ...props }: DrawerCloseProps<Tag> = $props();
</script>

<ClosePrimitive bind:ref data-slot="drawer-close" {...props} />
