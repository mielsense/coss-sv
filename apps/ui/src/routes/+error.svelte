<script lang="ts">
  import ArrowLeft02Icon from "@hugeicons/core-free-icons/ArrowLeft02Icon";
  import { HugeiconsIcon } from "@coss-sv/ui";
  import { page } from "$app/state";
  import { SiteHeader } from "@/site/index.js";
</script>

<svelte:head>
  <title>{page.status === 404 ? "Page Not Found" : "Something went wrong"}</title>
</svelte:head>

<div class="site-shell">
  <SiteHeader />
  <main class="min-h-[calc(100vh-4rem)]">
    <section
      class="mx-auto flex w-full max-w-[88.5rem] flex-col items-center gap-2 px-4 py-8 text-center md:py-12 lg:gap-4 lg:py-16"
      data-error-page
    >
      <h1 class="m-0 text-4xl leading-10 font-bold lg:text-5xl lg:leading-12">
        {page.status === 404 ? "Page Not Found" : "Something went wrong"}
      </h1>
      <p class="m-0 text-site-muted leading-6 sm:text-lg sm:leading-7">
        {page.status === 404
          ? "The page you're looking for doesn't exist or may have been moved."
          : "The page could not be loaded."}
      </p>
      <a
        class="relative mt-4 inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-[0.625rem] border border-site-primary bg-site-primary px-3.25 font-medium text-site-primary-foreground shadow-[0_1px_0_rgb(255_255_255/16%)_inset,0_1px_2px_color-mix(in_srgb,var(--site-primary)_24%,transparent)] hover:bg-site-primary/90 focus-visible:outline-2 focus-visible:outline-site-primary focus-visible:outline-offset-3 sm:min-h-9 sm:text-sm [&_svg]:-mx-0.5 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:opacity-60 [&_svg]:transition-transform hover:[&_svg]:-translate-x-0.5 motion-reduce:[&_svg]:transition-none"
        href="/"
        data-error-action
      >
        <HugeiconsIcon aria-hidden="true" icon={ArrowLeft02Icon} size={16} strokeWidth={2} />
        Back to Home
      </a>
    </section>
  </main>
</div>
