<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
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
  let date = $state<Date | undefined>(new Date());
</script>

<Calendar classNames={{ day_button: "rounded-full" }} mode="single" bind:selected={date} />
