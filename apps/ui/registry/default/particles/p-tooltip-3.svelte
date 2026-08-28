<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["toggle-group", "tooltip"],
  id: "p-tooltip-3",
  interactive: true,
  responsive: true,
  title: "Detached animated tooltip",
});
</script>
<script lang="ts">
import { ToggleGroup, Tooltip, toggleVariants } from "@coss-sv/ui";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import type { Snippet } from "svelte";

const tooltipHandle = new Tooltip.Handle<Snippet>();
const controls = [
  { label: "Toggle bold", value: "bold", icon: BoldIcon },
  { label: "Toggle italic", value: "italic", icon: ItalicIcon },
  { label: "Toggle underline", value: "underline", icon: UnderlineIcon },
] as const;
let selected = $state(["bold"]);
let focusValue = $state("bold");

function toggle(value: string): void {
  selected = selected.includes(value)
    ? selected.filter((item) => item !== value)
    : [...selected, value];
}

function moveFocus(event: KeyboardEvent): void {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  const current = event.currentTarget;
  if (!(current instanceof HTMLButtonElement)) return;
  const triggers = Array.from(
    current
      .closest('[data-slot="toggle-group"]')
      ?.querySelectorAll<HTMLButtonElement>('[data-slot="tooltip-trigger"]') ?? [],
  );
  const index = triggers.indexOf(current);
  if (index < 0) return;
  event.preventDefault();
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? triggers.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + triggers.length) % triggers.length;
  triggers[next]?.focus();
}
</script>
{#snippet boldContent()}
  <span>Make text bold</span>
{/snippet}
{#snippet italicContent()}
  <span>Apply italic formatting to text</span>
{/snippet}
{#snippet underlineContent()}
  <span>Underline text</span>
{/snippet}
<Tooltip.Provider
  ><ToggleGroup.Root multiple value={selected}
    >{#each controls as control, index}
      <Tooltip.Trigger
        aria-label={control.label}
        aria-pressed={selected.includes(control.value)}
        class={toggleVariants({ class: "after:absolute after:left-full after:h-full after:w-1" })}
        data-pressed={selected.includes(control.value) ? "" : undefined}
        handle={tooltipHandle}
        onclick={() => toggle(control.value)}
        onfocus={() => (focusValue = control.value)}
        onkeydown={moveFocus}
        payload={[boldContent, italicContent, underlineContent][index]}
        tabindex={focusValue === control.value ? 0 : -1}
        ><HugeiconsIcon aria-hidden="true" icon={control.icon} strokeWidth={2} /></Tooltip.Trigger
      >
    {/each}</ToggleGroup.Root
  ><Tooltip.Root handle={tooltipHandle}
    >{#snippet children({ payload })}
      <Tooltip.Popup id="formatting-tooltip"
        >{#if payload}
          {@render payload()}
        {/if}</Tooltip.Popup
      >
    {/snippet}</Tooltip.Root
  ></Tooltip.Provider
>
