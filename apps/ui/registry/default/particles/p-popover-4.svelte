<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["badge", "button", "checkbox", "checkbox-group", "group", "label", "popover"],
    id: "p-popover-4",
    interactive: true,
    responsive: true,
    title: "Occurrence picker popover",
  });
</script>

<script lang="ts">
  import {
    Badge,
    Button,
    buttonVariants,
    CheckboxGroup,
    Group,
    HugeiconsIcon,
    Label,
    Popover,
  } from "@coss-sv/ui";
  import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

  const occurrences = [
    { date: "Wed, Jul 15", id: "occurrence-1", time: "9:00 – 9:30am" },
    { date: "Wed, Jul 15", id: "occurrence-2", time: "10:00 – 10:30am" },
    { date: "Wed, Jul 15", id: "occurrence-3", time: "11:00 – 11:30am" },
  ] as const;
  let selected = $state<string[]>(occurrences.map(({ id }) => id));
</script>

<div class="flex gap-2">
  <Button size="xs" variant="outline">Reject</Button><Group.Root aria-label="Confirm booking">
    <Button size="xs">Confirm all</Button><Group.Separator class="bg-primary/72" />
    <Popover.Root>
      <Popover.Trigger
        aria-label="Choose occurrences to confirm"
        class={buttonVariants({ size: "icon-xs" })}
      >
        <HugeiconsIcon aria-hidden="true" icon={ArrowDown01Icon} strokeWidth={2} />
      </Popover.Trigger><Popover.Popup align="end" class="w-84">
        <div class="mb-3">
          <Popover.Title class="text-sm">Confirm occurrences</Popover.Title><Popover.Description
            class="text-xs"
          >
            {occurrences.length}
            pending for this booking
          </Popover.Description>
        </div>
        <CheckboxGroup.Root
          aria-label="Occurrences to confirm"
          allValues={occurrences.map(({ id }) => id)}
          bind:value={selected}
          class="gap-0 self-stretch"
        >
          {#each occurrences as occurrence (occurrence.id)}
            <Label class="flex w-full gap-2 py-1.5">
              <CheckboxGroup.Item value={occurrence.id} />
              <span class="tabular-nums">{occurrence.time}</span>
              <span class="ms-auto font-normal text-muted-foreground">
                {occurrence.date}
              </span>
            </Label>
          {/each}
        </CheckboxGroup.Root>
        <div class="mt-3 flex justify-end gap-2">
          <Popover.Close
            class={buttonVariants({ size: "xs", variant: "ghost" })}
            disabled={selected.length === 0}
          >
            Reject selected
          </Popover.Close><Popover.Close
            class={buttonVariants({ size: "xs" })}
            disabled={selected.length === 0}
          >
            Confirm selected
            <Badge class="-me-1 text-primary-foreground/60">
              {selected.length}
            </Badge>
          </Popover.Close>
        </div>
      </Popover.Popup>
    </Popover.Root>
  </Group.Root>
</div>
