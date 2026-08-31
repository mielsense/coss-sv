<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
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
  let date = $state<Date | undefined>(new Date());
</script>

<Calendar
  classNames={{
    month_caption: "ms-0 me-[calc(var(--cell-size)*2)] justify-start",
    nav: "justify-end",
  }}
  mode="single"
  bind:selected={date}
/>
