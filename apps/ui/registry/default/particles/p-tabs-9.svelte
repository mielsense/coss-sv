<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({ components: ["tabs"], id: "p-tabs-9", interactive: true, responsive: false, title: "Tabs with underline and icon on top" });
</script>
<script lang="ts">import { Tabs } from "@coss-sv/ui";</script>

<Tabs.Root class="items-center" defaultValue="tab-1">
  <div class="border-b"><Tabs.List variant="underline">
    <Tabs.Tab class="h-auto! flex-col gap-1.5 py-[calc(--spacing(2)-1px)]" value="tab-1">
      {@render houseIcon()} Overview
    </Tabs.Tab>
    <Tabs.Tab class="h-auto! flex-col gap-1.5 py-[calc(--spacing(2)-1px)]" value="tab-2">
      {@render panelsIcon()} Projects
    </Tabs.Tab>
    <Tabs.Tab class="h-auto! flex-col gap-1.5 py-[calc(--spacing(2.5)-1px)]" value="tab-3">
      {@render boxIcon()} Packages
    </Tabs.Tab>
  </Tabs.List></div>
  <Tabs.Panel value="tab-1"><p class="p-4 text-center text-muted-foreground text-xs">Overview content</p></Tabs.Panel>
  <Tabs.Panel value="tab-2"><p class="p-4 text-center text-muted-foreground text-xs">Projects content</p></Tabs.Panel>
  <Tabs.Panel value="tab-3"><p class="p-4 text-center text-muted-foreground text-xs">Packages content</p></Tabs.Panel>
</Tabs.Root>

{#snippet houseIcon()}<svg aria-hidden="true" class="size-4 opacity-60" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>{/snippet}
{#snippet panelsIcon()}<svg aria-hidden="true" class="size-4 opacity-60" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>{/snippet}
{#snippet boxIcon()}<svg aria-hidden="true" class="size-4 opacity-60" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="m21 8-9 5-9-5"></path><path d="M3 8l9-5 9 5v8l-9 5-9-5Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>{/snippet}
