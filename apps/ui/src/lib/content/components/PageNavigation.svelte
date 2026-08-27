<script lang="ts">
type PageLink = {
  href: string;
  title: string;
};

type Props = {
  next?: PageLink;
  previous?: PageLink;
};

let { next, previous }: Props = $props();
</script>

<nav class="mt-16 grid gap-3 border-t pt-6 sm:grid-cols-2" aria-label="Documentation pages">
  {#if previous}
    <a class="rounded-xl border p-4 transition-colors hover:bg-accent" href={previous.href}>
      <span class="block text-xs text-muted-foreground">Previous</span>
      <span class="mt-1 block font-medium">{previous.title}</span>
    </a>
  {:else}
    <span></span>
  {/if}
  {#if next}
    <a class="rounded-xl border p-4 text-right transition-colors hover:bg-accent" href={next.href}>
      <span class="block text-xs text-muted-foreground">Next</span>
      <span class="mt-1 block font-medium">{next.title}</span>
    </a>
  {/if}
</nav>
