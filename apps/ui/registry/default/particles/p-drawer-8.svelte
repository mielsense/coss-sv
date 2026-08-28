<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "drawer", "field", "input"],
  id: "p-drawer-8",
  interactive: true,
  responsive: true,
  title: "Nested inset drawers",
});
</script>
<script lang="ts">
import { Button, Drawer, Field, Input, buttonVariants } from "@coss-sv/ui";
</script>
<Drawer.Root position="right">
  <Drawer.Trigger class={buttonVariants({ variant: "outline" })}
    >Nested inset drawers</Drawer.Trigger
  >
  <Drawer.Popup variant="inset">
    <Drawer.Header
      ><Drawer.Title>Manage team member</Drawer.Title
      ><Drawer.Description>View and manage a user in your team.</Drawer.Description></Drawer.Header
    >
    <Drawer.Panel class="grid gap-4"
      ><div class="grid gap-1">
        <p class="text-muted-foreground text-sm">Name</p>
        <p class="font-medium text-sm">Bora Baloglu</p>
      </div>
      <div class="grid gap-1">
        <p class="text-muted-foreground text-sm">Email</p>
        <p class="font-medium text-sm">bora@example.com</p>
      </div></Drawer.Panel
    >
    <Drawer.Footer
      ><Drawer.Root position="right"
        ><Drawer.Trigger class={buttonVariants({ variant: "outline" })}>Edit details</Drawer.Trigger
        ><Drawer.Popup variant="inset"
          ><Drawer.Header
            ><Drawer.Title>Edit details</Drawer.Title
            ><Drawer.Description
              >Make changes to the member's information.</Drawer.Description
            ></Drawer.Header
          ><Drawer.Panel class="grid gap-4"
            ><Field.Root
              ><Field.Label>Name</Field.Label><Input value="Bora Baloglu" type="text" /></Field.Root
            ><Field.Root
              ><Field.Label>Email</Field.Label>
              <Input value="bora@example.com" type="email" /></Field.Root
            ></Drawer.Panel
          ><Drawer.Footer
            ><Drawer.Close class={buttonVariants({ variant: "ghost" })}>Cancel</Drawer.Close
            ><Button type="submit">Save changes</Button></Drawer.Footer
          ></Drawer.Popup
        ></Drawer.Root
      ></Drawer.Footer
    >
  </Drawer.Popup>
</Drawer.Root>
