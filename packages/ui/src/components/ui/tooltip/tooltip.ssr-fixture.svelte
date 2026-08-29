<script lang="ts">
  import * as Tooltip from "./index.js";
</script>

<Tooltip.Provider delay={0}>
  <Tooltip.Root>
    <Tooltip.Trigger>Hover me</Tooltip.Trigger>
    <Tooltip.Popup>Helpful hint</Tooltip.Popup>
  </Tooltip.Root>
</Tooltip.Provider>
