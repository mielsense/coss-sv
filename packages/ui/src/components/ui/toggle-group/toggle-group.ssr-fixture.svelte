<script lang="ts">
  import * as ToggleGroup from "./index.js";
</script>

<ToggleGroup.Root aria-label="Text formatting" defaultValue={["bold"]} size="sm" variant="outline">
  <ToggleGroup.Item aria-label="Toggle bold" value="bold">Bold</ToggleGroup.Item>
  <ToggleGroup.Separator />
  <ToggleGroup.Item aria-label="Toggle italic" value="italic">Italic</ToggleGroup.Item>
</ToggleGroup.Root>
