<script lang="ts">
  import { page } from "$app/state";
</script>

<svelte:head>
  <title>{page.status} preview error</title>
</svelte:head>

<section class="preview-error">
  <p>{page.status}</p>
  <h1>Preview not found</h1>
  <p class="message">{page.error?.message ?? "The requested preview could not be loaded."}</p>
</section>

<style>
  .preview-error {
    width: min(100%, 32rem);
    padding: 1.5rem;
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    background: var(--background);
    color: var(--foreground);
  }

  p,
  h1 {
    margin: 0;
  }

  h1,
  .message {
    margin-top: 0.5rem;
  }
</style>
