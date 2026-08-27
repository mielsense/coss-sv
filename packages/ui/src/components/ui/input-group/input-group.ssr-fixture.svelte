<script lang="ts">
import * as InputGroup from "./index.js";
</script>

<InputGroup.Root aria-label="Website">
  <InputGroup.Addon><InputGroup.Text>https://</InputGroup.Text></InputGroup.Addon>
  <InputGroup.Input id="website" name="website" value="example.com" />
</InputGroup.Root>

<InputGroup.Root aria-label="Biography">
  <InputGroup.Textarea id="biography" name="biography" value="Hello" />
  <InputGroup.Addon align="block-end">200 characters left</InputGroup.Addon>
</InputGroup.Root>
