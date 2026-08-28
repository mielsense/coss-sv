<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "group", "tooltip"],
  id: "p-tooltip-4",
  interactive: true,
  responsive: true,
  title: "Detached share tooltips",
});
</script>
<script lang="ts">
import { Link01Icon, Mail01Icon, Share08Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Button, Group, Tooltip } from "@coss-sv/ui";
import type { Snippet } from "svelte";
const tooltipHandle = new Tooltip.Handle<Snippet>();
const controls = [
  { label: "Copy link", icon: Link01Icon },
  { label: "Share via email", icon: Mail01Icon },
  { label: "Share to social", icon: Share08Icon },
] as const;
</script>
{#snippet linkContent()}
  <span>Copy shareable link</span>
{/snippet}
{#snippet emailContent()}
  <span>Share via email</span>
{/snippet}
{#snippet socialContent()}
  <span>Share to social media</span>
{/snippet}
<Tooltip.Provider
  ><Group.Root aria-label="Share options" orientation="vertical"
    >{#each controls as control, index}
      <Tooltip.Trigger
        as="span"
        class="contents"
        handle={tooltipHandle}
        payload={[linkContent, emailContent, socialContent][index]}
        ><Button
          aria-describedby="share-tooltip"
          aria-label={control.label}
          size="icon"
          variant="outline"
          ><HugeiconsIcon aria-hidden="true" icon={control.icon} strokeWidth={2} /></Button
        ></Tooltip.Trigger
      >
      {#if index < controls.length - 1}
        <Group.Separator orientation="horizontal" />
      {/if}
    {/each}</Group.Root
  ><Tooltip.Root handle={tooltipHandle}
    >{#snippet children({ payload })}
      <Tooltip.Popup class="max-w-40" id="share-tooltip" side="right"
        >{#if payload}
          {@render payload()}
        {/if}</Tooltip.Popup
      >
    {/snippet}</Tooltip.Root
  ></Tooltip.Provider
>
