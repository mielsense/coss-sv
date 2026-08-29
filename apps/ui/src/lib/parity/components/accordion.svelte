<script lang="ts">
  import { Accordion, Button } from "@coss-sv/ui";

  const items = [
    {
      content:
        "Base UI is a library of high-quality unstyled React components for design systems and web apps.",
      id: "1",
      title: "What is Base UI?",
    },
    {
      content:
        "Head to the \"Quick start\" guide in the docs. If you've used unstyled libraries before, you'll feel at home.",
      id: "2",
      title: "How do I get started?",
    },
    {
      content: "Of course! Base UI is free and open source.",
      id: "3",
      title: "Can I use it for my project?",
    },
  ] as const;

  let controlledValue = $state<string[]>([]);
  let lifecycleValue = $state<string[]>([]);
</script>

<div class="accordion-fixture">
  <section data-particle="p-accordion-1">
    <Accordion.Root class="w-full" defaultValue={["3"]}>
      {#each items as item (item.id)}
        <Accordion.Item value={item.id}>
          <Accordion.Header>
            <Accordion.Trigger>{item.title}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>{item.content}</Accordion.Panel>
        </Accordion.Item>
      {/each}
    </Accordion.Root>
  </section>

  <section data-particle="p-accordion-2">
    <Accordion.Root class="w-full">
      {#each items as item (item.id)}
        <Accordion.Item value={`item-${item.id}`}>
          <Accordion.Header>
            <Accordion.Trigger>{item.title}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>{item.content}</Accordion.Panel>
        </Accordion.Item>
      {/each}
    </Accordion.Root>
  </section>

  <section data-particle="p-accordion-3">
    <Accordion.Root class="w-full" multiple>
      {#each items as item (item.id)}
        <Accordion.Item value={`item-${item.id}`}>
          <Accordion.Header>
            <Accordion.Trigger>{item.title}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>{item.content}</Accordion.Panel>
        </Accordion.Item>
      {/each}
    </Accordion.Root>
  </section>

  <section data-particle="p-accordion-4">
    <div class="flex w-full flex-col gap-4">
      <Accordion.Root class="w-full" bind:value={controlledValue}>
        {#each items as item (item.id)}
          <Accordion.Item value={`item-${item.id}`}>
            <Accordion.Header>
              <Accordion.Trigger>{item.title}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>{item.content}</Accordion.Panel>
          </Accordion.Item>
        {/each}
      </Accordion.Root>

      <div class="flex flex-col items-start gap-4">
        <Button onclick={() => (controlledValue = ["item-1", "item-2"])} variant="outline">
          Open First Two
        </Button>
        <p class="text-muted-foreground text-sm" data-anchor="accordion-controlled-value">
          Open items: {controlledValue.length > 0 ? controlledValue.join(", ") : "None"}
        </p>
      </div>
    </div>
  </section>

  <section class="review-probes" data-review-probes="accordion">
    <div class="review-actions">
      <button type="button" onclick={() => (lifecycleValue = ["lifecycle"])}>Open probe</button>
      <button type="button" onclick={() => (lifecycleValue = [])}>Close probe</button>
      <output data-testid="accordion-lifecycle-value">{lifecycleValue.join(",") || "closed"}</output
      >
    </div>
    <Accordion.Root bind:value={lifecycleValue}>
      <Accordion.Item value="lifecycle">
        <Accordion.Header as="h2">
          <Accordion.Trigger data-testid="accordion-lifecycle-trigger">
            Lifecycle and reduced-motion probe
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel data-testid="accordion-unmounted-panel">
          This panel unmounts when its closing transition finishes.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item disabled value="disabled">
        <Accordion.Header>
          <Accordion.Trigger data-testid="accordion-disabled-trigger"
            >Disabled item</Accordion.Trigger
          >
        </Accordion.Header>
        <Accordion.Panel keepMounted data-testid="accordion-mounted-panel">
          This disabled panel remains mounted for lifecycle inspection.
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  </section>
</div>

<style>
  .accordion-fixture {
    display: grid;
    box-sizing: border-box;
    width: 100%;
    gap: 3rem;
    padding: 2rem;
  }

  .accordion-fixture > section {
    width: 100%;
    min-width: 0;
  }

  .review-probes {
    display: grid;
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
</style>
