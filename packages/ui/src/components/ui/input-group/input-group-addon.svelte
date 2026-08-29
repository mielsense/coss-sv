<!-- biome-ignore-all lint/a11y/noStaticElementInteractions: COSS uses pointer-down only to forward focus to the associated native control. -->
<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import type { InputGroupAddonAlign } from "./input-group-styles.js";

  export type InputGroupAddonProps = Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "class" | "onmousedown"
  > & {
    align?: InputGroupAddonAlign;
    children?: Snippet;
    class?: string;
    onmousedown?: (event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) => void;
    ref?: HTMLDivElement | null;
  };
</script>

<script lang="ts">
  import { inputGroupAddonClasses } from "./input-group-styles.js";

  let {
    align = "inline-start",
    children,
    class: className,
    onmousedown,
    ref = $bindable(null),
    ...props
  }: InputGroupAddonProps = $props();

  function handleMouseDown(
    event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement },
  ): void {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const interactive = target.closest(
      "button, a, input, select, textarea, [role='button'], [role='combobox'], [role='listbox'], [data-slot='select-trigger']",
    );
    if (interactive) return;

    event.preventDefault();
    const parent = event.currentTarget.parentElement;
    const control = parent?.querySelector<HTMLInputElement | HTMLTextAreaElement>(
      "input, textarea",
    );
    if (control && !parent?.querySelector("input:focus, textarea:focus")) control.focus();
  }
</script>

<div
  bind:this={ref}
  data-align={align}
  data-slot="input-group-addon"
  class={inputGroupAddonClasses({ align, class: className })}
  onmousedown={onmousedown ?? handleMouseDown}
  {...props}
>
  {@render children?.()}
</div>
