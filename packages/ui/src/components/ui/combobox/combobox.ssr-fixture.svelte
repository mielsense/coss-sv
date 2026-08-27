<script lang="ts">
import * as Combobox from "./index.js";
const items = ["Apple", "Banana"];
</script>
<Combobox.Root {items} value="Apple"
  ><Combobox.Input aria-label="Fruit" showClear showTrigger /></Combobox.Root
>
