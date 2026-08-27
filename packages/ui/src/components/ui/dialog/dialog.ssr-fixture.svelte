<script lang="ts">
import type { Snippet } from "svelte";
import * as Dialog from "./index.js";
let { children }: { children?: Snippet } = $props();
</script>

<Dialog.Root open>
  <Dialog.Popup>
    <Dialog.Header>
      <Dialog.Title>Profile</Dialog.Title>
      <Dialog.Description>Edit your profile.</Dialog.Description>
    </Dialog.Header>
    <Dialog.Panel>{@render children?.()}</Dialog.Panel>
    <Dialog.Footer>Save</Dialog.Footer>
  </Dialog.Popup>
</Dialog.Root>
