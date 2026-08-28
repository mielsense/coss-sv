<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["autocomplete"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-autocomplete-10",
    interactive: true,
    responsive: false,
    title: "Autocomplete with grouped items",
  });
</script>

<script lang="ts">
  import { Autocomplete } from "@coss-sv/ui";

  type Tag = { id: string; label: string; group: "Status" | "Priority" | "Team" };
  type TagGroup = { value: string; items: Tag[] };
  const tagsData: Tag[] = [
    { group: "Status", id: "s-open", label: "Open" },
    { group: "Status", id: "s-in-progress", label: "In progress" },
    { group: "Status", id: "s-blocked", label: "Blocked" },
    { group: "Status", id: "s-resolved", label: "Resolved" },
    { group: "Status", id: "s-closed", label: "Closed" },
    { group: "Priority", id: "p-low", label: "Low" },
    { group: "Priority", id: "p-medium", label: "Medium" },
    { group: "Priority", id: "p-high", label: "High" },
    { group: "Priority", id: "p-urgent", label: "Urgent" },
    ...[
      "Design",
      "Frontend",
      "Backend",
      "DevOps",
      "QA",
      "Mobile",
      "Data",
      "Security",
      "Platform",
      "Infrastructure",
      "Product",
      "Marketing",
      "Sales",
      "Support",
      "Research",
      "Content",
      "Analytics",
      "Operations",
      "Finance",
      "HR",
      "Legal",
      "Growth",
      "Partner",
      "Community",
      "Docs",
      "Localization",
      "Accessibility",
      "SRE",
      "Release",
      "Architecture",
      "UX",
      "UI",
      "Management",
    ].map((label) => ({
      group: "Team" as const,
      id: `t-${label.toLowerCase().replaceAll(" ", "-")}`,
      label,
    })),
  ];
  const groupedTags: TagGroup[] = (["Status", "Priority", "Team"] as const).map((value) => ({
    value,
    items: tagsData.filter((tag) => tag.group === value),
  }));
</script>

<Autocomplete.Root items={groupedTags}>
  <Autocomplete.Input aria-label="Search tags" placeholder="e.g. feature" />
  <Autocomplete.Popup>
    <Autocomplete.Empty>No tags found.</Autocomplete.Empty>
    <Autocomplete.List>
      {#each groupedTags as group (group.value)}
        <Autocomplete.Group items={group.items}>
          <Autocomplete.GroupLabel>{group.value}</Autocomplete.GroupLabel>
          <Autocomplete.Collection>
            {#snippet children(tag: Tag)}
              <Autocomplete.Item value={tag}>{tag.label}</Autocomplete.Item>
            {/snippet}
          </Autocomplete.Collection>
        </Autocomplete.Group>
        {#if group.value !== "Team"}<Autocomplete.Separator />{/if}
      {/each}
    </Autocomplete.List>
  </Autocomplete.Popup>
</Autocomplete.Root>
