<script lang="ts">
  import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@coss-sv/ui";
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
    <HugeiconsIcon aria-hidden="true" icon={ArrowLeft02Icon} size={16} strokeWidth={2} />
    Back to Home
  </a>
</section>
