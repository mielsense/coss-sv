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
    // Status
    { group: "Status", id: "s-open", label: "Open" },
    { group: "Status", id: "s-in-progress", label: "In progress" },
    { group: "Status", id: "s-blocked", label: "Blocked" },
    { group: "Status", id: "s-resolved", label: "Resolved" },
    { group: "Status", id: "s-closed", label: "Closed" },
    // Priority
    { group: "Priority", id: "p-low", label: "Low" },
    { group: "Priority", id: "p-medium", label: "Medium" },
    { group: "Priority", id: "p-high", label: "High" },
    { group: "Priority", id: "p-urgent", label: "Urgent" },
    // Team
    { group: "Team", id: "t-design", label: "Design" },
    { group: "Team", id: "t-frontend", label: "Frontend" },
    { group: "Team", id: "t-backend", label: "Backend" },
    { group: "Team", id: "t-devops", label: "DevOps" },
    { group: "Team", id: "t-qa", label: "QA" },
    { group: "Team", id: "t-mobile", label: "Mobile" },
    { group: "Team", id: "t-data", label: "Data" },
    { group: "Team", id: "t-security", label: "Security" },
    { group: "Team", id: "t-platform", label: "Platform" },
    { group: "Team", id: "t-infra", label: "Infrastructure" },
    { group: "Team", id: "t-product", label: "Product" },
    { group: "Team", id: "t-marketing", label: "Marketing" },
    { group: "Team", id: "t-sales", label: "Sales" },
    { group: "Team", id: "t-support", label: "Support" },
    { group: "Team", id: "t-research", label: "Research" },
    { group: "Team", id: "t-content", label: "Content" },
    { group: "Team", id: "t-analytics", label: "Analytics" },
    { group: "Team", id: "t-operations", label: "Operations" },
    { group: "Team", id: "t-finance", label: "Finance" },
    { group: "Team", id: "t-hr", label: "HR" },
    { group: "Team", id: "t-legal", label: "Legal" },
    { group: "Team", id: "t-growth", label: "Growth" },
    { group: "Team", id: "t-partner", label: "Partner" },
    { group: "Team", id: "t-community", label: "Community" },
    { group: "Team", id: "t-docs", label: "Docs" },
    { group: "Team", id: "t-l10n", label: "Localization" },
    { group: "Team", id: "t-a11y", label: "Accessibility" },
    { group: "Team", id: "t-sre", label: "SRE" },
    { group: "Team", id: "t-release", label: "Release" },
    { group: "Team", id: "t-architecture", label: "Architecture" },
    { group: "Team", id: "t-ux", label: "UX" },
    { group: "Team", id: "t-ui", label: "UI" },
    { group: "Team", id: "t-management", label: "Management" },
  ];
  const groups: Group[] = (["Status", "Priority", "Team"] as const).map((value) => ({
    value,
    items: tags.filter((tag) => tag.group === value),
  }));
</script>

<Combobox.Root items={groups}>
  <div class="flex flex-col items-start gap-2">
    <Combobox.Input aria-label="Search tags" placeholder="e.g. feature" />
  </div>
  <Combobox.Popup>
    <Combobox.Empty>No tags found.</Combobox.Empty><Combobox.List>
      {#snippet item(group: Group)}
        <Combobox.Group items={group.items}>
          <Combobox.GroupLabel>{group.value}</Combobox.GroupLabel><Combobox.Collection>
            {#snippet children(tag: Tag)}<Combobox.Item value={tag}>
                {tag.label}
              </Combobox.Item>{/snippet}
          </Combobox.Collection>
        </Combobox.Group>
        {#if group.value !== "Team"}<Combobox.Separator />{/if}
      {/snippet}
    </Combobox.List>
  </Combobox.Popup>
</Combobox.Root>
