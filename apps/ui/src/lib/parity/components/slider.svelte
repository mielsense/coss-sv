<script lang="ts">
import { Button, Field, Fieldset, Form, Slider } from "@coss-sv/ui";

const ticks = Array.from({ length: 13 }, (_, index) => index);
const ratingLabels = ["Awful", "Poor", "Okay", "Good", "Amazing"] as const;
const bands = [
  { label: "60 Hz", value: 2 },
  { label: "250 Hz", value: 1 },
  { label: "1k", value: -1 },
  { label: "4k", value: -3 },
  { label: "16k", value: 2 },
] as const;

let volume = $state<number | readonly number[]>(25);
let credits = $state(100);
let prices = $state<readonly number[]>([5, 1240]);
let rating = $state<number | readonly number[]>(3);
let formLoading = $state(false);
let formValue = $state<number | readonly number[]>([25, 75]);

const currentRating = $derived(Array.isArray(rating) ? (rating[0] ?? 1) : rating);

function scalar(value: number | readonly number[]): number {
  return typeof value === "number" ? value : (value[0] ?? 0);
}

function formatPrice(price: number): string {
  const formatted = `$${price.toLocaleString()}`;
  return price === 1240 ? `${formatted}+` : formatted;
}

async function handleSubmit(event: SubmitEvent) {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const formData = new FormData(form);
  formLoading = true;
  await new Promise((resolve) => setTimeout(resolve, 800));
  formLoading = false;
  const volumes = formData.getAll("volume");
  window.alert(`Volume: ${volumes.join(", ")}`);
}
</script>

