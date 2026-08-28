<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar"],
    id: "p-calendar-2",
    interactive: true,
    responsive: true,
    title: "Responsive calendar",
  });
</script>

<script lang="ts">
  import { Calendar } from "@coss-sv/ui";
  let date = $state<Date | undefined>(new Date(2026, 7, 28, 12));
</script>

<Calendar
  class="[--cell-size:--spacing(11)] sm:[--cell-size:--spacing(10)]"
  mode="single"
  bind:selected={date}
  today={new Date(2026, 7, 28, 12)}
/>
