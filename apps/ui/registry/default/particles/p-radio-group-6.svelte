<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["field", "fieldset", "radio-group"],
  id: "p-radio-group-6",
  interactive: true,
  responsive: true,
  title: "Theme radio group",
});
</script>

<script lang="ts">
import { Label, RadioGroup } from "@coss-sv/ui";

const themes = [
  {
    value: "system",
    label: "System",
    class: "bg-[linear-gradient(90deg,#e5e5e5_50%,#171717_50%)]",
  },
  { value: "light", label: "Light", class: "bg-neutral-200" },
  { value: "dark", label: "Dark", class: "bg-neutral-900" },
];
</script>

{#snippet preview(value: string)}
  {#if value === "system"}
    <span class="absolute inset-y-0 left-0 w-1/2 bg-neutral-200"></span>
    <span class="absolute inset-y-0 right-0 w-1/2 bg-neutral-900"></span>
    <span class="absolute inset-y-2 left-2.5 w-[34px] rounded-ss bg-white shadow-sm">
      <span class="absolute left-2.5 top-2.5 size-4 rounded-full bg-neutral-300"></span>
      <span class="absolute bottom-6 left-2.5 right-0 h-1 rounded-s-full bg-neutral-200"></span>
      <span
        class="absolute bottom-[17px] left-2.5 right-0 h-1 rounded-s-full bg-neutral-200"
      ></span>
      <span class="absolute bottom-2.5 left-2.5 right-0 h-1 rounded-s-full bg-neutral-200"></span>
    </span>
    <span class="absolute inset-y-2 left-[54px] right-0 rounded-ss bg-neutral-800 shadow-sm">
      <span class="absolute left-2.5 top-2.5 size-4 rounded-full bg-neutral-600"></span>
      <span class="absolute bottom-6 left-2.5 right-0 h-1 rounded-s-full bg-neutral-700"></span>
      <span
        class="absolute bottom-[17px] left-2.5 right-0 h-1 rounded-s-full bg-neutral-700"
      ></span>
      <span class="absolute bottom-2.5 left-2.5 right-0 h-1 rounded-s-full bg-neutral-700"></span>
    </span>
  {:else}
    <span
      class={[
        "absolute inset-y-2 left-2.5 right-0 rounded-ss shadow-sm",
        value === "dark" ? "bg-neutral-800" : "bg-white",
      ]}
    >
      <span
        class={[
          "absolute left-2.5 top-2.5 size-4 rounded-full",
          value === "dark" ? "bg-neutral-600" : "bg-neutral-300",
        ]}
      ></span>
      {#each [24, 17, 10] as bottom, index}
        <span
          class={[
            "absolute left-2.5 h-1 rounded-full",
            index === 2 ? "w-[29px]" : "right-2.5",
            value === "dark" ? "bg-neutral-700" : "bg-neutral-200",
          ]}
          style:bottom={`${bottom}px`}
        ></span>
      {/each}
    </span>
  {/if}
{/snippet}

<fieldset class="flex flex-col gap-4">
  <legend class="font-medium text-sm">Choose a theme</legend>
  <RadioGroup.Root class="flex-row gap-4" defaultValue="system">
    {#each themes as theme (theme.value)}
      <Label class="cursor-pointer flex-col">
        <RadioGroup.Item class="peer sr-only absolute" value={theme.value} />
        <span
          class={["relative block h-[70px] w-[88px] overflow-hidden rounded-lg shadow-xs transition-shadow not-peer-data-checked:opacity-80 peer-data-checked:ring-2 peer-data-checked:ring-primary/48 peer-data-checked:ring-offset-1", theme.class]}
        >
          {@render preview(theme.value)}
        </span>
        <span class="not-peer-data-checked:text-muted-foreground/70">{theme.label}</span>
      </Label>
    {/each}
  </RadioGroup.Root>
</fieldset>
