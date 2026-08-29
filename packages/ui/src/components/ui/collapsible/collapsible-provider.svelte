<script lang="ts">
  import type { Snippet } from "svelte";
  import { type CollapsibleState, setCollapsibleDelegateContext } from "./context.js";

  let {
    children,
    setOpen,
    state: collapsibleState,
  }: {
    children: Snippet;
    setOpen: (open: boolean) => void;
    state: CollapsibleState;
  } = $props();

  let panelId = $state<string>();

  setCollapsibleDelegateContext({
    get panelId() {
      return panelId;
    },
    registerPanelId: (id) => {
      panelId = id;
      return () => {
        if (panelId === id) panelId = undefined;
      };
    },
    setOpen: (open) => setOpen(open),
    get state() {
      return collapsibleState;
    },
  });
</script>

{@render children()}
