<script lang="ts">
import type { ApiProperty } from "../compiler.js";

type Props = {
  properties: readonly ApiProperty[];
};

let { properties }: Props = $props();
</script>

<div class="my-6 max-w-full overflow-x-auto rounded-xl border">
  <table class="w-full border-collapse text-left text-sm">
    <thead>
      <tr class="border-b">
        <th class="px-4 py-2 font-medium">Prop</th>
        <th class="px-4 py-2 font-medium">Type</th>
        <th class="px-4 py-2 font-medium">Default</th>
        <th class="px-4 py-2 font-medium">Description</th>
      </tr>
    </thead>
    <tbody>
      {#each properties as property (property.name)}
        <tr class="border-b last:border-b-0">
          <td class="px-4 py-2 font-mono text-xs">
            {property.name}{property.required ? " *" : ""}
          </td>
          <td class="px-4 py-2 font-mono text-xs text-muted-foreground">{property.type}</td>
          <td class="px-4 py-2 font-mono text-xs text-muted-foreground">
            {property.defaultValue ?? "—"}
          </td>
          <td class="min-w-64 px-4 py-2 text-muted-foreground">{property.description}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
