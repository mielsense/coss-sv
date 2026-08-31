<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "card", "field", "form", "input", "select"],
    containerClass:
      "**:data-[slot=preview]:w-full **:data-[slot=preview]:flex **:data-[slot=preview]:justify-center",
    id: "p-card-7",
    interactive: true,
    responsive: true,
    title: "Framed card with no rounded bottom",
  });
</script>

<script lang="ts">
  import * as Card from "@coss-sv/ui/components/ui/card";
  import { Button, Field, Form, HugeiconsIcon, Input, Select } from "@coss-sv/ui";
  import AlertCircleIcon from "@hugeicons/core-free-icons/AlertCircleIcon";

  const frameworkOptions = [
    { label: "Next.js", value: "next" },
    { label: "Vite", value: "vite" },
    { label: "Remix", value: "remix" },
    { label: "Astro", value: "astro" },
  ];
  let framework = $state("next");
</script>

<Card.Frame class="w-full max-w-xs">
  <Card.FrameHeader>
    <Card.FrameTitle>Create project</Card.FrameTitle>
    <Card.FrameDescription>Deploy your new project in one-click.</Card.FrameDescription>
  </Card.FrameHeader>
  <Card.Root class="rounded-b-none!">
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
  <Card.FrameFooter>
    <div class="flex gap-1 text-muted-foreground text-xs">
      <HugeiconsIcon
        aria-hidden="true"
        class="size-3 h-lh shrink-0"
        icon={AlertCircleIcon}
        strokeWidth={2}
      />
      <p>This will take a few seconds to complete.</p>
    </div>
  </Card.FrameFooter>
</Card.Frame>
