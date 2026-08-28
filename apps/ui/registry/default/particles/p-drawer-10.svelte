<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "drawer", "field", "form", "input"],
    id: "p-drawer-10",
    interactive: true,
    responsive: true,
    title: "Drawer footer variants",
  });
</script>

<script lang="ts">
  import {
    Button,
    buttonVariants,
    Drawer,
    Field,
    Form,
    Input,
  } from "@coss-sv/ui";
</script>

{#snippet profileForm(variant?: "bare")}
  <Drawer.Header>
    <Drawer.Title>Edit profile</Drawer.Title><Drawer.Description>
      Make changes to your profile here. Click save when you're done.
    </Drawer.Description>
  </Drawer.Header>
  <Form class="contents">
    <Drawer.Panel class="grid gap-4">
      <Field.Root>
        <Field.Label>Name</Field.Label><Input
          value="Margaret Welsh"
          type="text"
        />
      </Field.Root><Field.Root>
        <Field.Label>Username</Field.Label><Input
          value="@maggie.welsh"
          type="text"
        />
      </Field.Root>
    </Drawer.Panel><Drawer.Footer {variant}>
      <Drawer.Close class={buttonVariants({ variant: "ghost" })}>
        Cancel
      </Drawer.Close><Button>Save</Button>
    </Drawer.Footer>
  </Form>
{/snippet}
<div class="flex flex-wrap gap-2">
  <Drawer.Root position="right">
    <Drawer.Trigger class={buttonVariants({ variant: "outline" })}>
      Default footer
    </Drawer.Trigger><Drawer.Popup variant="inset">
      {@render profileForm()}
    </Drawer.Popup>
  </Drawer.Root>
  <Drawer.Root position="right">
    <Drawer.Trigger class={buttonVariants({ variant: "outline" })}>
      Bare footer
    </Drawer.Trigger><Drawer.Popup variant="inset">
      {@render profileForm("bare")}
    </Drawer.Popup>
  </Drawer.Root>
</div>
