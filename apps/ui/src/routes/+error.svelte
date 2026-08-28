<script lang="ts">
import { page } from "$app/state";
</script>

<svelte:head>
  <title>{page.status === 404 ? "Page Not Found" : "Something went wrong"}</title>
</svelte:head>

<section class="error-page">
  <h1>{page.status === 404 ? "Page Not Found" : "Something went wrong"}</h1>
  <p>
    {page.status === 404
      ? "The page you're looking for doesn't exist or may have been moved."
      : "The page could not be loaded."}
  </p>
  <a class="site-button" data-primary="true" href="/">
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M7.828 11 13.192 5.636 11.778 4.222 4 12l7.778 7.778 1.414-1.414L7.828 13H20v-2z" />
    </svg>
    Back to Home
  </a>
</section>
