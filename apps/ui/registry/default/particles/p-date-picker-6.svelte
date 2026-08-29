<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "calendar", "popover"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-date-picker-6",
    interactive: true,
    responsive: false,
    title: "Date picker that closes after selection",
  });
</script>

<script lang="ts">
  import { Calendar03Icon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@coss-sv/ui";
  import { buttonVariants, Calendar, Popover } from "@coss-sv/ui";
  import { formatDatePpp } from "../lib/date-format.js";
  const today = new Date(2026, 7, 28, 12);
  let date = $state<Date | undefined>();
  let popoverOpen = $state(false);
</script>

<Popover.Root bind:open={popoverOpen}
  ><Popover.Trigger class={buttonVariants({ class: "w-full justify-start", variant: "outline" })}
    ><HugeiconsIcon icon={Calendar03Icon} aria-hidden="true" strokeWidth={2} />{date
      ? formatDatePpp(date)
      : "Pick a date"}</Popover.Trigger
  ><Popover.Popup
    ><Calendar
      mode="single"
      selected={date}
      onSelect={(next) => {
        date = next;
        popoverOpen = false;
      }}
      {today}
    /></Popover.Popup
  ></Popover.Root
>
