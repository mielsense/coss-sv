<script lang="ts">
import { Badge, Tabs } from "@coss-sv/ui";

let controlledValue = $state<Tabs.TabsValue>("review-1");
</script>

<div class="tabs-fixture">
  <section data-particle="p-tabs-1">
    <Tabs.Root defaultValue="tab-1">
      <Tabs.List>
        <Tabs.Tab value="tab-1">Tab 1</Tabs.Tab>
        <Tabs.Tab value="tab-2">Tab 2</Tabs.Tab>
        <Tabs.Tab value="tab-3">Tab 3</Tabs.Tab>
      </Tabs.List>
      {@render panels("Tab 1 content", "Tab 2 content", "Tab 3 content")}
    </Tabs.Root>
  </section>

  <section data-particle="p-tabs-2">
    <Tabs.Root defaultValue="tab-1">
      <div class="border-b">
        <Tabs.List variant="underline">
          <Tabs.Tab value="tab-1">Tab 1</Tabs.Tab>
          <Tabs.Tab value="tab-2">Tab 2</Tabs.Tab>
          <Tabs.Tab value="tab-3">Tab 3</Tabs.Tab>
        </Tabs.List>
      </div>
      {@render panels("Tab 1 content", "Tab 2 content", "Tab 3 content")}
    </Tabs.Root>
  </section>

  <section data-orientation="vertical" data-particle="p-tabs-3">
    <Tabs.Root class="w-full" defaultValue="tab-1" orientation="vertical">
      <Tabs.List>
        <Tabs.Tab value="tab-1">Tab 1</Tabs.Tab>
        <Tabs.Tab value="tab-2">Tab 2</Tabs.Tab>
        <Tabs.Tab value="tab-3">Tab 3</Tabs.Tab>
      </Tabs.List>
      {@render panels("Tab 1 content", "Tab 2 content", "Tab 3 content")}
    </Tabs.Root>
  </section>

  <section data-orientation="vertical" data-particle="p-tabs-4">
    <Tabs.Root class="w-full flex-row" defaultValue="tab-1" orientation="vertical">
      <div class="border-s">
        <Tabs.List variant="underline">
          <Tabs.Tab value="tab-1">Tab 1</Tabs.Tab>
          <Tabs.Tab value="tab-2">Tab 2</Tabs.Tab>
          <Tabs.Tab value="tab-3">Tab 3</Tabs.Tab>
        </Tabs.List>
      </div>
      {@render panels("Tab 1 content", "Tab 2 content", "Tab 3 content")}
    </Tabs.Root>
  </section>

  <section data-particle="p-tabs-5">
    <Tabs.Root defaultValue="tab-1">
      <Tabs.List class="[--radius:9999px]">
        <Tabs.Tab value="tab-1">Tab 1</Tabs.Tab>
        <Tabs.Tab value="tab-2">Tab 2</Tabs.Tab>
        <Tabs.Tab value="tab-3">Tab 3</Tabs.Tab>
      </Tabs.List>
      {@render panels("Tab 1 content", "Tab 2 content", "Tab 3 content")}
    </Tabs.Root>
  </section>

  <section data-particle="p-tabs-6">
    <Tabs.Root defaultValue="tab-1">
      <Tabs.List>
        <Tabs.Tab value="tab-1">{@render houseIcon()} Overview</Tabs.Tab>
        <Tabs.Tab value="tab-2">{@render panelsIcon()} Projects</Tabs.Tab>
        <Tabs.Tab value="tab-3">{@render settingsIcon()} Settings</Tabs.Tab>
      </Tabs.List>
      {@render panels("Overview content", "Projects content", "Settings content")}
    </Tabs.Root>
  </section>

  <section data-particle="p-tabs-7">
    <Tabs.Root defaultValue="tab-1">
      <div class="border-b">
        <Tabs.List variant="underline">
          <Tabs.Tab value="tab-1">{@render houseIcon()} Overview</Tabs.Tab>
          <Tabs.Tab value="tab-2">{@render panelsIcon()} Projects</Tabs.Tab>
          <Tabs.Tab value="tab-3">{@render settingsIcon()} Settings</Tabs.Tab>
        </Tabs.List>
      </div>
      {@render panels("Overview content", "Projects content", "Settings content")}
    </Tabs.Root>
  </section>

  <section data-particle="p-tabs-8">
    <Tabs.Root class="items-center" defaultValue="tab-1">
      <Tabs.List>
        <Tabs.Tab aria-label="Overview" value="tab-1">{@render houseIcon()}</Tabs.Tab>
        <Tabs.Tab aria-label="Projects" value="tab-2">{@render panelsIcon()}</Tabs.Tab>
        <Tabs.Tab aria-label="Settings" value="tab-3">{@render settingsIcon()}</Tabs.Tab>
      </Tabs.List>
      {@render panels("Overview content", "Projects content", "Settings content")}
    </Tabs.Root>
  </section>

  <section data-particle="p-tabs-9">
    <Tabs.Root class="items-center" defaultValue="tab-1">
      <div class="border-b">
        <Tabs.List variant="underline">
          <Tabs.Tab class="h-auto! flex-col gap-1.5 py-[calc(--spacing(2)-1px)]" value="tab-1">
            {@render houseIcon("opacity-60", 16)}
            Overview
          </Tabs.Tab>
          <Tabs.Tab class="h-auto! flex-col gap-1.5 py-[calc(--spacing(2)-1px)]" value="tab-2">
            {@render panelsIcon("opacity-60", 16)}
            Projects
          </Tabs.Tab>
          <Tabs.Tab class="h-auto! flex-col gap-1.5 py-[calc(--spacing(2.5)-1px)]" value="tab-3">
            {@render boxIcon("opacity-60", 16)}
            Packages
          </Tabs.Tab>
        </Tabs.List>
      </div>
      {@render panels("Overview content", "Projects content", "Packages content")}
    </Tabs.Root>
  </section>

  <section data-particle="p-tabs-10">
    <Tabs.Root defaultValue="tab-1">
      <Tabs.List>
        <Tabs.Tab value="tab-1">
          All
          <Badge class="not-in-data-active:text-muted-foreground" variant="outline">128</Badge>
        </Tabs.Tab>
        <Tabs.Tab value="tab-2">
          Pending
          <Badge class="not-in-data-active:text-muted-foreground" variant="outline">8</Badge>
        </Tabs.Tab>
        <Tabs.Tab value="tab-3">
          Completed
          <Badge class="not-in-data-active:text-muted-foreground" variant="outline">120</Badge>
        </Tabs.Tab>
      </Tabs.List>
      {@render panels("All items content", "Pending items content", "Completed items content")}
    </Tabs.Root>
  </section>

  <section data-orientation="vertical" data-particle="p-tabs-11">
    <Tabs.Root class="w-full flex-row" defaultValue="tab-1" orientation="vertical">
      <div class="border-s">
        <Tabs.List variant="underline">
          <Tabs.Tab value="tab-1">{@render houseIcon()} Overview</Tabs.Tab>
          <Tabs.Tab value="tab-2">{@render panelsIcon()} Projects</Tabs.Tab>
          <Tabs.Tab value="tab-3">{@render settingsIcon()} Settings</Tabs.Tab>
        </Tabs.List>
      </div>
      {@render panels("Overview content", "Projects content", "Settings content")}
    </Tabs.Root>
  </section>

  <section data-particle="p-tabs-12">
    <Tabs.Root class="items-center" defaultValue="tab-1">
      <Tabs.List>
        <Tabs.Tab aria-label="Overview" class="size-10!" value="tab-1">
          {@render houseIcon()}
        </Tabs.Tab>
        <Tabs.Tab aria-label="Inbox" class="size-10!" value="tab-2">
          {@render inboxIcon()}
          <Badge class="absolute end-0 top-0 rounded-full not-in-data-active:opacity-64" size="sm">
            5
          </Badge>
        </Tabs.Tab>
        <Tabs.Tab aria-label="Settings" class="size-10!" value="tab-3">
          {@render settingsIcon()}
        </Tabs.Tab>
      </Tabs.List>
      {@render panels("Overview content", "Inbox content", "Settings content")}
    </Tabs.Root>
  </section>

  <section data-particle="p-tabs-14">
    <Tabs.Root defaultValue="tab-1">
      <Tabs.List size="sm">
        <Tabs.Tab value="tab-1">Tab 1</Tabs.Tab>
        <Tabs.Tab value="tab-2">Tab 2</Tabs.Tab>
        <Tabs.Tab value="tab-3">Tab 3</Tabs.Tab>
      </Tabs.List>
      {@render panels("Tab 1 content", "Tab 2 content", "Tab 3 content")}
    </Tabs.Root>
  </section>

  <section data-particle="p-tabs-15">
    <Tabs.Root defaultValue="tab-1">
      <Tabs.List size="lg">
        <Tabs.Tab value="tab-1">Tab 1</Tabs.Tab>
        <Tabs.Tab value="tab-2">Tab 2</Tabs.Tab>
        <Tabs.Tab value="tab-3">Tab 3</Tabs.Tab>
      </Tabs.List>
      {@render panels("Tab 1 content", "Tab 2 content", "Tab 3 content")}
    </Tabs.Root>
  </section>

  <section class="review-probes" data-review-probes="tabs">
    <div class="review-actions">
      <button type="button" onclick={() => (controlledValue = "review-1")}>Select first</button>
      <button type="button" onclick={() => (controlledValue = "review-3")}>Select third</button>
      <output data-testid="tabs-controlled-value">{controlledValue}</output>
    </div>
    <Tabs.Root bind:value={controlledValue}>
      <Tabs.List activateOnFocus aria-label="Controlled lifecycle tabs">
        <Tabs.Tab data-testid="tabs-review-first" value="review-1">First</Tabs.Tab>
        <Tabs.Tab disabled data-testid="tabs-review-disabled" value="review-2">Disabled</Tabs.Tab>
        <Tabs.Tab data-testid="tabs-review-third" value="review-3">Third</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel data-testid="tabs-review-unmounted-panel" value="review-1">
        This panel unmounts when inactive.
      </Tabs.Panel>
      <Tabs.Panel keepMounted data-testid="tabs-review-mounted-panel" value="review-2">
        This disabled panel remains mounted while inactive.
      </Tabs.Panel>
      <Tabs.Panel data-testid="tabs-review-third-panel" value="review-3">
        Third controlled panel.
      </Tabs.Panel>
    </Tabs.Root>
  </section>
