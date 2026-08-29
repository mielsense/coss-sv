<script lang="ts">
  import * as Sheet from "./index.js";
  const sides = ["right", "left", "top", "bottom"] as const;
</script>

{#each sides as side}
  <Sheet.Root open
    ><Sheet.Popup {side} variant={side === "right" ? "inset" : "default"} data-side={side}
      ><Sheet.Header
        ><Sheet.Title>{side}</Sheet.Title><Sheet.Description>{side} sheet</Sheet.Description
        ></Sheet.Header
      ><Sheet.Panel>Panel</Sheet.Panel><Sheet.Footer>Save</Sheet.Footer></Sheet.Popup
    ></Sheet.Root
  >
{/each}
