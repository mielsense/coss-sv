<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar", "field", "input-group"],
    id: "p-calendar-17",
    interactive: true,
    responsive: false,
    title: "Calendar date input",
  });
</script>

<script lang="ts">
  import { Calendar03Icon } from "@hugeicons/core-free-icons";
  import { Calendar, Field, HugeiconsIcon, InputGroup } from "@coss-sv/ui";
  const today = new Date(2026, 7, 28, 12);
  let date = $state<Date | undefined>(today);
  let month = $state(today);
  let inputValue = $state("2026-08-28");
  function selectDate(selected: Date | undefined) {
    date = selected;
    inputValue = selected
      ? `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, "0")}-${String(selected.getDate()).padStart(2, "0")}`
      : "";
    if (selected) month = selected;
  }
  function updateDate(value: string) {
    inputValue = value;
    const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : undefined;
    if (parsed && !Number.isNaN(parsed.getTime())) {
      date = parsed;
      month = parsed;
    } else if (!value) date = undefined;
  }
</script>

<div class="flex flex-col gap-2">
  <Calendar mode="single" bind:month selected={date} onSelect={selectDate} {today} /><Field.Root
    class="flex-row items-center gap-4"
    ><Field.Label class="whitespace-nowrap">Enter date</Field.Label><InputGroup.Root
      ><InputGroup.Input
        aria-label="Select date"
        class="*:[input]:[&::-webkit-calendar-picker-indicator]:hidden *:[input]:[&::-webkit-calendar-picker-indicator]:appearance-none"
        type="date"
        value={inputValue}
        oninput={(event) => updateDate(event.currentTarget.value)}
      /><InputGroup.Addon
        ><HugeiconsIcon
          icon={Calendar03Icon}
          aria-hidden="true"
          strokeWidth={2}
        /></InputGroup.Addon
      ></InputGroup.Root
    ></Field.Root
  >
</div>
