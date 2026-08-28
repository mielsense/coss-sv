<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "dialog", "drawer", "field", "form", "input"],
    id: "p-drawer-12",
    interactive: true,
    responsive: true,
    title: "Responsive dialog and drawer",
  });
</script>

<script lang="ts">
  import { Button, buttonVariants, Dialog, Drawer, Field, Form, Input } from "@coss-sv/ui";
  import { MediaQuery } from "svelte/reactivity";

  const isMobile = new MediaQuery("(max-width: 799px)", false);
</script>

{#snippet fields()}
  <Field.Root>
    <Field.Label>Name</Field.Label><Input value="Margaret Welsh" type="text" />
  </Field.Root><Field.Root>
    <Field.Label>Username</Field.Label><Input value="@maggie.welsh" type="text" />
  </Field.Root>
{/snippet}
{#if isMobile.current}
  <Drawer.Root>
    <Drawer.Trigger class={buttonVariants({ variant: "outline" })}>
      Open
    </Drawer.Trigger><Drawer.Popup showBar>
      <Drawer.Header>
        <Drawer.Title>Edit profile</Drawer.Title><Drawer.Description>
          Make changes to your profile here. Click save when you're done.
        </Drawer.Description>
      </Drawer.Header>
      <Form class="contents">
        <Drawer.Panel class="grid gap-4" scrollable={false}>
          {@render fields()}
        </Drawer.Panel><Drawer.Footer>
          <Drawer.Close class={buttonVariants({ variant: "ghost" })}>Cancel</Drawer.Close><Button
            type="submit">Save</Button
          >
        </Drawer.Footer>
      </Form>
    </Drawer.Popup>
  </Drawer.Root>
{:else}
  <Dialog.Root>
    <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
      Open
    </Dialog.Trigger><Dialog.Popup class="sm:max-w-sm">
      <Dialog.Header>
        <Dialog.Title>Edit profile</Dialog.Title><Dialog.Description>
          Make changes to your profile here. Click save when you're done.
        </Dialog.Description>
      </Dialog.Header>
      <Form class="contents">
        <Dialog.Panel class="grid gap-4">
          {@render fields()}
        </Dialog.Panel><Dialog.Footer>
          <Dialog.Close class={buttonVariants({ variant: "ghost" })}>Cancel</Dialog.Close><Button
            type="submit">Save</Button
          >
        </Dialog.Footer>
      </Form>
    </Dialog.Popup>
  </Dialog.Root>
{/if}
