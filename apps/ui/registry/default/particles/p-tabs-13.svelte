<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["tabs", "tooltip"],
  id: "p-tabs-13",
  interactive: true,
  responsive: false,
  title: "Tabs with icon only and grouped tooltips",
});
</script>

<script lang="ts">
import { Tabs, Tooltip } from "@coss-sv/ui";
</script>

<Tooltip.Provider>
  <Tabs.Root class="items-center" defaultValue="tab-1">
    <Tabs.List>
      <Tooltip.Root>
        <Tooltip.Trigger as="span" class="inline-flex">
          <Tabs.Tab aria-label="Overview" value="tab-1">{@render houseIcon()}</Tabs.Tab>
        </Tooltip.Trigger>
        <Tooltip.Popup>Overview</Tooltip.Popup>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger as="span" class="inline-flex">
          <Tabs.Tab aria-label="Projects" value="tab-2">{@render panelsIcon()}</Tabs.Tab>
        </Tooltip.Trigger>
        <Tooltip.Popup>Projects</Tooltip.Popup>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger as="span" class="inline-flex">
          <Tabs.Tab aria-label="Settings" value="tab-3">{@render settingsIcon()}</Tabs.Tab>
        </Tooltip.Trigger>
        <Tooltip.Popup>Settings</Tooltip.Popup>
      </Tooltip.Root>
    </Tabs.List>
    <Tabs.Panel value="tab-1">
      <p class="p-4 text-center text-muted-foreground text-xs">Overview content</p>
    </Tabs.Panel>
    <Tabs.Panel value="tab-2">
      <p class="p-4 text-center text-muted-foreground text-xs">Projects content</p>
    </Tabs.Panel>
    <Tabs.Panel value="tab-3">
      <p class="p-4 text-center text-muted-foreground text-xs">Settings content</p>
    </Tabs.Panel>
  </Tabs.Root>
</Tooltip.Provider>

{#snippet houseIcon()}<svg
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  ><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path
      d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
    ></path></svg
>{/snippet}
{#snippet panelsIcon()}<svg
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  ><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18"></path><path
      d="M9 21V9"
    ></path></svg
>{/snippet}
{#snippet settingsIcon()}<svg
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  ><path
      d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
    ></path><circle cx="12" cy="12" r="3"></circle></svg
>{/snippet}
