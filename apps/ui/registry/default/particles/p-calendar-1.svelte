<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
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
  let date = $state<Date | undefined>(new Date());
</script>

<Calendar mode="single" bind:selected={date} />
