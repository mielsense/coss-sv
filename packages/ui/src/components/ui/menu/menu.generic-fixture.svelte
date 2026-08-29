<script lang="ts">
  import * as Menu from "./index.js";

  type ProjectPayload = {
    id: number;
    label: string;
  };

  const handle = new Menu.Handle<ProjectPayload>();
</script>

<Menu.Trigger {handle} payload={{ id: 7, label: "COSS" }}>Open project</Menu.Trigger>
<Menu.Root {handle}>
  {#snippet children({ payload })}
    <Menu.Popup>{payload?.id}: {payload?.label}</Menu.Popup>
  {/snippet}
</Menu.Root>
