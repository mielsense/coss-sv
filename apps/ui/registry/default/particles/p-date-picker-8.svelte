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
  import { UnfoldMoreIcon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";
  import { Calendar, cn, Popover, Select } from "@coss-sv/ui";
  import { formatDatePpp } from "../lib/date-format.js";
  const today = new Date(2026, 7, 28, 12);
  let date = $state<Date | undefined>();
</script>

<Popover.Root
  ><Popover.Trigger
    as="button"
    class={cn(Select.selectTriggerClass, "min-w-0")}
    data-placeholder={!date ? "" : undefined}
    ><span class="flex-1 truncate in-data-placeholder:text-muted-foreground/72"
      >{date ? formatDatePpp(date) : "Pick a date"}</span
    ><HugeiconsIcon
      aria-hidden="true"
      class={Select.selectTriggerIconClassName}
      icon={UnfoldMoreIcon}
      strokeWidth={2}
    /></Popover.Trigger
  ><Popover.Popup
    ><Calendar defaultMonth={date} mode="single" bind:selected={date} {today} /></Popover.Popup
  ></Popover.Root
>
