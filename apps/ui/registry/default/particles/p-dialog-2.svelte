<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "dialog", "menu"],
    id: "p-dialog-2",
    interactive: true,
    responsive: true,
    title: "Dialog opened from menu",
  });
</script>

<script lang="ts">
  import { buttonVariants, Dialog, Menu } from "@coss-sv/ui";

  let dialogOpen = $state(false);
</script>

<Menu.Root>
  <Menu.Trigger class={buttonVariants({ variant: "outline" })}>Open menu</Menu.Trigger>
  <Menu.Popup align="start">
    <Menu.Item onclick={() => (dialogOpen = true)}>Open dialog</Menu.Item>
  </Menu.Popup>
</Menu.Root>
<Dialog.Root open={dialogOpen} onOpenChange={(open) => (dialogOpen = open)}>
  <Dialog.Popup>
    <Dialog.Header>
      <Dialog.Title>Settings</Dialog.Title><Dialog.Description>
        Change your preferences
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Dialog.Close class={buttonVariants({ variant: "ghost" })}>Close</Dialog.Close>
    </Dialog.Footer>
  </Dialog.Popup>
</Dialog.Root>
