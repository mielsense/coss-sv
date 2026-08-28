<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "drawer"],
    id: "p-drawer-7",
    interactive: true,
    responsive: true,
    title: "Nested drawers",
  });
</script>

<script lang="ts">
  import { buttonVariants, Drawer } from "@coss-sv/ui";
</script>

<Drawer.Root>
  <Drawer.Trigger class={buttonVariants({ variant: "outline" })}>Nested drawers</Drawer.Trigger>
  <Drawer.Popup showBar>
    <Drawer.Header class="text-center">
      <Drawer.Title>First step</Drawer.Title><Drawer.Description>
        This is the first step. Tap the button below to continue to the next screen.
      </Drawer.Description>
    </Drawer.Header>
    <Drawer.Footer class="justify-center sm:justify-center" variant="bare">
      <Drawer.Close class={buttonVariants({ variant: "ghost" })}>Cancel</Drawer.Close>
      <Drawer.Root>
        <Drawer.Trigger class={buttonVariants({ variant: "outline" })}>Continue</Drawer.Trigger>
        <Drawer.Popup showBar>
          <Drawer.Header class="text-center">
            <Drawer.Title>Second step</Drawer.Title><Drawer.Description>
              You've reached the second step. Tap the button below to continue to the next screen.
            </Drawer.Description>
          </Drawer.Header>
          <Drawer.Panel>
            <div class="flex justify-center">
              <div class="size-48 shrink-0 rounded-xl border bg-muted"></div>
            </div>
          </Drawer.Panel>
          <Drawer.Footer class="justify-center sm:justify-center" variant="bare">
            <Drawer.Close class={buttonVariants({ variant: "ghost" })}>Back</Drawer.Close>
            <Drawer.Root>
              <Drawer.Trigger class={buttonVariants({ variant: "outline" })}>
                Continue
              </Drawer.Trigger><Drawer.Popup showBar>
                <Drawer.Header class="text-center">
                  <Drawer.Title>Third step</Drawer.Title><Drawer.Description>
                    You've reached the final step. You can close this drawer or go back.
                  </Drawer.Description>
                </Drawer.Header><Drawer.Panel>
                  <div class="flex justify-center">
                    <div class="size-32 shrink-0 rounded-full border bg-muted"></div>
                  </div>
                </Drawer.Panel>
              </Drawer.Popup>
            </Drawer.Root>
          </Drawer.Footer>
        </Drawer.Popup>
      </Drawer.Root>
    </Drawer.Footer>
  </Drawer.Popup>
</Drawer.Root>
