<script module lang="ts">
import type { Autocomplete as ShardsAutocomplete } from "@shardsui/svelte";
import type { ComponentProps, Snippet } from "svelte";

export type AutocompleteInputSize = "sm" | "default" | "lg" | number;
export type AutocompleteInputProps = Omit<
  ComponentProps<typeof ShardsAutocomplete.Input>,
  "children" | "class" | "size"
> & {
  class?: string;
  clearProps?: ComponentProps<typeof ShardsAutocomplete.Clear>;
  ref?: HTMLInputElement | null;
  showClear?: boolean;
  showTrigger?: boolean;
  size?: AutocompleteInputSize;
  startAddon?: Snippet;
  triggerProps?: ComponentProps<typeof ShardsAutocomplete.Trigger>;
};
</script>

<script lang="ts">
import { Autocomplete as AutocompletePrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
import AutocompleteClear from "./autocomplete-clear.svelte";
import AutocompleteTrigger from "./autocomplete-trigger.svelte";

const controlClass =
  "relative inline-flex w-full rounded-lg border border-input bg-background not-dark:bg-clip-padding text-base shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16 has-aria-invalid:border-destructive/36 has-focus-visible:border-ring has-autofill:bg-foreground/4 has-disabled:opacity-64 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none has-focus-visible:ring-[3px] sm:text-sm dark:bg-input/32 dark:has-autofill:bg-foreground/8 dark:has-aria-invalid:ring-destructive/24 dark:not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]";
const inputClass =
  "h-8.5 w-full min-w-0 rounded-[inherit] px-[calc(--spacing(3)-1px)] text-foreground leading-8.5 outline-none [transition:background-color_5000000s_ease-in-out_0s] placeholder:text-muted-foreground/72 sm:h-7.5 sm:leading-7.5 autofill:[-webkit-text-fill-color:var(--foreground)]";
const adornmentClass =
  "absolute top-1/2 inline-flex size-8 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-transparent opacity-80 outline-none transition-colors pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 hover:opacity-100 has-[+[data-slot=autocomplete-clear]]:hidden sm:size-7 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0";

let {
  class: className,
  clearProps = {},
  ref = $bindable(null),
  showClear = false,
  showTrigger = false,
  size = "default",
  startAddon,
  triggerProps = {},
  ...props
}: AutocompleteInputProps = $props();

const nativeSize = $derived(typeof size === "number" ? size : undefined);
const innerClass = $derived(
  cn(
    inputClass,
    size === "sm" && "h-7.5 px-[calc(--spacing(2.5)-1px)] leading-7.5 sm:h-6.5 sm:leading-6.5",
    size === "lg" && "h-9.5 leading-9.5 sm:h-8.5 sm:leading-8.5",
  ),
);
const composedControlClass = $derived(
  cn(
    controlClass,
    startAddon &&
      "data-[size=sm]:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(7.5)-1px)] *:data-[slot=autocomplete-input]:ps-[calc(--spacing(8.5)-1px)] sm:data-[size=sm]:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(7)-1px)] sm:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(8)-1px)]",
    (showTrigger || showClear) &&
      (size === "sm"
        ? "has-[+[data-slot=autocomplete-trigger],+[data-slot=autocomplete-clear]]:*:data-[slot=autocomplete-input]:pe-6.5"
        : "has-[+[data-slot=autocomplete-trigger],+[data-slot=autocomplete-clear]]:*:data-[slot=autocomplete-input]:pe-7"),
    className,
  ),
);
const adornmentPosition = $derived(size === "sm" ? "end-0" : "end-0.5");
</script>

<AutocompletePrimitive.InputGroup
  class="relative not-has-[>*.w-full]:w-fit w-full text-foreground has-disabled:opacity-64"
  data-slot="autocomplete-input-group"
>
  {#if startAddon}
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-y-0 start-px z-10 flex items-center ps-[calc(--spacing(3)-1px)] opacity-80 has-[+[data-size=sm]]:ps-[calc(--spacing(2.5)-1px)] [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:-mx-0.5"
      data-slot="autocomplete-start-addon"
    >
      {@render startAddon()}
    </div>
  {/if}
  <span class={composedControlClass} data-size={size} data-slot="input-control">
    <AutocompletePrimitive.Input
      bind:ref
      class={innerClass}
      data-slot="autocomplete-input"
      size={nativeSize}
      {...props}
    />
  </span>
  {#if showTrigger}
    <AutocompleteTrigger class={cn(adornmentClass, adornmentPosition)} {...triggerProps}>
      {#snippet children()}
        <AutocompletePrimitive.Icon data-slot="autocomplete-icon">
          <svg
            aria-hidden="true"
            fill="none"
            height="24"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="m7 15 5 5 5-5" />
            <path d="m7 9 5-5 5 5" />
          </svg>
        </AutocompletePrimitive.Icon>
      {/snippet}
    </AutocompleteTrigger>
  {/if}
  {#if showClear}
    <AutocompleteClear class={cn(adornmentClass, adornmentPosition)} {...clearProps} />
  {/if}
</AutocompletePrimitive.InputGroup>
