<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button", "input-group", "tooltip"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-input-9",
  interactive: true,
  responsive: false,
  title: "Password input with toggle visibility",
});
</script>

<script lang="ts">
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { buttonVariants, InputGroup, Tooltip } from "@coss-sv/ui";

let showPassword = $state(false);
</script>

<InputGroup.Root>
  <InputGroup.Input
    aria-label="Password with toggle visibility"
    placeholder="Enter your password"
    type={showPassword ? "text" : "password"}
  />
  <InputGroup.Addon align="inline-end">
    <Tooltip.Root>
      <Tooltip.Trigger
        aria-label={showPassword ? "Hide password" : "Show password"}
        class={buttonVariants({ size: "icon-xs", variant: "ghost" })}
        onclick={() => (showPassword = !showPassword)}
      >
        <HugeiconsIcon
          aria-hidden="true"
          icon={showPassword ? ViewOffIcon : ViewIcon}
          strokeWidth={2}
        />
      </Tooltip.Trigger>
      <Tooltip.Popup>{showPassword ? "Hide password" : "Show password"}</Tooltip.Popup>
    </Tooltip.Root>
  </InputGroup.Addon>
</InputGroup.Root>
