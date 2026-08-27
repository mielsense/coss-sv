<script lang="ts">
import { ScrollArea as ScrollAreaPrimitive } from "@shardsui/svelte";
import ScrollBar from "./scroll-bar.svelte";
</script>

<ScrollAreaPrimitive.Root>
  <ScrollAreaPrimitive.Viewport>
    <div>Content</div>
  </ScrollAreaPrimitive.Viewport>
  <ScrollBar class="consumer" keepMounted />
  <ScrollBar keepMounted orientation="horizontal" />
</ScrollAreaPrimitive.Root>
