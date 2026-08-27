<script lang="ts">
import * as Select from "./index.js";
const items = [{ label: "Next.js", value: "next" }];
</script>
<Select.Root {items} value="next"
  ><Select.Label>Framework</Select.Label
  ><Select.Trigger><Select.Value /></Select.Trigger></Select.Root
>
