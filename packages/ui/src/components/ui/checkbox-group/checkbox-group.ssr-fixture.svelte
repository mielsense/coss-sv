<script lang="ts">
import { Label } from "../label/index.js";
import * as CheckboxGroup from "./index.js";
</script>

<CheckboxGroup.Root
  allValues={["next", "vite", "astro"]}
  aria-labelledby="frameworks-label"
  class="custom-group"
  defaultValue={["next"]}
  disabled
  id="frameworks-group"
>
  <Label id="frameworks-label">
    <CheckboxGroup.Item parent />
    Frameworks
  </Label>
  <Label>
    <CheckboxGroup.Item value="next" />
    Next.js
  </Label>
  <Label>
    <CheckboxGroup.Item value="vite" />
    Vite
  </Label>
  <Label>
    <CheckboxGroup.Item value="astro" />
    Astro
  </Label>
</CheckboxGroup.Root>
