<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["segmented-control"],
    id: "p-navigation-1",
    interactive: true,
    responsive: true,
    title: "Segmented navigation built with links",
  });
</script>

<script lang="ts">
  import {
    segmentedControlItemVariants,
    segmentedControlRootClassName,
  } from "@coss-sv/ui/lib/segmented-control";

  const itemClassName = segmentedControlItemVariants({ state: "current" });
</script>

<nav aria-label="Project sections">
  <div class={segmentedControlRootClassName}>
    <a aria-current="page" class={itemClassName} href="#overview">Overview</a>
    <a class={itemClassName} href="#activity">Activity</a>
    <a class={itemClassName} href="#settings">Settings</a>
  </div>
</nav>
