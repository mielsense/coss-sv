<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "calendar", "popover"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-date-picker-2",
    interactive: true,
    responsive: false,
    title: "Date range picker",
  });
</script>

<script lang="ts">
  import { Calendar03Icon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@coss-sv/ui";
  import { buttonVariants, Calendar, Popover, type DateRange } from "@coss-sv/ui";
  const today = new Date(2026, 7, 28, 12);
  let date = $state<DateRange | undefined>();
  const format = (value: Date) =>
    new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(
      value,
    );
</script>

<Popover.Root
  ><Popover.Trigger class={buttonVariants({ class: "w-full justify-start", variant: "outline" })}
    ><HugeiconsIcon
      icon={Calendar03Icon}
      aria-hidden="true"
      strokeWidth={2}
    />{#if date?.from}{format(date.from)}{#if date.to}
        - {format(date.to)}{/if}{:else}<span>Pick a date range</span>{/if}</Popover.Trigger
  ><Popover.Popup
    ><Calendar defaultMonth={date?.from} mode="range" bind:selected={date} {today} /></Popover.Popup
  ></Popover.Root
>
