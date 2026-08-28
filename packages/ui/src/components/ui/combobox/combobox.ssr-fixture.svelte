<script lang="ts">
import * as Combobox from "./index.js";
const items = ["Apple", "Banana"];
</script>
<Combobox.Root {items} value="Apple">
  <Combobox.Input
    aria-label="Fruit"
    clearProps={{ "aria-label": "Clear fruit", "data-testid": "composed-clear" }}
    showClear
    showTrigger
  />
</Combobox.Root>

<Combobox.Root {items} value="Apple">
  <Combobox.Clear data-testid="bare-clear" />
</Combobox.Root>
