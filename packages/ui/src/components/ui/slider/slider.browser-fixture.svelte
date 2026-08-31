<script lang="ts">
  import { DirectionProvider } from "@shardsui/svelte";
  import * as Slider from "./index.js";

  let bound = $state(20);
  let vertical = $state(40);
  let rtl = $state(20);
  let range = $state<readonly number[]>([20, 80]);
  let changed = $state("");
  let committed = $state("");
  let rootRef = $state<HTMLElement | null>(null);
  let fallbackMin = $state(10);
  let accepted = $state<number | readonly number[]>(30);
  let attempted = $state("");
  let collisionNone = $state<readonly number[]>([20, 40]);
  let collisionSwap = $state<readonly number[]>([20, 40]);
  let canceledChanged = $state("");
  let canceledCommits = $state(0);

  function recordChanged(value: number | readonly number[]) {
    changed = Array.isArray(value) ? value.join(",") : String(value);
  }

  function recordCommitted(value: number | readonly number[]) {
    committed = Array.isArray(value) ? value.join(",") : String(value);
  }

  function getAccepted() {
    return accepted;
  }

  function setAccepted(next: number | readonly number[]) {
    attempted = Array.isArray(next) ? next.join(",") : String(next);
    if (typeof next === "number" && next <= 50) accepted = next;
  }
</script>

<Slider.Root
  bind:ref={rootRef}
  bind:value={bound}
  aria-label="Bound volume"
  data-testid="bound-root"
  largeStep={10}
  name="volume"
  onValueChange={recordChanged}
  onValueCommitted={recordCommitted}
  step={2}
>
  <Slider.Value data-testid="bound-output" />
</Slider.Root>
<output data-testid="bound-state">{bound}</output>
<output data-testid="changed">{changed}</output>
<output data-testid="committed">{committed}</output>
<output data-testid="root-ref">{rootRef?.tagName ?? ""}</output>
<button type="button" onclick={() => (bound = 64)}>Set parent</button>

<Slider.Root
  bind:value={getAccepted, setAccepted}
  aria-label="Rejected setter"
  data-testid="rejected-root"
>
  <Slider.Value data-testid="rejected-output" />
</Slider.Root>
<output data-testid="accepted-state"
  >{Array.isArray(accepted) ? accepted.join(",") : accepted}</output
>
<output data-testid="attempted-state">{attempted}</output>

<Slider.Root
  aria-label="Default volume"
  data-testid="default-root"
  defaultValue={30}
  class="consumer-class"
>
  <Slider.Value data-testid="default-output" />
</Slider.Root>

<Slider.Root aria-label="Minimum fallback" data-testid="min-root" min={fallbackMin}>
  <Slider.Value data-testid="min-output" />
</Slider.Root>
<button type="button" onclick={() => (fallbackMin = 35)}>Change minimum</button>

<Slider.Root
  bind:value={range}
  aria-label="Price range"
  data-testid="range-root"
  minStepsBetweenValues={10}
  name="price"
>
  <Slider.Value data-testid="range-output" />
</Slider.Root>
<output data-testid="range-state">{range.join(",")}</output>

<div style="height: 200px; width: 24px;">
  <Slider.Root
    bind:value={vertical}
    aria-label="Vertical level"
    data-testid="vertical-root"
    orientation="vertical"
  />
</div>
<output data-testid="vertical-state">{vertical}</output>

<div dir="rtl">
  <DirectionProvider direction="rtl">
    <Slider.Root bind:value={rtl} aria-label="RTL level" data-testid="rtl-root" />
  </DirectionProvider>
</div>
<output data-testid="rtl-state">{rtl}</output>

<Slider.Root aria-label="Disabled level" data-testid="disabled-root" disabled value={50} />

<form data-testid="form">
  <Slider.Root aria-label="Form range" defaultValue={[10, 90]} name="window" />
  <button type="submit">Submit</button>
</form>

<div style="width: 200px; padding: 0;">
  <Slider.Root
    aria-label="Pointer level"
    data-testid="pointer-root"
    defaultValue={0}
    onValueChange={recordChanged}
    onValueCommitted={recordCommitted}
  />
</div>

<div style="width: 200px; padding: 0;">
  <Slider.Root
    bind:value={collisionNone}
    aria-label="Collision none"
    data-testid="collision-none-root"
    thumbCollisionBehavior="none"
  />
</div>
<output data-testid="collision-none-state">{collisionNone.join(",")}</output>

<div style="width: 200px; padding: 0;">
  <Slider.Root
    bind:value={collisionSwap}
    aria-label="Collision swap"
    data-testid="collision-swap-root"
    thumbCollisionBehavior="swap"
  />
</div>
<output data-testid="collision-swap-state">{collisionSwap.join(",")}</output>

<Slider.Root
  aria-label="Canceled level"
  data-testid="canceled-root"
  defaultValue={25}
  onValueChange={(_value, details) => {
    details.allowPropagation();
    details.cancel();
    canceledChanged = `${details.reason}:${details.event.type}:${details.activeThumbIndex}:${details.isPropagationAllowed}`;
  }}
  onValueCommitted={() => (canceledCommits += 1)}
>
  <Slider.Value data-testid="canceled-output" />
</Slider.Root>
<output data-testid="canceled-changed">{canceledChanged}</output>
<output data-testid="canceled-commits">{canceledCommits}</output>
