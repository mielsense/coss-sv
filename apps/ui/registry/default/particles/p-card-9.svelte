<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "card", "field", "form", "frame", "input", "select"],
    containerClass:
      "**:data-[slot=preview]:w-full **:data-[slot=preview]:flex **:data-[slot=preview]:justify-center",
    id: "p-card-9",
    interactive: true,
    responsive: true,
    title: "Card within a frame and footer",
  });
</script>

<script lang="ts">
  import * as Card from "@coss-sv/ui/components/ui/card";
  import {
    Button,
    Field,
    Form,
    Frame,
    FrameDescription,
    FrameHeader,
    FrameTitle,
    Input,
    Select,
  } from "@coss-sv/ui";

  const frameworkOptions = [
    { label: "Next.js", value: "next" },
    { label: "Vite", value: "vite" },
    { label: "Remix", value: "remix" },
    { label: "Astro", value: "astro" },
  ];
  let framework = $state("next");
</script>

<Frame class="w-full max-w-xs">
  <FrameHeader>
    <FrameTitle>Create project</FrameTitle>
    <FrameDescription>Deploy your new project in one-click.</FrameDescription>
  </FrameHeader>
  <Card.Root>
    <Card.Panel>
      <Form class="flex w-full flex-col gap-4">
        <Field.Root>
          <Field.Label>Name</Field.Label>
          <Input placeholder="Name of your project" type="text" />
        </Field.Root>
        <Field.Root>
          <Field.Label>Framework</Field.Label>
          <Select.Root bind:value={framework} items={frameworkOptions}>
            <Select.Trigger><Select.Value /></Select.Trigger>
            <Select.Popup>
              {#each frameworkOptions as option (option.value)}
                <Select.Item value={option.value}>{option.label}</Select.Item>
              {/each}
            </Select.Popup>
          </Select.Root>
        </Field.Root>
        <Button class="w-full" type="submit">Deploy</Button>
      </Form>
    </Card.Panel>
  </Card.Root>
</Frame>
