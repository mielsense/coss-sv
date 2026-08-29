<script module lang="ts">
  import type { ComponentProps } from "svelte";

  type InputComponent = typeof import("../input/input.svelte").default;
  export type SidebarInputProps = ComponentProps<InputComponent>;
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";
  import Input from "../input/input.svelte";

  let { class: className, ref = $bindable(null), ...props }: SidebarInputProps = $props();
</script>

<Input
  bind:ref
  class={cn("h-8 w-full bg-background shadow-none", className)}
  data-sidebar="input"
  data-slot="sidebar-input"
  {...props}
/>
