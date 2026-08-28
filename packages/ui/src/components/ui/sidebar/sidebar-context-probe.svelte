<script lang="ts">
import { useSidebar } from "./context.js";

const sidebar = useSidebar();
</script>

<output data-testid="context-state">
  {sidebar.state}:{sidebar.open}:{sidebar.openMobile}:{sidebar.isMobile}
</output>
