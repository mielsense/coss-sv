<script lang="ts">
import * as Sidebar from "./index.js";
</script>

<Sidebar.Provider defaultOpen={false}>
  <Sidebar.Root collapsible="none">
    <Sidebar.MenuSkeleton showIcon />
  </Sidebar.Root>
</Sidebar.Provider>
