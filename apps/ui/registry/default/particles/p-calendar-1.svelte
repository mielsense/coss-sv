<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar"],
    id: "p-calendar-1",
    interactive: true,
    responsive: false,
    title: "Calendar single selection",
  });
</script>

<script lang="ts">
  import { Calendar } from "@coss-sv/ui";
  let date = $state<Date | undefined>(new Date(2026, 7, 28, 12));
</script>

<Calendar mode="single" bind:selected={date} today={new Date(2026, 7, 28, 12)} />
