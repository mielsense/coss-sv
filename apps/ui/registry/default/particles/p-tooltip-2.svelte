<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["toggle-group", "tooltip"],
    id: "p-tooltip-2",
    interactive: true,
    responsive: true,
    title: "Tooltip provider group",
  });
</script>

<script lang="ts">
  import { ToggleGroup, Tooltip, toggleVariants } from "@coss-sv/ui";
  import {
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
  } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";

  const controls = [
    { label: "Bold", value: "bold", icon: BoldIcon },
    { label: "Italic", value: "italic", icon: ItalicIcon },
    { label: "Underline", value: "underline", icon: UnderlineIcon },
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
        ?.querySelectorAll<HTMLButtonElement>(
          '[data-slot="tooltip-trigger"]',
        ) ?? [],
    );
    const index = triggers.indexOf(current);
    if (index < 0) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? triggers.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + triggers.length) %
            triggers.length;
    triggers[next]?.focus();
  }
</script>

<Tooltip.Provider>
  <ToggleGroup.Root multiple value={selected}>
    {#each controls as control}
      <Tooltip.Root>
        <Tooltip.Trigger
          aria-label={`Toggle ${control.value}`}
          aria-pressed={selected.includes(control.value)}
          class={toggleVariants()}
          data-pressed={selected.includes(control.value) ? "" : undefined}
          onclick={() => toggle(control.value)}
          onfocus={() => (focusValue = control.value)}
          onkeydown={moveFocus}
          tabindex={focusValue === control.value ? 0 : -1}
        >
          <HugeiconsIcon
            aria-hidden="true"
            icon={control.icon}
            strokeWidth={2}
          />
        </Tooltip.Trigger><Tooltip.Popup id={`format-${control.value}-tooltip`}>
          {control.label}
        </Tooltip.Popup>
      </Tooltip.Root>
    {/each}
  </ToggleGroup.Root>
</Tooltip.Provider>
