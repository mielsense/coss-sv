<script lang="ts">
  import * as Toolbar from "./index.js";
</script>

<Toolbar.Root aria-label="Formatting" class="custom-toolbar">
  <Toolbar.Button>Bold</Toolbar.Button>
  <Toolbar.Link href="/docs">Docs</Toolbar.Link>
  <Toolbar.Input aria-label="Font size" value="12" />
  <Toolbar.Group><Toolbar.Button>Save</Toolbar.Button></Toolbar.Group>
  <Toolbar.Separator />
</Toolbar.Root>
