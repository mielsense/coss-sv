<script module lang="ts">
import type { HTMLTextareaAttributes } from "svelte/elements";

export type TextareaSize = "sm" | "default" | "lg" | number;

export type TextareaProps = Omit<HTMLTextareaAttributes, "class"> & {
  class?: string;
  onValueChange?: (value: string) => void;
  ref?: HTMLTextAreaElement | null;
  size?: TextareaSize;
  unstyled?: boolean;
};
</script>

<script lang="ts">
import { Field } from "@shardsui/svelte";
import type { Component } from "svelte";
import { cn } from "$lib/utils.js";

const controlClass =
  "relative inline-flex w-full rounded-lg border border-input bg-background not-dark:bg-clip-padding text-base shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16 has-aria-invalid:border-destructive/36 has-focus-visible:border-ring has-disabled:opacity-64 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none has-focus-visible:ring-[3px] not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] sm:text-sm dark:bg-input/32 dark:has-aria-invalid:ring-destructive/24 dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]";

const textareaClass =
  "field-sizing-content min-h-17.5 w-full rounded-[inherit] px-[calc(--spacing(3)-1px)] py-[calc(--spacing(1.5)-1px)] text-foreground outline-none placeholder:text-muted-foreground/72 max-sm:min-h-20.5";

type TextareaControlProps = TextareaProps & { as?: "textarea" };
const TextareaControl = Field.Control as unknown as Component<
  TextareaControlProps,
  object,
  "ref" | "value"
>;

let {
  class: className,
  ref = $bindable(null),
  size = "default",
  unstyled = false,
  value = $bindable(),
  ...props
}: TextareaProps = $props();

const classes = $derived(cn(!unstyled && controlClass, className) || undefined);
const innerClasses = $derived(
  cn(
    textareaClass,
    size === "sm" &&
      "min-h-16.5 px-[calc(--spacing(2.5)-1px)] py-[calc(--spacing(1)-1px)] max-sm:min-h-19.5",
    size === "lg" && "min-h-18.5 py-[calc(--spacing(2)-1px)] max-sm:min-h-21.5",
  ),
);
</script>

<span data-size={size} data-slot="textarea-control" class={classes}>
  <TextareaControl
    as="textarea"
    bind:ref
    bind:value
    data-slot="textarea"
    class={innerClasses}
    {...props}
  />
</span>
