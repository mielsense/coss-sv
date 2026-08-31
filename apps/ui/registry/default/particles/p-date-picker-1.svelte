<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "calendar", "popover"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-date-picker-1",
    interactive: true,
    responsive: false,
    title: "Date picker",
  });
</script>

<script lang="ts">
  import { buttonVariants, Calendar, HugeiconsIcon, Popover } from "@coss-sv/ui";
  import Calendar03Icon from "@hugeicons/core-free-icons/Calendar03Icon";
  import { formatDatePpp } from "../lib/date-format.js";

  let date = $state<Date | undefined>();
</script>

<Popover.Root>
  <Popover.Trigger class={buttonVariants({ class: "w-full justify-start", variant: "outline" })}>
    <HugeiconsIcon icon={Calendar03Icon} aria-hidden="true" strokeWidth={2} />{date
      ? formatDatePpp(date)
      : "Pick a date"}
  </Popover.Trigger><Popover.Popup>
    <Calendar defaultMonth={date} mode="single" bind:selected={date} />
  </Popover.Popup>
</Popover.Root>
