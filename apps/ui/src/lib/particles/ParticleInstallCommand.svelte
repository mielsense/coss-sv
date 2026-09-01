<script lang="ts">
  import { onMount } from "svelte";
  import PackageManagerCommand from "@/content/components/PackageManagerCommand.svelte";
  import { type PackageManager, shadcnInstallCommands } from "@/content/install-commands.js";

  let { registryUrl }: { registryUrl: string } = $props();
  let selected = $state<PackageManager>("pnpm");
  const commands = $derived(shadcnInstallCommands(registryUrl));

  onMount(() => {
    const saved = localStorage.getItem("coss-package-manager");
    if (saved === "bun" || saved === "npm" || saved === "pnpm" || saved === "yarn") {
      selected = saved;
    }
  });

  $effect(() => {
    localStorage.setItem("coss-package-manager", selected);
  });
</script>

<PackageManagerCommand {commands} bind:value={selected} />
