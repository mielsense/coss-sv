<script lang="ts">
import { Button, Group, type GroupTextDelegateProps, Input, Label } from "@coss-sv/ui";
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
  <!-- biome-ignore lint/a11y/noSvgWithoutTitle: exact Lucide markup; every icon is inside a labelled button -->
  <svg
    aria-hidden={hidden ? "true" : undefined}
    class={`lucide lucide-${name}`}
    fill="none"
    height="24"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    {#if name === "zoom-in"}
      <circle cx="11" cy="11" r="8" />
      <line x1="21" x2="16.65" y1="21" y2="16.65" />
      <line x1="11" x2="11" y1="8" y2="14" />
      <line x1="8" x2="14" y1="11" y2="11" />
    {:else if name === "zoom-out"}
      <circle cx="11" cy="11" r="8" />
      <line x1="21" x2="16.65" y1="21" y2="16.65" />
      <line x1="8" x2="14" y1="11" y2="11" />
    {:else if name === "arrow-left"}
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    {:else if name === "arrow-right"}
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    {:else}
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    {/if}
  </svg>
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
