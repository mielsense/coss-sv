<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar", "popover", "select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-date-picker-8",
    interactive: true,
    responsive: false,
    title: "Select-style date picker",
  });
</script>

<script lang="ts">
  import { Calendar, Popover, Select } from "@coss-sv/ui";
  const today = new Date(2026, 7, 28, 12);
  let date = $state<Date | undefined>();
  const format = (value: Date) =>
    new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(value);
</script>

<Popover.Root
  ><Popover.Trigger as="div"
    ><Select.Button data-placeholder={!date ? "" : undefined}
      >{date ? format(date) : "Pick a date"}</Select.Button
    ></Popover.Trigger
  ><Popover.Popup
    ><Calendar defaultMonth={date} mode="single" bind:selected={date} {today} /></Popover.Popup
  ></Popover.Root
>
