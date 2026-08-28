<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["accordion", "button"],
  containerClass: "**:data-[slot=preview]:w-full sm:**:data-[slot=preview]:max-w-[80%]",
  id: "p-accordion-4",
  interactive: true,
  responsive: true,
  title: "Controlled accordion",
});
</script>

<script lang="ts">
import { Accordion, Button } from "@coss-sv/ui";

let value = $state<string[]>([]);
</script>

<div class="flex w-full flex-col gap-4">
  <Accordion.Root bind:value class="w-full">
    <Accordion.Item value="item-1">
      <Accordion.Header><Accordion.Trigger>What is Base UI?</Accordion.Trigger></Accordion.Header>
      <Accordion.Panel>
        Base UI is a library of high-quality unstyled React components for design systems and web
        apps.
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item value="item-2">
      <Accordion.Header
        ><Accordion.Trigger>How do I get started?</Accordion.Trigger></Accordion.Header
      >
      <Accordion.Panel>
        Head to the "Quick start" guide in the docs. If you've used unstyled libraries before,
        you'll feel at home.
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item value="item-3">
      <Accordion.Header
        ><Accordion.Trigger>Can I use it for my project?</Accordion.Trigger></Accordion.Header
      >
      <Accordion.Panel>Of course! Base UI is free and open source.</Accordion.Panel>
    </Accordion.Item>
  </Accordion.Root>

  <div class="flex flex-col items-start gap-4">
    <Button onclick={() => (value = ["item-1", "item-2"])} variant="outline">
      Open First Two
    </Button>
    <p class="text-muted-foreground text-sm">
      Open items: {value.length > 0 ? value.join(", ") : "None"}
    </p>
  </div>
</div>
