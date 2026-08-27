<script lang="ts">
let {
  class: className = "",
  variant = "main",
}: { class?: string; variant?: "main" | "secondary" } = $props();
</script>

<div
  class={`h-1.5 rounded-full ${variant === "main" ? "bg-muted-foreground/40" : "bg-muted-foreground/20"} ${className}`}
></div>
