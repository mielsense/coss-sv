<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-select-7",
    interactive: true,
    responsive: false,
    title: "Multiple select",
  });
</script>

<script lang="ts">
  import { Select } from "@coss-sv/ui";

  const languages = {
    cpp: "C++",
    csharp: "C#",
    go: "Go",
    java: "Java",
    javascript: "JavaScript",
    php: "PHP",
    python: "Python",
    rust: "Rust",
    swift: "Swift",
    typescript: "TypeScript",
  } as const;
  type Language = keyof typeof languages;
  const values = Object.keys(languages) as Language[];
  let value = $state<Language[]>(["javascript", "typescript"]);
</script>

<Select.Root aria-label="Select languages" multiple bind:value>
  <Select.Trigger
    ><Select.Value
      >{#snippet children(selected)}{const selectedValues = Array.isArray(selected)
          ? (selected as Language[])
          : []}{const firstSelected = selectedValues.at(0)}{firstSelected
          ? languages[firstSelected] +
            (selectedValues.length > 1 ? ` (+${selectedValues.length - 1} more)` : "")
          : "Select languages…"}{/snippet}</Select.Value
    ></Select.Trigger
  >
  <Select.Popup alignItemWithTrigger={false}
    >{#each values as item (item)}<Select.Item value={item}>{languages[item]}</Select.Item
      >{/each}</Select.Popup
  >
</Select.Root>
