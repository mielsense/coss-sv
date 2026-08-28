<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["accordion"],
  containerClass: "**:data-[slot=preview]:w-full sm:**:data-[slot=preview]:max-w-[80%]",
  id: "p-accordion-1",
  interactive: true,
  responsive: true,
  title: "Basic accordion",
});
</script>

<script lang="ts">
import { Accordion } from "@coss-sv/ui";

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
];
</script>

<Accordion.Root class="w-full" defaultValue={["3"]}>
  {#each items as item (item.id)}
    <Accordion.Item value={item.id}>
      <Accordion.Header><Accordion.Trigger>{item.title}</Accordion.Trigger></Accordion.Header>
      <Accordion.Panel>{item.content}</Accordion.Panel>
    </Accordion.Item>
  {/each}
</Accordion.Root>
