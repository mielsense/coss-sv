<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar"],
    id: "p-calendar-9",
    interactive: true,
    responsive: false,
    title: "Rounded calendar days",
  });
</script>

<script lang="ts">
  import { Calendar } from "@coss-sv/ui";
  const today = new Date(2026, 7, 28, 12);
  let date = $state<Date | undefined>(today);
</script>

<Calendar classNames={{ day_button: "rounded-full" }} mode="single" bind:selected={date} {today} />
