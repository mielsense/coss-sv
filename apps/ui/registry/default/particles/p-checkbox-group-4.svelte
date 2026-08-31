<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["checkbox", "checkbox-group", "label"],
    id: "p-checkbox-group-4",
    interactive: true,
    responsive: true,
    title: "Nested checkbox group",
  });
</script>

<script lang="ts">
  import { CheckboxGroup, Label } from "@coss-sv/ui";

  const main = [
    { value: "view-dashboard", label: "View Dashboard" },
    { value: "access-reports", label: "Access Reports" },
  ];
  const management = [
    { value: "create-user", label: "Create User" },
    { value: "edit-user", label: "Edit User" },
    { value: "delete-user", label: "Delete User" },
    { value: "assign-roles", label: "Assign Roles" },
  ];
  let mainValue = $state<string[]>([]);
  let managementValue = $state<string[]>([]);
  const managementValues = $derived(management.map(({ value }) => value));
  const managementIsPartial = $derived(
    managementValue.length > 0 && managementValue.length !== management.length,
  );

  function changeMain(value: readonly string[]) {
    if (value.includes("manage-users")) {
      managementValue = [...managementValues];
    } else if (managementValue.length === management.length) {
      managementValue = [];
    }
    mainValue = [...value];
  }

  function changeManagement(value: readonly string[]) {
    mainValue =
      value.length === management.length
        ? Array.from(new Set([...mainValue, "manage-users"]))
        : mainValue.filter((entry) => entry !== "manage-users");
    managementValue = [...value];
  }
</script>

<CheckboxGroup.Root
  allValues={[...main.map(({ value }) => value), "manage-users"]}
  aria-labelledby="user-permissions-caption"
  onValueChange={changeMain}
  value={mainValue}
>
  <Label id="user-permissions-caption">
    <CheckboxGroup.Item indeterminate={managementIsPartial} parent />User Permissions
  </Label>
  {#each main as permission (permission.value)}
    <Label class="ms-4"><CheckboxGroup.Item value={permission.value} />{permission.label}</Label>
  {/each}
  <CheckboxGroup.Root
    class="ms-4"
    allValues={management.map(({ value }) => value)}
    aria-labelledby="manage-users-caption"
    onValueChange={changeManagement}
    value={managementValue}
  >
    <Label id="manage-users-caption"><CheckboxGroup.Item parent />Manage Users</Label>
    {#each management as permission (permission.value)}
      <Label class="ms-4"><CheckboxGroup.Item value={permission.value} />{permission.label}</Label>
    {/each}
  </CheckboxGroup.Root>
</CheckboxGroup.Root>
