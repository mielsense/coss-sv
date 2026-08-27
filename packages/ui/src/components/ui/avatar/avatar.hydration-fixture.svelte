<script lang="ts">
import * as Avatar from "./index.js";

let currentSrc = $state("avatar-success.png");
</script>

<Avatar.Root data-testid="hydration-avatar">
  <Avatar.Image alt="Hydration profile" data-testid="hydration-avatar-image" src={currentSrc} />
  <Avatar.Fallback data-testid="hydration-avatar-fallback">HY</Avatar.Fallback>
</Avatar.Root>
<button
  type="button"
  data-testid="hydrate-avatar-error"
  onclick={() => (currentSrc = "avatar-error.png")}
>
  Load broken avatar
</button>
