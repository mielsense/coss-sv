<!-- biome-ignore-all lint/a11y/noAutofocus: COSS focuses the particle filter when the chooser opens. -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import LabelIcon from "@hugeicons/core-free-icons/LabelIcon";
  import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
  import { Combobox, HugeiconsIcon } from "@coss-sv/ui";
  import type { ParticleCatalogEntry } from "./catalog.js";
  import {
    groupParticleSearchItems,
    type ParticleSearchGroup,
    type ParticleSearchItem,
  } from "./model.js";

  let {
    items,
    particles,
    selectedItems,
  }: {
    items: readonly ParticleSearchItem[];
    particles: readonly ParticleCatalogEntry[];
    selectedItems: readonly ParticleSearchItem[];
  } = $props();

  let open = $state(false);
  const groupedItems = $derived(groupParticleSearchItems(items, selectedItems, particles));

  $effect(() => {
    if (selectedItems.length === 0) open = true;
  });

  function updateSelectedItems(nextItems: ParticleSearchItem[]) {
    const url = new URL(page.url);
    const tags = nextItems.map(({ value }) => value).join(",");
    if (tags) url.searchParams.set("tags", tags);
    else url.searchParams.delete("tags");
    open = false;
    void goto(url, { keepFocus: true, noScroll: true });
  }
</script>

<div class="mx-auto max-w-2xl">
  <Combobox.Root
    autoHighlight
    items={groupedItems}
    itemToStringLabel={(item: ParticleSearchItem) => item.label}
    itemToStringValue={(item: ParticleSearchItem) => item.value}
    multiple
    onValueChange={updateSelectedItems}
    bind:open
    value={[...selectedItems]}
  >
    <Combobox.Chips
      aria-label="Filter particles"
      class="rounded-xl p-[calc(--spacing(2)-1px)] before:rounded-xl **:data-[slot=combobox-start-addon]:[&_svg]:-me-0.5"
    >
      {#snippet startAddon()}
        <HugeiconsIcon
          aria-hidden="true"
          class="size-5.5 sm:size-5"
          icon={Search01Icon}
          strokeWidth={2}
        />
      {/snippet}
      {#each selectedItems as item (item.value)}
        <Combobox.Chip aria-label={item.label}>
          <span class="flex items-center gap-1.5">
            <HugeiconsIcon aria-hidden="true" class="opacity-80" icon={LabelIcon} strokeWidth={2} />
            <span>{item.label}</span>
          </span>
        </Combobox.Chip>
      {/each}
      <Combobox.ChipsInput aria-label="Search components" autofocus size="lg" />
    </Combobox.Chips>
    <Combobox.Popup>
      <Combobox.Empty>No filters found.</Combobox.Empty>
      <Combobox.List>
        <Combobox.Collection>
          {#snippet children(group: ParticleSearchGroup)}
            {#if group.type === "disabled"}
              <Combobox.Separator class="my-2" />
            {/if}
            <Combobox.Group items={group.items}>
              <Combobox.GroupLabel>
                {group.type === "enabled" ? "Filter particles" : "No matches"}
              </Combobox.GroupLabel>
              <Combobox.Collection>
                {#snippet children(item: ParticleSearchItem)}
                  <Combobox.Item disabled={group.type === "disabled"} value={item}>
                    <span class="flex items-center gap-2">
                      <HugeiconsIcon
                        aria-hidden="true"
                        class="opacity-80"
                        icon={LabelIcon}
                        strokeWidth={2}
                      />
                      <span>{item.label}</span>
                    </span>
                  </Combobox.Item>
                {/snippet}
              </Combobox.Collection>
            </Combobox.Group>
          {/snippet}
        </Combobox.Collection>
      </Combobox.List>
    </Combobox.Popup>
  </Combobox.Root>
</div>
