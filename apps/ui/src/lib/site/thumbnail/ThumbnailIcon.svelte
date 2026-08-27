<script lang="ts">
import { cn } from "@coss-sv/ui";

let {
  name,
  class: className = "",
}: {
  name:
    | "alert"
    | "calendar"
    | "chevron-down"
    | "chevron-left"
    | "chevron-right"
    | "ellipsis"
    | "info"
    | "minus"
    | "plus"
    | "search"
    | "text-cursor"
    | "user"
    | "x";
  class?: string;
} = $props();
</script>

<svg
  aria-hidden="true"
  class={cn("size-4 text-muted-foreground/88", className)}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-linecap="round"
  stroke-linejoin="round"
  stroke-width="2"
>
  {#if name === "alert"}
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6m0 4h.01" />
  {:else if name === "calendar"}
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 10h18" />
  {:else if name === "chevron-down"}
    <path d="m6 9 6 6 6-6" />
  {:else if name === "chevron-left"}
    <path d="m15 18-6-6 6-6" />
  {:else if name === "chevron-right"}
    <path d="m9 18 6-6-6-6" />
  {:else if name === "ellipsis"}
    <circle cx="5" cy="12" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
  {:else if name === "info"}
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v6m0-10h.01" />
  {:else if name === "minus"}
    <path d="M5 12h14" />
  {:else if name === "plus"}
    <path d="M12 5v14M5 12h14" />
  {:else if name === "search"}
    <circle cx="11" cy="11" r="7" />
    <path d="m16 16 4 4" />
  {:else if name === "text-cursor"}
    <path d="M12 5v14M8 5h8M8 19h8" />
  {:else if name === "user"}
    <circle cx="12" cy="8" r="4" />
    <path d="M5 21a7 7 0 0 1 14 0" />
  {:else if name === "x"}
    <path d="m6 6 12 12M18 6 6 18" />
  {/if}
</svg>
