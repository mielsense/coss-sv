<script lang="ts">
  import type { DrawerPosition } from "./index.js";
  import * as Drawer from "./index.js";
  import Input from "../input/input.svelte";
  let { position }: { position: DrawerPosition } = $props();
  let open = $state(false);
  let snapPoint = $state<number | string | null>("100px");
  const initialValues = [
    "Bora Baloglu",
    "bora@example.com",
    "Margaret Welsh",
    "@maggie.welsh",
    "Margaret Welsh",
    "@maggie.welsh",
    "Margaret Welsh",
    "@maggie.welsh",
  ] as const;
  function setOpen(next: boolean) {
    open = next;
  }
</script>

{#if position === "bottom"}
  <Drawer.Root
    {open}
    onOpenChange={setOpen}
    {position}
    bind:snapPoint
    snapPoints={["100px", "200px", 1]}
    snapToSequentialPoints
  >
    <Drawer.Trigger>Open {position} drawer</Drawer.Trigger>
    <Drawer.Popup data-position={position} data-testid={`${position}-drawer`} showBar>
      {const values = $state<string[]>([...initialValues])}
      <Drawer.Header
        ><Drawer.Title>{position} drawer</Drawer.Title><Drawer.Description
          >{position} content.</Drawer.Description
        ></Drawer.Header
      >
      <Drawer.Panel
        >{#each values as value, index}
          <Input aria-label={`Drawer seed ${index + 1}`} bind:value={values[index]} />
        {/each}
        <button type="button">Focusable {position}</button>
        {#if position === "bottom"}
          <Drawer.Root
            ><Drawer.Trigger>Open nested drawer</Drawer.Trigger><Drawer.Popup
              ><Drawer.Header
                ><Drawer.Title>Nested drawer</Drawer.Title><Drawer.Description
                  >Nested content.</Drawer.Description
                ></Drawer.Header
              ><Drawer.Footer><Drawer.Close>Done</Drawer.Close></Drawer.Footer></Drawer.Popup
            ></Drawer.Root
          >
        {/if}</Drawer.Panel
      >
      <Drawer.Footer><Drawer.Close>Close {position}</Drawer.Close></Drawer.Footer>
    </Drawer.Popup>
  </Drawer.Root>
{:else}
  <Drawer.Root {open} onOpenChange={setOpen} {position}
    ><Drawer.Trigger>Open {position} drawer</Drawer.Trigger><Drawer.Popup
      data-position={position}
      data-testid={`${position}-drawer`}
      showBar
      variant={position === "right" ? "inset" : "default"}
      ><Drawer.Header
        ><Drawer.Title>{position} drawer</Drawer.Title><Drawer.Description
          >{position} content.</Drawer.Description
        ></Drawer.Header
      ><Drawer.Panel><button type="button">Focusable {position}</button></Drawer.Panel
      ><Drawer.Footer><Drawer.Close>Close {position}</Drawer.Close></Drawer.Footer></Drawer.Popup
    ></Drawer.Root
  >
{/if}
<output data-testid={`${position}-state`}>{open}:{snapPoint}</output>
