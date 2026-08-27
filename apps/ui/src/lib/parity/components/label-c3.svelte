<script lang="ts">
import { Input, Label } from "@coss-sv/ui";

const id = $props.id();
</script>

<div class="docs-preview-width" data-particle="p-input-6">
  <div class="flex flex-col items-start gap-2">
    <Label for={id}>Email</Label>
    <Input aria-label="Email" {id} placeholder="you@example.com" type="email" />
  </div>
</div>

<style>
.docs-preview-width {
  width: min(16rem, 100%);
}
</style>
