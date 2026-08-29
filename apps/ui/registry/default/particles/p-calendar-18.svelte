<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar", "field", "input-group"],
    id: "p-calendar-18",
    interactive: true,
    responsive: false,
    title: "Calendar time input",
  });
</script>

<script lang="ts">
  import { Clock01Icon } from "@hugeicons/core-free-icons";
  import { Calendar, Field, HugeiconsIcon, InputGroup } from "@coss-sv/ui";
  const today = new Date(2026, 7, 28, 12);
  let date = $state<Date | undefined>(today);
  let month = $state(today);
  let timeValue = $state("12:00:00");
</script>

<div class="flex flex-col gap-2">
  <Calendar mode="single" bind:month bind:selected={date} {today} /><Field.Root
    class="flex-row items-center gap-3"
    ><Field.Label class="whitespace-nowrap text-xs">Enter time</Field.Label><InputGroup.Root
      class="grow"
      ><InputGroup.Input
        aria-label="Select time"
        class="*:[input]:[&::-webkit-calendar-picker-indicator]:hidden *:[input]:[&::-webkit-calendar-picker-indicator]:appearance-none"
        step="1"
        type="time"
        bind:value={timeValue}
      /><InputGroup.Addon
        ><HugeiconsIcon icon={Clock01Icon} aria-hidden="true" strokeWidth={2} /></InputGroup.Addon
      ></InputGroup.Root
    ></Field.Root
  >
</div>
