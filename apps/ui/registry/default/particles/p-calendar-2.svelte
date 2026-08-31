<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
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
  let date = $state<Date | undefined>(new Date());
</script>

<Calendar
  class="[--cell-size:--spacing(11)] sm:[--cell-size:--spacing(10)]"
  mode="single"
  bind:selected={date}
/>
