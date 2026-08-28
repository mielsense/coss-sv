<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "sheet"],
  id: "p-sheet-3",
  iframeHeight: 640,
  interactive: true,
  responsive: true,
  title: "Sheet sides",
});
</script>
<script lang="ts">
import { Sheet, buttonVariants } from "@coss-sv/ui";
const sides = [
  { label: "Right", side: "right", description: "Right side of the screen." },
  { label: "Left", side: "left", description: "Left side of the screen." },
  { label: "Top", side: "top", description: "Top of the screen." },
  { label: "Bottom", side: "bottom", description: "Bottom of the screen." },
] as const;
const copy =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
</script>
<div class="flex flex-wrap gap-2">
  {#each sides as item}
    <Sheet.Root
      ><Sheet.Trigger class={buttonVariants({ variant: "outline" })}
        >Open {item.label}</Sheet.Trigger
      ><Sheet.Popup showCloseButton={false} side={item.side}
        ><Sheet.Header
          ><Sheet.Title>{item.label}</Sheet.Title
          ><Sheet.Description>{item.description}</Sheet.Description></Sheet.Header
        ><Sheet.Panel><p>{copy}</p></Sheet.Panel></Sheet.Popup
      ></Sheet.Root
    >
  {/each}
</div>
