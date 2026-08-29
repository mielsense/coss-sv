<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["accordion"],
    containerClass: "**:data-[slot=preview]:w-full sm:**:data-[slot=preview]:max-w-[80%]",
    id: "p-accordion-2",
    interactive: true,
    responsive: true,
    title: "Accordion with one panel open",
  });
</script>

<script lang="ts">
  import { Accordion } from "@coss-sv/ui";
</script>

<Accordion.Root class="w-full">
  <Accordion.Item value="item-1">
    <Accordion.Header><Accordion.Trigger>What is Base UI?</Accordion.Trigger></Accordion.Header>
    <Accordion.Panel>
      Base UI is a library of high-quality unstyled React components for design systems and web
      apps.
    </Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Header><Accordion.Trigger>How do I get started?</Accordion.Trigger></Accordion.Header
    >
    <Accordion.Panel>
      Head to the "Quick start" guide in the docs. If you've used unstyled libraries before, you'll
      feel at home.
    </Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item value="item-3">
    <Accordion.Header
      ><Accordion.Trigger>Can I use it for my project?</Accordion.Trigger></Accordion.Header
    >
    <Accordion.Panel>Of course! Base UI is free and open source.</Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>
