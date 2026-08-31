<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["combobox"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-combobox-8",
    interactive: true,
    responsive: false,
    title: "Combobox with grouped items",
  });
</script>

<script lang="ts">
  import { Combobox } from "@coss-sv/ui";

  type Tag = { id: string; label: string; group: "Status" | "Priority" | "Team" };
  type Group = { value: string; items: Tag[] };
  const tags: Tag[] = [
    ...["Open", "In progress", "Blocked", "Resolved", "Closed"].map((label) => ({
      group: "Status" as const,
      id: `s-${label.toLowerCase().replaceAll(" ", "-")}`,
      label,
    })),
    ...["Low", "Medium", "High", "Urgent"].map((label) => ({
      group: "Priority" as const,
      id: `p-${label.toLowerCase()}`,
      label,
    })),
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
  const groups: Group[] = (["Status", "Priority", "Team"] as const).map((value) => ({
    value,
    items: tags.filter((tag) => tag.group === value),
  }));
</script>

<Combobox.Root items={groups}>
  <Combobox.Input aria-label="Search tags" placeholder="e.g. feature" />
  <Combobox.Popup>
    <Combobox.Empty>No tags found.</Combobox.Empty><Combobox.List>
      {#each groups as group (group.value)}
        <Combobox.Group items={group.items}>
          <Combobox.GroupLabel>{group.value}</Combobox.GroupLabel><Combobox.Collection>
            {#snippet children(tag: Tag)}<Combobox.Item value={tag}>
                {tag.label}
              </Combobox.Item>{/snippet}
          </Combobox.Collection>
        </Combobox.Group>
        {#if group.value !== "Team"}<Combobox.Separator />{/if}
      {/each}
    </Combobox.List>
  </Combobox.Popup>
</Combobox.Root>
