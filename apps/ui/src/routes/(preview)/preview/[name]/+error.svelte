<script lang="ts">
  import { page } from "$app/state";
</script>

<svelte:head>
  <title>{page.status} preview error</title>
</svelte:head>

<section class="w-[min(100%,32rem)] rounded-xl border bg-background p-6 text-foreground">
  <p class="m-0">{page.status}</p>
  <h1 class="m-0 mt-2">Preview not found</h1>
  <p class="m-0 mt-2">{page.error?.message ?? "The requested preview could not be loaded."}</p>
</section>
