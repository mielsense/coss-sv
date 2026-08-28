<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["badge", "button", "calendar", "popover"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-date-picker-7",
    interactive: true,
    responsive: false,
    title: "Multiple date picker",
  });
</script>

<script lang="ts">
  import { Calendar03Icon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";
  import { Badge, buttonVariants, Calendar, Popover } from "@coss-sv/ui";
  const today = new Date(2026, 7, 28, 12);
  let dates = $state<Date[] | undefined>();
  const format = (value: Date) =>
    new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(value);
</script>

<Popover.Root
  ><Popover.Trigger class={buttonVariants({ class: "w-full justify-start", variant: "outline" })}
    ><HugeiconsIcon class="shrink-0" icon={Calendar03Icon} aria-hidden="true" /><span
      class="flex flex-wrap gap-1"
      >{#if dates?.length}{#each dates.slice(0, 3) as selected (selected.toISOString())}<Badge
            variant="secondary">{format(selected)}</Badge
          >{/each}{#if dates.length > 3}<Badge variant="secondary">+{dates.length - 3}</Badge
          >{/if}{:else}<span>Pick dates</span>{/if}</span
    ></Popover.Trigger
  ><Popover.Popup><Calendar mode="multiple" bind:selected={dates} {today} /></Popover.Popup
  ></Popover.Root
>
