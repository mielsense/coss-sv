<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["autocomplete"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-autocomplete-11",
    interactive: true,
    responsive: false,
    title: "Autocomplete with limited number of results",
  });
</script>

<script lang="ts">
  import { Autocomplete } from "@coss-sv/ui";

  const limit = 7;
  const manyTags = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C#",
    "C++",
    "C",
    "Go",
    "Rust",
    "Ruby",
    "PHP",
    "Swift",
    "Kotlin",
    "Scala",
    "Elixir",
    "Haskell",
    "Dart",
    "Objective-C",
    "Julia",
    "R",
    "Perl",
    "Lua",
    "OCaml",
    "F#",
  ].map((value) => ({ id: `lang-${value.toLowerCase()}`, value }));
  type Tag = (typeof manyTags)[number];
  let value = $state("");
  const totalMatches = $derived(
    value.trim()
      ? manyTags.filter((tag) => tag.value.toLowerCase().includes(value.trim().toLowerCase()))
          .length
      : manyTags.length,
  );
  const moreCount = $derived(Math.max(0, totalMatches - limit));
</script>

<Autocomplete.Root items={manyTags} {limit} bind:value>
  <Autocomplete.Input placeholder="e.g. feature" />
  <Autocomplete.Popup>
    <Autocomplete.Empty>No tags found.</Autocomplete.Empty>
    <Autocomplete.List>
      <Autocomplete.Collection>
        {#snippet children(tag: Tag)}
          <Autocomplete.Item value={tag}>{tag.value}</Autocomplete.Item>
        {/snippet}
      </Autocomplete.Collection>
    </Autocomplete.List>
    {#if moreCount > 0}<Autocomplete.Status
        >+{moreCount} more (keep typing to narrow down)</Autocomplete.Status
      >{/if}
  </Autocomplete.Popup>
</Autocomplete.Root>
