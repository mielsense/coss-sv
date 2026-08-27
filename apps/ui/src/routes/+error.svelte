<script lang="ts">
import { page } from "$app/state";
</script>

<svelte:head>
  <title>{page.status === 404 ? "Page Not Found" : "Something went wrong"} | COSS for Svelte</title>
</svelte:head>

<section class="error-page">
  <p class="error-code">{page.status}</p>
  <h1>{page.status === 404 ? "Page Not Found" : "Something went wrong"}</h1>
  <p>
    {page.status === 404
      ? "The page you're looking for doesn't exist or may have been moved."
      : "The page could not be loaded."}
  </p>
  <a class="site-button" data-primary="true" href="/">
    <span aria-hidden="true">←</span>
    Back to Home
  </a>
</section>
