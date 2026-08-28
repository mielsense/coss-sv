<script lang="ts">
import { DirectionProvider } from "@shardsui/svelte";
import * as Select from "./index.js";
const frameworks = [
  { label: "Next.js", value: "next" },
  { label: "Vite", value: "vite" },
  { label: "Astro", value: "astro" },
];
let framework = $state("next");
let languages = $state<string[]>(["JavaScript"]);
const people = [
  { id: "ada", name: "Ada Lovelace" },
  { id: "grace", name: "Grace Hopper" },
];
let person = $state<(typeof people)[number] | null>(null);
let personIdentity = $state("different");
let rtlContainer = $state<HTMLElement | null>(null);
</script>

<form data-testid="select-form">
  <Select.Root aria-label="Framework" bind:value={framework} items={frameworks} name="framework">
    <Select.Trigger><Select.Value /></Select.Trigger>
    <Select.Popup>
      <Select.Group>
        <Select.GroupLabel>Frameworks</Select.GroupLabel>
        {#each frameworks as item (item.value)}
          <Select.Item disabled={item.value === "astro"} value={item.value}
            >{item.label}</Select.Item
          >
        {/each}
      </Select.Group>
    </Select.Popup>
  </Select.Root>
  <Select.Root bind:value={languages} multiple name="languages">
    <Select.Trigger aria-label="Languages"><Select.Value /></Select.Trigger>
    <Select.Popup alignItemWithTrigger={false}>
      <Select.Item value="JavaScript">JavaScript</Select.Item>
      <Select.Item value="TypeScript">TypeScript</Select.Item>
      <Select.Item value="Python">Python</Select.Item>
    </Select.Popup>
  </Select.Root>
</form>
<output data-testid="framework-value">{framework}</output>
<output data-testid="languages-value">{languages.join(",")}</output>

<Select.Root
  bind:value={person}
  items={people.map((item) => ({ label: item.name, value: item }))}
  itemToStringLabel={(item: (typeof people)[number]) => item.name}
  itemToStringValue={(item: (typeof people)[number]) => item.name}
  onValueChange={(item) => (personIdentity = item === people[1] ? "same" : "different")}
>
  <Select.Trigger aria-label="Person"><Select.Value /></Select.Trigger>
  <Select.Popup>
    {#each people as item (item.id)}
      <Select.Item value={item}>{item.name}</Select.Item>
    {/each}
  </Select.Popup>
</Select.Root>
<output data-testid="select-identity">{personIdentity}</output>

<div bind:this={rtlContainer} dir="rtl">
  <DirectionProvider direction="rtl">
    <Select.Root aria-label="RTL framework" items={frameworks} value="next">
      <Select.Trigger data-testid="rtl-trigger"><Select.Value /></Select.Trigger>
      <Select.Popup portalProps={{ container: rtlContainer }}>
        {#each frameworks as item (item.value)}
          <Select.Item value={item.value}>{item.label}</Select.Item>
        {/each}
      </Select.Popup>
    </Select.Root>
  </DirectionProvider>
</div>

<style>
:global([dir="rtl"] [data-testid="rtl-trigger"]) {
  display: flex;
  width: 144px;
  padding-inline: 12px;
}

:global([dir="rtl"] [data-slot="select-popup"]) {
  min-width: 164px;
}

:global([dir="rtl"] [data-slot="select-item"]) {
  display: grid;
  grid-template-columns: 16px 1fr;
  gap: 8px;
  padding-inline: 8px 16px;
}
</style>
