<script lang="ts">
import * as Avatar from "./index.js";

const validImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='8' height='8' fill='red'/%3E%3C/svg%3E";
let statuses = $state<string[]>([]);
let rootRef = $state<HTMLElement | null>(null);
let imageRef = $state<HTMLElement | null>(null);
let fallbackRef = $state<HTMLElement | null>(null);
</script>

<Avatar.Root bind:ref={rootRef} data-testid="loaded-avatar">
  <Avatar.Image
    bind:ref={imageRef}
    alt="Profile"
    data-testid="loaded-image"
    src={validImage}
    onLoadingStatusChange={(status) => statuses.push(status)}
  />
  <Avatar.Fallback bind:ref={fallbackRef} data-testid="loaded-fallback">LT</Avatar.Fallback>
</Avatar.Root>

<Avatar.Root data-testid="error-avatar">
  <Avatar.Image alt="Broken" data-testid="error-image" src="data:image/png;base64,broken" />
  <Avatar.Fallback data-testid="error-fallback">ER</Avatar.Fallback>
</Avatar.Root>

<Avatar.Root data-testid="delayed-avatar">
  <Avatar.Fallback data-testid="delayed-fallback" delay={100}>DL</Avatar.Fallback>
</Avatar.Root>

<output data-testid="avatar-state"
  >{statuses.join(",")}:{rootRef?.tagName ?? "missing"}:{imageRef?.tagName ?? "missing"}:{fallbackRef?.tagName ?? "missing"}</output
>
