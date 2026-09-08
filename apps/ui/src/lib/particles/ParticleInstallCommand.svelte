<script lang="ts">
  import { onMount } from "svelte";
  import PackageManagerCommand from "@/content/components/PackageManagerCommand.svelte";
  import { type PackageManager, shadcnInstallCommands } from "@/content/install-commands.js";

  let { registryUrl }: { registryUrl: string } = $props();
  let selected = $state<PackageManager>("pnpm");
  const commands = $derived(shadcnInstallCommands(registryUrl));

  onMount(() => {
    try {
      const saved = localStorage.getItem("coss-package-manager");
      if (saved === "bun" || saved === "npm" || saved === "pnpm" || saved === "yarn") {
        selected = saved;
      }
    } catch {
      // Package manager preferences are optional.
    }
  });

  $effect(() => {
    const manager = selected;
    try {
      localStorage.setItem("coss-package-manager", manager);
    } catch {
      // Commands remain usable without persisted preferences.
    }
  });
</script>

<PackageManagerCommand {commands} bind:value={selected} />
