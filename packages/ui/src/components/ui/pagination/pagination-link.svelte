<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";
  import type { ButtonProps, ButtonSize } from "../button/button.svelte";

  export type PaginationLinkDelegateRef = {
    current: HTMLElement | null;
  };

  export type PaginationLinkDelegateProps = {
    props: Omit<ButtonProps, "ref">;
    ref: PaginationLinkDelegateRef;
  };

  export type PaginationLinkProps = Omit<SvelteHTMLElements["a"], "children" | "class" | "ref"> & {
    as?: keyof HTMLElementTagNameMap;
    children?: Snippet;
    class?: string;
    delegate?: Snippet<[PaginationLinkDelegateProps]>;
    isActive?: boolean;
    ref?: HTMLElement | null;
    size?: ButtonSize;
    type?: "button" | "reset" | "submit";
  };
</script>

<script lang="ts">
  import { cn } from "@/utils.js";
  import { buttonVariants } from "../button/button.svelte";

  let {
    "aria-current": ariaCurrent,
    as = "a",
    children,
    class: className,
    delegate,
    isActive,
    ref = $bindable(null),
    size = "icon",
    ...props
  }: PaginationLinkProps = $props();

  const current = $derived(ariaCurrent ?? (isActive ? "page" : undefined));
  const classes = $derived(
    cn(buttonVariants({ size, variant: isActive ? "outline" : "ghost" }), className),
  );
  const delegateProps = $derived({
    ...props,
    "aria-current": current,
    children,
    class: className,
    "data-active": isActive,
    "data-slot": "pagination-link",
  } as unknown as Omit<ButtonProps, "ref">);
  const delegateRef: PaginationLinkDelegateRef = {
    get current() {
      return ref;
    },
    set current(element) {
      ref = element;
    },
  };
</script>

{#if delegate}
  {@render delegate({ props: delegateProps, ref: delegateRef })}
{:else}
  <svelte:element
    this={as}
    aria-current={current}
    bind:this={ref}
    class={classes}
    data-active={isActive}
    data-slot="pagination-link"
    {...props}
  >
    {@render children?.()}
  </svelte:element>
{/if}
