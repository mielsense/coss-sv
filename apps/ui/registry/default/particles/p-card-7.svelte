<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

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
  import {
    HugeiconsIcon,
    Button,
    Card,
    CardFrame,
    CardFrameDescription,
    CardFrameFooter,
    CardFrameHeader,
    CardFrameTitle,
    CardPanel,
    Field,
    Form,
    Input,
    Select,
  } from "@coss-sv/ui";
  import { AlertCircleIcon } from "@hugeicons/core-free-icons";

  const frameworkOptions = [
    { label: "Next.js", value: "next" },
    { label: "Vite", value: "vite" },
    { label: "Remix", value: "remix" },
    { label: "Astro", value: "astro" },
  ];
  let framework = $state("next");
</script>

<CardFrame class="w-full max-w-xs">
  <CardFrameHeader>
    <CardFrameTitle>Create project</CardFrameTitle>
    <CardFrameDescription>Deploy your new project in one-click.</CardFrameDescription>
  </CardFrameHeader>
  <Card class="rounded-b-none!">
    <CardPanel>
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
    </CardPanel>
  </Card>
  <CardFrameFooter>
    <div class="flex gap-1 text-muted-foreground text-xs">
      <HugeiconsIcon
        aria-hidden="true"
        class="size-3 h-lh shrink-0"
        icon={AlertCircleIcon}
        strokeWidth={2}
      />
      <p>This will take a few seconds to complete.</p>
    </div>
  </CardFrameFooter>
</CardFrame>
