<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  type Props = HTMLAttributes<HTMLTableElement> & {
    children: Snippet;
  };

  let { children, class: className, ...rest }: Props = $props();
</script>

<div class="my-6 max-w-full overflow-x-auto" data-docs-table>
  <table
    class={[
      "relative w-full border-collapse border-0 text-left text-sm leading-5",
      "[&_tr]:border-b [&_tr:last-child]:border-b-0",
      "[&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:font-medium",
      "[&_td]:px-4 [&_td]:py-2 [&_td]:text-left [&_td]:align-top [&_td]:whitespace-nowrap",
      className,
    ]}
    {...rest}
  >
    {@render children()}
  </table>
</div>