<div class="slider-fixture">
  <section class="w-full max-w-64" data-particle="p-slider-1">
    <Slider.Root defaultValue={50} />
  </section>

  <section class="w-full max-w-64" data-particle="p-slider-2">
    <Field.Root>
      <Slider.Root defaultValue={50}>
        <div class="mb-2 flex items-center justify-between gap-1">
          <Field.Label class="font-medium text-sm">Opacity</Field.Label>
          <Slider.Value />
        </div>
      </Slider.Root>
    </Field.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-slider-3">
    <Slider.Root defaultValue={50} disabled />
  </section>

  <section class="w-full max-w-64" data-particle="p-slider-4">
    <div>
      <Slider.Root aria-label="Storage size in GB" defaultValue={15} max={35} min={5} />
      <!-- biome-ignore lint/a11y/useSemanticElements: Matches the exact COSS reference DOM. -->
      <div
        aria-label="Storage size reference values"
        class="mt-4 flex w-full items-center justify-between gap-1 font-medium text-muted-foreground text-xs"
        role="group"
      >
        <span>5 GB</span>
        <span>20 GB</span>
        <span>35 GB</span>
      </div>
    </div>
  </section>

  <section class="w-full max-w-64" data-particle="p-slider-5">
    <div>
      <Slider.Root aria-label="Value selector" defaultValue={5} max={12} />
      <!-- biome-ignore lint/a11y/useSemanticElements: Matches the exact COSS reference DOM. -->
      <div
        aria-label="Value scale from 0 to 12"
        class="mt-3 flex w-full items-center justify-between gap-1 px-2.5 font-medium text-muted-foreground text-xs"
        role="group"
      >
        {#each ticks as tick (tick)}
          <span class="flex w-0 flex-col items-center justify-center gap-2">
            <span
              class={tick % 2 === 0
                ? "h-1 w-px bg-muted-foreground/72"
                : "h-0.5 w-px bg-muted-foreground/72"}
            ></span>
            <span class:opacity-0={tick % 2 !== 0}>{tick}</span>
          </span>
        {/each}
      </div>
    </div>
  </section>

  <section class="w-full max-w-64" data-particle="p-slider-6">
    <div>
      <div
        aria-hidden="true"
        class="mb-3 flex w-full items-center justify-between gap-2 font-medium text-muted-foreground text-xs"
      >
        <span>Low</span>
        <span>High</span>
      </div>
      <Slider.Root aria-label="Intensity level from low to high" defaultValue={50} step={10} />
    </div>
  </section>

  <section class="w-full max-w-64" data-particle="p-slider-7">
    <Slider.Root defaultValue={[25, 75]} />
  </section>

  <section class="w-full max-w-64" data-particle="p-slider-8">
    <Slider.Root defaultValue={[20, 50, 80]} />
  </section>

  <section class="w-full max-w-64" data-particle="p-slider-9">
    <Slider.Root
      aria-label="Dual thumb slider with collision behavior none"
      defaultValue={[25, 75]}
      thumbCollisionBehavior="none"
    />
  </section>

  <section class="w-full max-w-64" data-particle="p-slider-10">
    <Slider.Root
      aria-label="Dual thumb slider with collision behavior swap"
      defaultValue={[25, 75]}
      thumbCollisionBehavior="swap"
    />
  </section>

  <section class="w-full max-w-64" data-particle="p-slider-11">
    <Field.Root class="*:grid *:grid-cols-[auto_1fr_auto] *:items-center *:gap-x-2">
      <Slider.Root
        aria-label="Volume slider"
        onValueChange={(value) => (volume = value)}
        value={volume}
      >
        <div class="col-span-3 mb-2 flex items-center justify-between gap-1">
          <Field.Label>Volume</Field.Label>
          <Slider.Value />
        </div>
        <svg
          aria-hidden="true"
          class="lucide lucide-volume-x size-4 shrink-0 opacity-80"
          fill="none"
          height="24"
          stroke-linecap="round"
          stroke-linejoin="round"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11 5 6 9H2v6h4l5 4V5z"></path>
          <path d="m22 9-6 6"></path>
          <path d="m16 9 6 6"></path>
        </svg>
        <svg
          aria-hidden="true"
          class="lucide lucide-volume-2 order-1 size-4 shrink-0 opacity-80"
          fill="none"
          height="24"
          stroke-linecap="round"
          stroke-linejoin="round"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11 5 6 9H2v6h4l5 4V5z"></path>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
      </Slider.Root>
    </Field.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-slider-14">
    <Field.Root name="credits">
      <Field.Label class="tabular-nums">{credits} credits/mo</Field.Label>
      <div class="flex items-center gap-2">
        <Button
          aria-label="Decrease value"
          disabled={credits === 0}
          onclick={() => (credits = Math.max(0, credits - 5))}
          size="icon"
          variant="outline"
        >
          <svg
            aria-hidden="true"
            class="lucide lucide-minus"
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 12h14"></path>
          </svg>
        </Button>
        <Slider.Root
          aria-label="Credits slider"
          class="flex-1"
          max={200}
          min={0}
          onValueChange={(value) => (credits = scalar(value))}
          step={5}
          value={credits}
        />
        <Button
          aria-label="Increase value"
          disabled={credits === 200}
          onclick={() => (credits = Math.min(200, credits + 5))}
          size="icon"
          variant="outline"
        >
          <svg
            aria-hidden="true"
            class="lucide lucide-plus"
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
        </Button>
      </div>
    </Field.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-slider-15">
    <Fieldset.Root class="flex w-full flex-col gap-3">
      <Fieldset.Legend class="tabular-nums">
        From {formatPrice(prices[0] ?? 5)} to {formatPrice(prices[1] ?? 1240)}
      </Fieldset.Legend>
      <Slider.Root
        aria-label="Price range"
        class="flex-1"
        max={1240}
        min={5}
        name="price-range"
        onValueChange={(value) => (prices = Array.isArray(value) ? [...value] : [value])}
        value={prices}
      />
    </Fieldset.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-slider-16">
    <Field.Root class="*:grid *:grid-cols-[auto_1fr_auto] *:items-center *:gap-x-2">
      <Slider.Root
        aria-label="Rate your experience"
        max={5}
        min={1}
        onValueChange={(value) => (rating = value)}
        value={rating}
      >
        <div class="col-span-3 mb-2 flex items-center justify-between gap-1">
          <Field.Label>Rate your experience</Field.Label>
          <span class="text-sm">{ratingLabels[currentRating - 1]}</span>
        </div>
        <span aria-hidden="true" class="text-2xl">😡</span>
        <span aria-hidden="true" class="order-1 text-2xl">😍</span>
      </Slider.Root>
    </Field.Root>
  </section>

  <section class="vertical-particle" data-particle="p-slider-17">
    <Slider.Root defaultValue={50} orientation="vertical" />
  </section>

  <section data-particle="p-slider-18">
    <div class="flex h-40 items-center justify-center">
      <Slider.Root defaultValue={[25, 75]} orientation="vertical" />
    </div>
  </section>

  <section data-particle="p-slider-20">
    <div class="flex h-48 justify-center gap-8">
      {#each bands as band (band.label)}
        <Slider.Root
          aria-label={band.label}
          defaultValue={band.value}
          max={5}
          min={-5}
          orientation="vertical"
        />
      {/each}
    </div>
  </section>

  <section class="w-full max-w-64" data-particle="p-slider-23">
    <Form class="flex w-full flex-col gap-4" onsubmit={handleSubmit}>
      <Fieldset.Root class="flex w-full flex-col items-stretch gap-3">
        <Field.Root>
          <Slider.Root
            name="volume"
            onValueChange={(value) => (formValue = value)}
            value={formValue}
          >
            <div class="mb-2 flex items-center justify-between gap-1">
              <Fieldset.Legend>Volume</Fieldset.Legend>
              <Slider.Value />
            </div>
          </Slider.Root>
          <Field.Description>Choose a value between 0 and 100</Field.Description>
        </Field.Root>
      </Fieldset.Root>
      <Button loading={formLoading} type="submit">Submit</Button>
    </Form>
  </section>
</div>

<style>
.slider-fixture {
  display: grid;
  box-sizing: border-box;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
  gap: 3rem;
  padding: 2rem;
}

.slider-fixture > section {
  width: 100%;
  min-width: 0;
}

.vertical-particle {
  display: flex;
  height: 11rem;
  align-items: center;
  justify-content: center;
}
</style>
