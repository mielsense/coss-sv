<script module lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

export type GroupTextDelegateProps = Omit<HTMLAttributes<HTMLElement>, "children" | "class"> & {
  children?: Snippet;
  class?: string;
  ref?: HTMLElement | null;
};

export type GroupTextProps = GroupTextDelegateProps & {
  as?: keyof HTMLElementTagNameMap;
  delegate?: Snippet<[GroupTextDelegateProps]>;
  for?: string;
};
</script>

<script lang="ts">
import type { Attachment } from "svelte/attachments";
import { createAttachmentKey } from "svelte/attachments";
import { cn } from "$lib/utils.js";

let {
  as = "div",
  children,
  class: className,
  delegate,
  ref = $bindable(null),
  ...props
}: GroupTextProps = $props();

const baseClass =
  "relative inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-input bg-muted not-dark:bg-clip-padding px-[calc(--spacing(3)-1px)] text-base text-muted-foreground shadow-xs/5 outline-none transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/6%)] sm:text-sm dark:bg-input/64 dark:before:shadow-[0_-1px_--theme(--color-white/6%)] [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:-mx-0.5 [&_svg]:shrink-0";

const refAttachmentKey = createAttachmentKey();
const setRef: Attachment<HTMLElement> = (node) => {
  ref = node;
  return () => {
    if (ref === node) ref = null;
  };
};

const delegateProps = $derived({
  ...props,
  ...(children ? { children } : {}),
  "data-slot": "group-text",
  class: cn(baseClass, className),
  [refAttachmentKey]: setRef,
} satisfies GroupTextDelegateProps);
</script>

{#if delegate}
  {@render delegate(delegateProps)}
{:else}
  <svelte:element
    this={as}
    bind:this={ref}
    data-slot="group-text"
    class={cn(baseClass, className)}
    {...props}
  >
    {@render children?.()}
  </svelte:element>
{/if}
