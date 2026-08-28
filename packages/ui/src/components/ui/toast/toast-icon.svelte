<script lang="ts">
let { type }: { type: string } = $props();
const iconName = $derived(
  type === "error"
    ? "circle-alert"
    : type === "info"
      ? "info"
      : type === "loading"
        ? "loader-circle"
        : type === "success"
          ? "circle-check"
          : "triangle-alert",
);
</script>

<svg
  aria-hidden="true"
  class={[
    "lucide",
    `lucide-${iconName}`,
    "in-data-[type=loading]:animate-spin in-data-[type=error]:text-destructive in-data-[type=info]:text-info in-data-[type=success]:text-success in-data-[type=warning]:text-warning in-data-[type=loading]:opacity-80",
  ]}
  fill="none"
  height="24"
  stroke="currentColor"
  stroke-linecap="round"
  stroke-linejoin="round"
  stroke-width="2"
  viewBox="0 0 24 24"
  width="24"
  xmlns="http://www.w3.org/2000/svg"
>
  {#if type === "error"}
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  {:else if type === "info"}
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  {:else if type === "loading"}
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  {:else if type === "success"}
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  {:else if type === "warning"}
    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  {/if}
</svg>
