<script lang="ts">
import { cn } from "@coss-sv/ui";

let {
  class: className = "",
  variant = "secondary",
}: { class?: string; variant?: "primary" | "secondary" } = $props();
</script>

<div
  class={cn(
    variant === "primary"
      ? "h-4 bg-linear-to-b from-(--btn-from) to-(--btn-to)"
      : "h-1.5 bg-muted-foreground/20",
    "w-7 rounded-sm",
    className,
  )}
></div>
