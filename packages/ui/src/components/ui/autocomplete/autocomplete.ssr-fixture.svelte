<script lang="ts">
import * as Autocomplete from "./index.js";
const items = ["Apple", "Banana"];
</script>
<Autocomplete.Root {items} value="Apple"
  ><Autocomplete.Input aria-label="Fruit" showClear showTrigger /></Autocomplete.Root
>
