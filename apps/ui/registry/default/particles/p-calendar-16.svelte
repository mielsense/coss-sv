<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "calendar"],
    id: "p-calendar-16",
    interactive: true,
    responsive: false,
    title: "Calendar today control",
  });
</script>

<script lang="ts">
  import { Button, Calendar } from "@coss-sv/ui";
  const today = new Date(2026, 7, 28, 12);
  const selectedDay = new Date(2026, 6, 31, 12);
  let month = $state(selectedDay);
  let date = $state<Date | undefined>(selectedDay);
</script>

<div class="flex flex-col items-start gap-2">
  <Calendar mode="single" bind:month bind:selected={date} {today} /><Button
    onclick={() => {
      date = today;
      month = today;
    }}
    size="sm"
    variant="outline">Today</Button
  >
</div>
