<script lang="ts">
import { Label } from "../label/index.js";
import * as CheckboxGroup from "./index.js";

let { defaultValue = [] }: { defaultValue?: string[] } = $props();
</script>

<CheckboxGroup.Root aria-label="Default group" {defaultValue}>
  <Label><CheckboxGroup.Item value="one" />Default one</Label>
  <Label><CheckboxGroup.Item value="two" />Default two</Label>
</CheckboxGroup.Root>
