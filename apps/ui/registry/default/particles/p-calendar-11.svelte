<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar"],
    id: "p-calendar-11",
    interactive: true,
    responsive: false,
    title: "Left aligned calendar caption",
  });
</script>

<script lang="ts">
  import { Calendar } from "@coss-sv/ui";
  const today = new Date(2026, 7, 28, 12);
  let date = $state<Date | undefined>(today);
</script>

<Calendar
  classNames={{
    month_caption: "ms-0 me-[calc(var(--cell-size)*2)] justify-start",
    nav: "justify-end",
  }}
  mode="single"
  bind:selected={date}
  {today}
/>
