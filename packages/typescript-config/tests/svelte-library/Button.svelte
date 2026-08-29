<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children?: Snippet;
    disabled?: boolean;
    label: string;
  }

  let { children, disabled = false, label }: Props = $props();
</script>

<button type="button" {disabled}>
  {label}
  {@render children?.()}
</button>
