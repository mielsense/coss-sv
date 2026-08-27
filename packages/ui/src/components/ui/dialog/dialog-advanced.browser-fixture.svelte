<script lang="ts">
import * as Dialog from "./index.js";

const detached = Dialog.createHandle<{ label: string }>();
let vetoOpen = $state(false);
let allowClose = $state(false);
let focusOpen = $state(false);
let modalOpen = $state(false);
let nonModalOpen = $state(false);
let initialFocus = $state<HTMLInputElement | null>(null);
let finalFocus = $state<HTMLButtonElement | null>(null);
</script>

<Dialog.Trigger handle={detached} payload={{ label: "Detached payload" }}>
  Open detached
</Dialog.Trigger>
<Dialog.Root handle={detached}>
  {#snippet children({ payload })}
    <Dialog.Popup>
      <Dialog.Title>Detached dialog</Dialog.Title>
      <Dialog.Description>{payload?.label}</Dialog.Description>
      <Dialog.Close>Close detached</Dialog.Close>
    </Dialog.Popup>
  {/snippet}
</Dialog.Root>

<Dialog.Root
  bind:open={
    () => vetoOpen,
    (next) => {
    if (next || allowClose) vetoOpen = next;
  }
  }
>
  <Dialog.Trigger>Open veto dialog</Dialog.Trigger>
  <Dialog.Popup>
    <Dialog.Title>Veto dialog</Dialog.Title>
    <Dialog.Description>Controlled close.</Dialog.Description>
    <Dialog.Close>Request close</Dialog.Close>
  </Dialog.Popup>
</Dialog.Root>
<button data-testid="allow-close" type="button" onclick={() => (allowClose = true)}>
  Allow close
</button>

<button bind:this={finalFocus} type="button">Custom final focus</button>
<Dialog.Root bind:open={focusOpen}>
  <Dialog.Trigger>Open focus dialog</Dialog.Trigger>
  <Dialog.Popup initialFocus={() => initialFocus} finalFocus={() => finalFocus}>
    <Dialog.Title>Focus dialog</Dialog.Title>
    <Dialog.Description>Custom focus targets.</Dialog.Description>
    <input bind:this={initialFocus} aria-label="Custom initial focus">
    <Dialog.Close>Close focus dialog</Dialog.Close>
  </Dialog.Popup>
</Dialog.Root>

<Dialog.Root bind:open={modalOpen}>
  <Dialog.Trigger>Open modal lock</Dialog.Trigger>
  <Dialog.Popup>
    <Dialog.Title>Modal lock</Dialog.Title>
    <Dialog.Description>Locks page scroll.</Dialog.Description>
    <Dialog.Close>Close modal lock</Dialog.Close>
  </Dialog.Popup>
</Dialog.Root>

<Dialog.Root bind:open={nonModalOpen} modal={false}>
  <Dialog.Trigger>Open non-modal</Dialog.Trigger>
  <Dialog.Popup>
    <Dialog.Title>Non-modal dialog</Dialog.Title>
    <Dialog.Description>Leaves the page interactive.</Dialog.Description>
    <Dialog.Close>Close non-modal</Dialog.Close>
  </Dialog.Popup>
</Dialog.Root>
<button data-testid="outside-control" type="button">Outside control</button>
