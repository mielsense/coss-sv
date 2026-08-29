<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "calendar", "popover"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-date-picker-4",
    interactive: true,
    responsive: true,
    title: "Date picker shortcuts",
  });
</script>

<script lang="ts">
  import { Calendar03Icon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@coss-sv/ui";
  import { Button, buttonVariants, Calendar, Popover } from "@coss-sv/ui";
  import { formatDatePpp } from "$lib/date-format.js";
  const today = new Date(2026, 7, 28, 12);
  const options = [
    { label: "Today", days: 0 },
    { label: "Tomorrow", days: 1 },
    { label: "In 3 days", days: 3 },
    { label: "In a week", days: 7 },
  ];
  let month = $state(today);
  let date = $state<Date | undefined>(today);
  const offset = (days: number) => new Date(2026, 7, 28 + days, 12);
</script>

<Popover.Root
  ><Popover.Trigger class={buttonVariants({ class: "w-full justify-start", variant: "outline" })}
    ><HugeiconsIcon icon={Calendar03Icon} aria-hidden="true" strokeWidth={2} />{date
      ? formatDatePpp(date)
      : "Pick a date"}</Popover.Trigger
  ><Popover.Popup
    ><div class="flex max-sm:flex-col">
      <div class="relative py-1 ps-1 max-sm:order-1 max-sm:border-t">
        <div class="flex h-full flex-col sm:border-e sm:pe-3">
          {#each options as option}<Button
              class="w-full justify-start"
              onclick={() => {
                date = offset(option.days);
                month = date;
              }}
              size="sm"
              variant="ghost">{option.label}</Button
            >{/each}
        </div>
      </div>
      <Calendar class="max-sm:pb-3 sm:ps-2" mode="single" bind:month bind:selected={date} {today} />
    </div></Popover.Popup
  ></Popover.Root
>
