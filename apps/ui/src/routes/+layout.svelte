<script lang="ts">
  import type { Snippet } from "svelte";
  import "@coss-sv/ui/styles/globals.css";
  import "../tailwind.css";
  import "../styles/theme.css";
  import "../styles/content.css";

  let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
  <script
    async
    src="https://c.getopen.so/oa.js"
    data-key="oa_pk_11Sw2rumK1oklXTuAoGNhj-pVIhv9cab"
    data-collector="https://c.getopen.so"
  ></script>
</svelte:head>

{@render children()}
