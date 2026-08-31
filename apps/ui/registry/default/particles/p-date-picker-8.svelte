<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
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
  import { Calendar, cn, HugeiconsIcon, Popover, Select } from "@coss-sv/ui";
  import UnfoldMoreIcon from "@hugeicons/core-free-icons/UnfoldMoreIcon";
  import { formatDatePpp } from "../lib/date-format.js";

  let date = $state<Date | undefined>();
</script>

<Popover.Root>
  <Popover.Trigger
    as="button"
    class={cn(Select.selectTriggerClass, "min-w-0")}
    data-placeholder={!date ? "" : undefined}
  >
    <span class="flex-1 truncate in-data-placeholder:text-muted-foreground/72">
      {date ? formatDatePpp(date) : "Pick a date"}
    </span>
    <HugeiconsIcon
      aria-hidden="true"
      class={Select.selectTriggerIconClassName}
      icon={UnfoldMoreIcon}
      strokeWidth={2}
    />
  </Popover.Trigger><Popover.Popup>
    <Calendar defaultMonth={date} mode="single" bind:selected={date} />
  </Popover.Popup>
</Popover.Root>