</div>

{#snippet panels(first: string, second: string, third: string)}
  <Tabs.Panel value="tab-1">
    <p class="p-4 text-center text-muted-foreground text-xs">{first}</p>
  </Tabs.Panel>
  <Tabs.Panel value="tab-2">
    <p class="p-4 text-center text-muted-foreground text-xs">{second}</p>
  </Tabs.Panel>
  <Tabs.Panel value="tab-3">
    <p class="p-4 text-center text-muted-foreground text-xs">{third}</p>
  </Tabs.Panel>
{/snippet}

{#snippet houseIcon(className = "", size = 24)}
  <svg
    aria-hidden="true"
    class={`lucide lucide-house ${className}`}
    fill="none"
    height={size}
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
    <path
      d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
    />
  </svg>
{/snippet}

{#snippet panelsIcon(className = "", size = 24)}
  <svg
    aria-hidden="true"
    class={`lucide lucide-panels-top-left ${className}`}
    fill="none"
    height={size}
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>
{/snippet}

{#snippet settingsIcon(className = "", size = 24)}
  <svg
    aria-hidden="true"
    class={`lucide lucide-settings ${className}`}
    fill="none"
    height={size}
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
    />
    <circle cx="12" cy="12" r="3" />
  </svg>
{/snippet}

{#snippet boxIcon(className = "", size = 24)}
  <svg
    aria-hidden="true"
    class={`lucide lucide-box ${className}`}
    fill="none"
    height={size}
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m7.5 4.27 9 5.15" />
    <path
      d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
    />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
{/snippet}

{#snippet inboxIcon(className = "", size = 24)}
  <svg
    aria-hidden="true"
    class={`lucide lucide-inbox ${className}`}
    fill="none"
    height={size}
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path
      d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
    />
  </svg>
{/snippet}

<style>
.tabs-fixture {
  display: grid;
  box-sizing: border-box;
  width: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  justify-items: center;
  gap: 3rem 2rem;
  padding: 2rem;
}

.tabs-fixture > section {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  justify-content: center;
}

.tabs-fixture > .review-probes {
  display: grid;
  grid-column: 1 / -1;
  gap: 1rem;
  border-block-start: 1px solid var(--border);
  padding-block-start: 2rem;
}

.review-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

@media (max-width: 639px) {
  .tabs-fixture {
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
    padding: 1.5rem;
  }

  .tabs-fixture > .review-probes {
    grid-column: auto;
  }
}
</style>
