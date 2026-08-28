<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar"],
    id: "p-calendar-8",
    interactive: true,
    responsive: false,
    title: "Calendar multiple selection",
  });
</script>

<script lang="ts">
  import { Calendar } from "@coss-sv/ui";
  const today = new Date(2026, 7, 28, 12);
  const addDays = (days: number) => new Date(2026, 7, 28 + days, 12);
  let date = $state<Date[] | undefined>([addDays(-17), addDays(2), addDays(6), addDays(8)]);
</script>

<Calendar mode="multiple" bind:selected={date} {today} />
