<script lang="ts">
  import { Button, Field, Form, Input, Sheet, buttonVariants } from "@coss-sv/ui";
  const sides = ["right", "left", "top", "bottom"] as const;
  const variants = ["default", "inset"] as const;
</script>

<div class="fixture">
  {#each variants as variant, index}
    <section data-particle={`p-sheet-${index + 1}`}>
      <Sheet.Root
        ><Sheet.Trigger class={buttonVariants({ variant: "outline" })}>Open Sheet</Sheet.Trigger
        ><Sheet.Popup {variant}
          >{const profile = $state({ name: "Margaret Welsh", username: "@maggie.welsh" })}
          <Sheet.Header
            ><Sheet.Title>Edit profile</Sheet.Title><Sheet.Description
              >Make changes to your profile here. Click save when you're done.</Sheet.Description
            ></Sheet.Header
          >
          <Form class="contents"
            ><Sheet.Panel class="grid gap-4"
              ><Field.Root
                ><Field.Label>Name</Field.Label>
                <Input bind:value={profile.name} type="text" /></Field.Root
              ><Field.Root
                ><Field.Label>Username</Field.Label>
                <Input bind:value={profile.username} type="text" /></Field.Root
              ></Sheet.Panel
            ><Sheet.Footer
              ><Sheet.Close class={buttonVariants({ variant: "ghost" })}>Cancel</Sheet.Close><Button
                type="submit">Save</Button
              ></Sheet.Footer
            ></Form
          ></Sheet.Popup
        ></Sheet.Root
      >
    </section>
  {/each}
  <section data-particle="p-sheet-3">
    <div class="flex flex-wrap gap-2">
      {#each sides as side}
        <Sheet.Root
          ><Sheet.Trigger class={buttonVariants({ variant: "outline" })}
            >Open {side[0]?.toUpperCase()}{side.slice(1)}</Sheet.Trigger
          ><Sheet.Popup {side} showCloseButton={false}
            ><Sheet.Header
              ><Sheet.Title>{side[0]?.toUpperCase()}{side.slice(1)}</Sheet.Title><Sheet.Description
                >{side === "right" || side === "left"
                  ? `${side[0]?.toUpperCase()}${side.slice(1)} side of the screen.`
                  : `${side[0]?.toUpperCase()}${side.slice(1)} of the screen.`}</Sheet.Description
              ></Sheet.Header
            ><Sheet.Panel
              ><p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </p></Sheet.Panel
            ></Sheet.Popup
          ></Sheet.Root
        >
      {/each}
    </div>
  </section>
</div>

<style>
  .fixture {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
    gap: 3rem;
    padding: 2rem;
  }
  .fixture > section {
    display: flex;
    min-height: 12rem;
    align-items: center;
    justify-content: center;
  }
</style>
