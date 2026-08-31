<script lang="ts">
  import type { Snippet } from "svelte";
  import "@coss-sv/ui/styles/globals.css";
  import "../tailwind.css";
  import "../styles/theme.css";
  import "../styles/content.css";

  let { children }: { children: Snippet } = $props();
</script>

{@render children()}
