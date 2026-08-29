<script lang="ts">
  import * as RadioGroup from "./index.js";
</script>

<RadioGroup.Root aria-label="Framework" class="custom-group" defaultValue="vite" name="framework">
  <label for="ssr-next">
    <RadioGroup.Item class="custom-radio" id="ssr-next" value="next" />
    Next.js
  </label>
  <label for="ssr-vite">
    <RadioGroup.Item id="ssr-vite" value="vite" />
    Vite
  </label>
</RadioGroup.Root>
