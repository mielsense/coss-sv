<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  export type CardTag =
    | "a"
    | "address"
    | "article"
    | "aside"
    | "blockquote"
    | "button"
    | "details"
    | "dialog"
    | "div"
    | "fieldset"
    | "figcaption"
    | "figure"
    | "footer"
    | "form"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "header"
    | "li"
    | "main"
    | "nav"
    | "ol"
    | "p"
    | "section"
    | "span"
    | "summary"
    | "ul";

  export type CardProps<Tag extends CardTag = "div"> = Omit<
    HTMLAttributes<HTMLElement>,
    "children" | "ref"
  > & {
    as?: Tag;
    children?: Snippet;
    disabled?: boolean | null;
    href?: string | null;
    name?: string | null;
    ref?: HTMLElement | null;
    rel?: string | null;
    target?: string | null;
    type?: string | null;
    value?: string | string[] | number | null;
  };

  export function forwardCardProps(props: unknown): Record<string, unknown> {
    return props as Record<string, unknown>;
  }
</script>

<script lang="ts">
  import type { ClassValue } from "clsx";
  import { cn } from "@/utils.js";

  type Props = Record<string, unknown> & {
    as?: CardTag;
    baseClass: string;
    children?: Snippet;
    class?: ClassValue;
    dataSlot: string;
    ref?: HTMLElement | null;
  };
  let {
    as = "div",
    baseClass,
    children,
    class: className,
    dataSlot,
    ref = $bindable(null),
    ...props
  }: Props = $props();
</script>

<svelte:element
  this={as}
  bind:this={ref}
  class={cn(baseClass, className)}
  data-slot={dataSlot}
  {...props}
>
  {@render children?.()}
</svelte:element>
