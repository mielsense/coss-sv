<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({ components: ["badge", "tabs"], id: "p-tabs-12", interactive: true, responsive: false, title: "Tabs with icon only and count badge" });
</script>
<script lang="ts">import { Badge, Tabs } from "@coss-sv/ui";</script>

<Tabs.Root class="items-center" defaultValue="tab-1">
  <Tabs.List>
    <Tabs.Tab aria-label="Overview" class="size-10!" value="tab-1">{@render houseIcon()}</Tabs.Tab>
    <Tabs.Tab aria-label="Inbox" class="size-10!" value="tab-2">
      {@render inboxIcon()}<Badge class="absolute end-0 top-0 rounded-full not-in-data-active:opacity-64" size="sm">5</Badge>
    </Tabs.Tab>
    <Tabs.Tab aria-label="Settings" class="size-10!" value="tab-3">{@render settingsIcon()}</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="tab-1"><p class="p-4 text-center text-muted-foreground text-xs">Overview content</p></Tabs.Panel>
  <Tabs.Panel value="tab-2"><p class="p-4 text-center text-muted-foreground text-xs">Inbox content</p></Tabs.Panel>
  <Tabs.Panel value="tab-3"><p class="p-4 text-center text-muted-foreground text-xs">Settings content</p></Tabs.Panel>
</Tabs.Root>

{#snippet houseIcon()}<svg aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>{/snippet}
{#snippet inboxIcon()}<svg aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>{/snippet}
{#snippet settingsIcon()}<svg aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>{/snippet}
