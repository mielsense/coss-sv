<script lang="ts">
  import { Badge, Tabs } from "@coss-sv/ui";
  import FixtureIcon from "./fixture-icon.svelte";

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
  <FixtureIcon aria-hidden="true" class={className} name="home" {size} />
{/snippet}

{#snippet panelsIcon(className = "", size = 24)}
  <FixtureIcon aria-hidden="true" class={className} name="panels" {size} />
{/snippet}

{#snippet settingsIcon(className = "", size = 24)}
  <FixtureIcon aria-hidden="true" class={className} name="settings" {size} />
{/snippet}

{#snippet boxIcon(className = "", size = 24)}
  <FixtureIcon aria-hidden="true" class={className} name="package" {size} />
{/snippet}

{#snippet inboxIcon(className = "", size = 24)}
  <FixtureIcon aria-hidden="true" class={className} name="inbox" {size} />
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
