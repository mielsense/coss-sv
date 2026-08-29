<script lang="ts">
  import { Button, Group, type GroupTextDelegateProps, Input, Label } from "@coss-sv/ui";
  import FixtureIcon, { type FixtureIconName } from "./fixture-icon.svelte";
</script>

<div class="group-fixture">
  <section data-particle="p-group-7" id="p-group-7">
    <Group.Root aria-label="Domain input">
      <Group.Text aria-label="Domain" delegate={labelDelegate} for="domain">https://</Group.Text>
      <Group.Separator />
      <Input aria-label="Domain" defaultValue="coss.com" id="domain" type="text" />
    </Group.Root>
  </section>

  <section data-particle="p-group-8" id="p-group-8">
    <Group.Root aria-label="Domain input">
      <Input aria-label="Domain" defaultValue="coss" id="domain-suffix" type="text" />
      <Group.Separator />
      <Group.Text aria-label="Domain suffix" delegate={labelDelegate} for="domain-suffix"
        >.com</Group.Text
      >
    </Group.Root>
  </section>

  <section data-particle="p-group-9" id="p-group-9">
    <Group.Root aria-label="Zoom controls" orientation="vertical">
      <Button aria-label="Zoom in" size="icon" variant="outline">
        {@render icon("zoom-in")}
      </Button>
      <Group.Separator orientation="horizontal" />
      <Button aria-label="Zoom Out" size="icon" variant="outline">
        {@render icon("zoom-out")}
      </Button>
    </Group.Root>
  </section>

  <section data-particle="p-group-10" id="p-group-10">
    <Group.Root aria-label="Pagination">
      <Group.Root aria-label="Page numbers">
        <Button class="min-w-8" variant="outline">1</Button>
        <Group.Separator />
        <Button class="min-w-8" variant="outline">2</Button>
        <Group.Separator />
        <Button class="min-w-8" variant="outline">3</Button>
        <Group.Separator />
        <Button class="min-w-8" variant="outline">4</Button>
        <Group.Separator />
        <Button class="min-w-8" variant="outline">5</Button>
      </Group.Root>
      <Group.Root aria-label="Navigation">
        <Button aria-label="Previous" size="icon" variant="outline">
          {@render icon("arrow-left", true)}
        </Button>
        <Group.Separator />
        <Button aria-label="Next" size="icon" variant="outline">
          {@render icon("arrow-right", true)}
        </Button>
      </Group.Root>
    </Group.Root>
  </section>

  <section data-particle="p-group-16" id="p-group-16">
    <Group.Root aria-label="Add item">
      <Button aria-label="Add" size="icon" variant="outline">{@render icon("plus", true)}</Button>
      <Group.Separator />
      <Input aria-label="Item name" placeholder="Enter item name" type="text" />
    </Group.Root>
  </section>

  <section data-particle="p-group-17" id="p-group-17">
    <Group.Root aria-label="Price input">
      <Input
        aria-label="Enter the amount"
        class="text-right"
        defaultValue="100"
        id="amount"
        type="text"
      />
      <Group.Separator />
      <Group.Text aria-label="Currency" delegate={labelDelegate} for="amount">USD</Group.Text>
    </Group.Root>
  </section>

  <section data-particle="p-group-20" id="p-group-20">
    <Group.Root aria-label="Email subscription">
      <Input aria-label="Email" placeholder="Email" type="email" />
      <Group.Separator />
      <Button variant="outline">Subscribe</Button>
    </Group.Root>
  </section>
</div>

{#snippet labelDelegate(props: GroupTextDelegateProps)}
  <Label {...props} />
{/snippet}

{#snippet icon(
  name: "arrow-left" | "arrow-right" | "plus" | "zoom-in" | "zoom-out",
  hidden = false,
)}
  <FixtureIcon aria-hidden={hidden ? "true" : undefined} name={name as FixtureIconName} />
{/snippet}

<style>
  .group-fixture {
    display: grid;
    gap: 2rem;
  }

  .group-fixture section {
    display: flex;
    justify-content: center;
  }
</style>
