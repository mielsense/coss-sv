<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button", "input-group", "popover"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-input-10",
  interactive: true,
  responsive: false,
  title: "Input group mimicking a URL bar",
});
</script>

<script lang="ts">
import { InformationCircleIcon, StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Button, buttonVariants, InputGroup, Popover } from "@coss-sv/ui";

let isFavorite = $state(false);
</script>

<InputGroup.Root class="[--radius-lg:9999px] [--radius:9999rem]">
  <Popover.Root>
    <InputGroup.Addon>
      <Popover.Trigger class={buttonVariants({ size: "icon-xs", variant: "secondary" })}>
        <HugeiconsIcon aria-hidden="true" icon={InformationCircleIcon} strokeWidth={2} />
      </Popover.Trigger>
    </InputGroup.Addon>
    <Popover.Popup align="start" alignOffset={-5} class="w-64" sideOffset={6}>
      <Popover.Title class="text-sm">Your connection is not secure.</Popover.Title>
      <Popover.Description>
        You should not enter any sensitive information on this site.
      </Popover.Description>
    </Popover.Popup>
  </Popover.Root>
  <InputGroup.Addon class="pl-1.5 text-muted-foreground">https://</InputGroup.Addon>
  <InputGroup.Input aria-label="Url" class="*:[input]:ps-1!" type="text" />
  <InputGroup.Addon align="inline-end">
    <Button
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      onclick={() => (isFavorite = !isFavorite)}
      size="icon-xs"
      variant="ghost"
    >
      <HugeiconsIcon
        aria-hidden="true"
        class="data-[favorite=true]:fill-primary data-[favorite=true]:stroke-primary"
        data-favorite={isFavorite}
        icon={StarIcon}
        strokeWidth={2}
      />
    </Button>
  </InputGroup.Addon>
</InputGroup.Root>
