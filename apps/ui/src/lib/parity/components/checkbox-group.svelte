<script lang="ts">
  import { Button, CheckboxGroup, Field, FieldsetLegend, Form, Label } from "@coss-sv/ui";

  const frameworks = [
    { id: "next", name: "Next.js" },
    { id: "vite", name: "Vite" },
    { id: "astro", name: "Astro" },
  ];

  const mainPermissions = [
    { id: "view-dashboard", name: "View Dashboard" },
    { id: "manage-users", name: "Manage Users" },
    { id: "access-reports", name: "Access Reports" },
  ];

  const userManagementPermissions = [
    { id: "create-user", name: "Create User" },
    { id: "edit-user", name: "Edit User" },
    { id: "delete-user", name: "Delete User" },
    { id: "assign-roles", name: "Assign Roles" },
  ];

  let frameworkValue = $state<string[]>([]);
  let mainValue = $state<string[]>([]);
  let managementValue = $state<string[]>([]);
  let loading = $state(false);
  const fixtureId = $props.id();
  const frameworksLegendId = `${fixtureId}-frameworks-legend`;

  const managementIsPartial = $derived(
    managementValue.length > 0 && managementValue.length !== userManagementPermissions.length,
  );

  function updateMain(value: string[]) {
    if (value.includes("manage-users")) {
      managementValue = userManagementPermissions.map((permission) => permission.id);
    } else if (managementValue.length === userManagementPermissions.length) {
      managementValue = [];
    }
    mainValue = value;
  }

  function updateManagement(value: string[]) {
    if (value.length === userManagementPermissions.length) {
      mainValue = Array.from(new Set([...mainValue, "manage-users"]));
    } else {
      mainValue = mainValue.filter((item) => item !== "manage-users");
    }
    managementValue = value;
  }

  async function submitFrameworks(event: SubmitEvent) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    loading = true;
    await new Promise((resolve) => setTimeout(resolve, 800));
    loading = false;
    const selectedFrameworks = formData.getAll("frameworks");
    alert(`Selected: ${selectedFrameworks.join(", ") || "none"}`);
  }
</script>

<div class="checkbox-group-fixture">
  <section data-particle="p-checkbox-group-1">
    <CheckboxGroup.Root aria-label="Select frameworks" defaultValue={["next"]}>
      <Label><CheckboxGroup.Item value="next" />Next.js</Label>
      <Label><CheckboxGroup.Item value="vite" />Vite</Label>
      <Label><CheckboxGroup.Item value="astro" />Astro</Label>
    </CheckboxGroup.Root>
  </section>

  <section data-particle="p-checkbox-group-2">
    <CheckboxGroup.Root aria-label="Select frameworks" defaultValue={["next"]}>
      <Label><CheckboxGroup.Item value="next" />Next.js</Label>
      <Label><CheckboxGroup.Item disabled value="vite" />Vite</Label>
      <Label><CheckboxGroup.Item value="astro" />Astro</Label>
    </CheckboxGroup.Root>
  </section>

  <section data-particle="p-checkbox-group-3">
    <CheckboxGroup.Root
      allValues={frameworks.map((framework) => framework.id)}
      aria-labelledby="frameworks-caption"
      bind:value={frameworkValue}
    >
      <Label id="frameworks-caption">
        <CheckboxGroup.Item name="frameworks" parent />
        Frameworks
      </Label>
      {#each frameworks as framework (framework.id)}
        <Label class="ms-4">
          <CheckboxGroup.Item value={framework.id} />
          {framework.name}
        </Label>
      {/each}
    </CheckboxGroup.Root>
  </section>

  <section data-particle="p-checkbox-group-4">
    <CheckboxGroup.Root
      allValues={mainPermissions.map((permission) => permission.id)}
      aria-labelledby="user-permissions-caption"
      onValueChange={updateMain}
      value={mainValue}
    >
      <Label id="user-permissions-caption">
        <CheckboxGroup.Item indeterminate={managementIsPartial} parent />
        User Permissions
      </Label>

      {#each mainPermissions.filter((permission) => permission.id !== "manage-users") as permission (permission.id)}
        <Label class="ms-4">
          <CheckboxGroup.Item value={permission.id} />
          {permission.name}
        </Label>
      {/each}

      <CheckboxGroup.Root
        allValues={userManagementPermissions.map((permission) => permission.id)}
        aria-labelledby="manage-users-caption"
        class="ms-4"
        onValueChange={updateManagement}
        value={managementValue}
      >
        <Label id="manage-users-caption">
          <CheckboxGroup.Item parent />
          Manage Users
        </Label>

        {#each userManagementPermissions as permission (permission.id)}
          <Label class="ms-4">
            <CheckboxGroup.Item value={permission.id} />
            {permission.name}
          </Label>
        {/each}
      </CheckboxGroup.Root>
    </CheckboxGroup.Root>
  </section>

  <section data-particle="p-checkbox-group-5">
    <Form class="flex w-full max-w-[160px] flex-col gap-4" onsubmit={submitFrameworks}>
      <Field.Root aria-labelledby={frameworksLegendId} as="fieldset" name="frameworks">
        <FieldsetLegend id={frameworksLegendId} class="font-medium text-sm"
          >Frameworks</FieldsetLegend
        >
        <CheckboxGroup.Root aria-labelledby={frameworksLegendId} defaultValue={["next"]}>
          <Field.Item>
            <Field.Label><CheckboxGroup.Item value="next" />Next.js</Field.Label>
          </Field.Item>
          <Field.Item>
            <Field.Label><CheckboxGroup.Item value="vite" />Vite</Field.Label>
          </Field.Item>
          <Field.Item>
            <Field.Label><CheckboxGroup.Item value="astro" />Astro</Field.Label>
          </Field.Item>
        </CheckboxGroup.Root>
      </Field.Root>
      <Button {loading} type="submit">Submit</Button>
    </Form>
  </section>
</div>

<style>
  .checkbox-group-fixture {
    display: grid;
    box-sizing: border-box;
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
    gap: 3rem;
    padding: 2rem;
  }

  .checkbox-group-fixture > section {
    display: flex;
    min-width: 0;
    align-items: center;
    justify-content: center;
  }
</style>
