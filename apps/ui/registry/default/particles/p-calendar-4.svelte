<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar"],
    id: "p-calendar-4",
    interactive: true,
    responsive: false,
    title: "Calendar dropdown caption",
  });
</script>

<script lang="ts">
  import { Calendar } from "@coss-sv/ui";
  let date = $state<Date | undefined>(new Date());
</script>

<Calendar
  captionLayout="dropdown"
  endMonth={new Date(2030, 11)}
  mode="single"
  bind:selected={date}
  startMonth={new Date(1930, 0)}
/>
