<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button", "card", "field", "form", "frame", "input", "select"],
  containerClass:
    "**:data-[slot=preview]:w-full **:data-[slot=preview]:flex **:data-[slot=preview]:justify-center",
  id: "p-card-8",
  interactive: true,
  responsive: true,
  title: "Card within a frame and footer",
});
</script>

<script lang="ts">
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
  Field,
  Form,
  Frame,
  FrameFooter,
  Input,
  Select,
} from "@coss-sv/ui";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";

const frameworkOptions = [
  { label: "Next.js", value: "next" },
  { label: "Vite", value: "vite" },
  { label: "Remix", value: "remix" },
  { label: "Astro", value: "astro" },
];
let framework = $state("next");
</script>

<Frame class="w-full max-w-xs">
  <Card>
    <CardHeader>
      <CardTitle>Create project</CardTitle>
      <CardDescription>Deploy your new project in one-click.</CardDescription>
    </CardHeader>
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
  <FrameFooter>
    <div class="flex gap-1 text-muted-foreground text-xs">
      <HugeiconsIcon
        aria-hidden="true"
        class="size-3 h-lh shrink-0"
        icon={AlertCircleIcon}
        strokeWidth={2}
      />
      <p>This will take a few seconds to complete.</p>
    </div>
  </FrameFooter>
</Frame>
