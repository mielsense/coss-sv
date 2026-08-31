<script lang="ts">
  import {
    Button,
    Field,
    Fieldset,
    Form,
    Group,
    InputGroup,
    Label,
    NumberField,
    Select,
    Slider,
  } from "@coss-sv/ui";
  import FixtureIcon from "./fixture-icon.svelte";

  let controlled = $state<number | null>(25);
  let loading = $state(false);
  let sliderValue = $state(25);
  let rangeValues = $state([0, 20]);
  let verticalValue = $state(25);
  let objectValues = $state({ x: -2, y: 4, z: 2 });
  let priceValues = $state([200, 780]);
  const currencies = [
    { label: "US Dollar", value: "$" },
    { label: "Euro", value: "€" },
    { label: "British Pound", value: "£" },
  ];
  let currency = $state.raw(currencies[0]);
  const prices = [
    80, 95, 110, 125, 130, 140, 145, 150, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255,
    260, 265, 270, 275, 280, 285, 290, 290, 295, 295, 295, 298, 299, 300, 305, 310, 315, 320, 325,
    330, 335, 340, 345, 350, 355, 360, 365, 365, 375, 380, 385, 390, 395, 400, 405, 410, 415, 420,
    425, 430, 435, 440, 445, 450, 455, 460, 465, 470, 475, 480, 485, 490, 495, 495, 498, 499, 500,
    500, 500, 515, 530, 545, 560, 575, 590, 605, 620, 635, 650, 655, 660, 665, 670, 675, 680, 685,
    690, 695, 700, 700, 700, 700, 700, 700, 725, 750, 775, 800, 815, 830, 845, 845, 845, 870, 875,
    880, 885, 890, 895, 898, 900,
  ];
  const priceMin = Math.min(...prices);
  const priceMax = Math.max(...prices);
  const priceStep = (priceMax - priceMin) / 40;
  const itemCounts = Array.from({ length: 40 }, (_, tick) => {
    const rangeMin = priceMin + tick * priceStep;
    const rangeMax = priceMin + (tick + 1) * priceStep;
    return prices.filter((price) => price >= rangeMin && price < rangeMax).length;
  });
  const maxCount = Math.max(...itemCounts);
  const priceCount = $derived(
    prices.filter(
      (price) => price >= (priceValues[0] ?? priceMin) && price <= (priceValues[1] ?? priceMax),
    ).length,
  );
</script>

{#snippet numberGroup(props: NumberField.NumberFieldGroupProps)}
  <NumberField.Group {...props} />
{/snippet}

<div class="fixture">
  <section data-particle="p-number-field-1">
    <NumberField.Root defaultValue={0}>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  </section>

  <section data-particle="p-number-field-2">
    <NumberField.Root defaultValue={0} size="sm">
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  </section>

  <section data-particle="p-number-field-3">
    <NumberField.Root defaultValue={0} size="lg">
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  </section>

  <section data-particle="p-number-field-4">
    <NumberField.Root defaultValue={42} disabled>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  </section>

  <section data-particle="p-number-field-5">
    <div class="flex flex-col items-start gap-2">
      <Label for="parity-quantity">Quantity</Label>
      <NumberField.Root defaultValue={0} id="parity-quantity">
        <NumberField.Group>
          <NumberField.Decrement />
          <NumberField.Input />
          <NumberField.Increment />
        </NumberField.Group>
      </NumberField.Root>
    </div>
  </section>

  <section data-particle="p-number-field-6">
    <NumberField.Root defaultValue={0}>
      <NumberField.ScrubArea label="Quantity" />
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  </section>

  <section data-particle="p-number-field-7">
    <NumberField.Root defaultValue={5} max={10} min={0}>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  </section>

  <section data-particle="p-number-field-8">
    <NumberField.Root defaultValue={0} format={{ currency: "USD", style: "currency" }}>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  </section>

  <section data-particle="p-number-field-9">
    <div class="flex flex-col gap-6">
      <NumberField.Root defaultValue={0} step={10}>
        <NumberField.ScrubArea label="Step 10" />
        <NumberField.Group>
          <NumberField.Decrement /><NumberField.Input /><NumberField.Increment />
        </NumberField.Group>
      </NumberField.Root>
      <NumberField.Root defaultValue={0} step={0.1}>
        <NumberField.ScrubArea label="Step 0.1" />
        <NumberField.Group>
          <NumberField.Decrement /><NumberField.Input /><NumberField.Increment />
        </NumberField.Group>
      </NumberField.Root>
    </div>
  </section>

  <section data-particle="p-number-field-10">
    <Form
      class="flex w-full max-w-64 flex-col gap-4"
      onsubmit={async (event) => {
        event.preventDefault();
        loading = true;
        const quantity = Number(new FormData(event.currentTarget).get("quantity"));
        await new Promise((resolve) => setTimeout(resolve, 800));
        loading = false;
        if (quantity >= 1 && quantity <= 100) alert(`Quantity: ${quantity}`);
      }}
    >
      <Field.Root name="quantity">
        <NumberField.Root defaultValue={1} max={100} min={1} name="quantity">
          <NumberField.ScrubArea label="Quantity" />
          <NumberField.Group>
            <NumberField.Decrement /><NumberField.Input /><NumberField.Increment />
          </NumberField.Group>
        </NumberField.Root>
      </Field.Root>
      <Button {loading} type="submit">Submit</Button>
    </Form>
  </section>

  <section data-particle="p-number-field-11">
    <NumberField.Root defaultValue={0}>
      <NumberField.Group class="[--radius-lg:9999px] [--radius:9999px]">
        <NumberField.Decrement /><NumberField.Input /><NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  </section>

  <section data-particle="p-field-17">
    <Field.Root>
      <NumberField.Root defaultValue={1} max={100} min={1}>
        <NumberField.ScrubArea label="Quantity" />
        <NumberField.Group>
          <NumberField.Decrement /><NumberField.Input /><NumberField.Increment />
        </NumberField.Group>
      </NumberField.Root>
      <Field.Description>Choose a value between 1 and 100.</Field.Description>
    </Field.Root>
  </section>

  <section data-particle="p-group-14">
    <Group.Root aria-label="Payment amount">
      <Group.Root aria-label="Amount input">
        <Select.Root
          bind:value={currency}
          isItemEqualToValue={(item, value) => item.value === value.value}
          items={currencies.map((item) => ({ label: item.label, value: item }))}
          itemToStringLabel={(item) => item.label}
          itemToStringValue={(item) => item.value}
        >
          <Select.Trigger class="w-fit min-w-none">
            <Select.Value>
              {#snippet children(value: (typeof currencies)[number] | null)}
                {value?.value}
              {/snippet}
            </Select.Value>
          </Select.Trigger>
          <Select.Popup class="min-w-48">
            {#each currencies as item (item.value)}
              <Select.Item value={item}
                >{item.value} <span class="ms-1">{item.label}</span></Select.Item
              >
            {/each}
          </Select.Popup>
        </Select.Root>
        <Group.Separator />
        <NumberField.Root
          aria-label="Enter the amount"
          class="gap-0"
          defaultValue={10}
          delegate={numberGroup}
        >
          <NumberField.Input class="text-left" />
        </NumberField.Root>
      </Group.Root>
      <Group.Root aria-label="Submit">
        <Button aria-label="Send" size="icon" variant="outline">
          <FixtureIcon aria-hidden="true" name="arrow-right" />
        </Button>
      </Group.Root>
    </Group.Root>
  </section>

  <section data-particle="p-group-22">
    <div class="flex flex-col gap-2">
      <Label>Range</Label>
      <Group.Root aria-label="Range input">
        <NumberField.Root aria-label="Min value" delegate={numberGroup}>
          <NumberField.Input class="text-left" placeholder="From" />
        </NumberField.Root>
        <Group.Separator />
        <NumberField.Root aria-label="Max value" delegate={numberGroup}>
          <NumberField.Input class="text-left" placeholder="To" />
        </NumberField.Root>
      </Group.Root>
    </div>
  </section>

  <section data-particle="p-input-group-6">
    <InputGroup.Root>
      <NumberField.Root aria-label="Enter the amount" defaultValue={10}>
        <NumberField.Input class="text-left" />
      </NumberField.Root>
      <InputGroup.Addon><InputGroup.Text>€</InputGroup.Text></InputGroup.Addon>
      <InputGroup.Addon align="inline-end"><InputGroup.Text>EUR</InputGroup.Text></InputGroup.Addon>
    </InputGroup.Root>
  </section>

  <section data-particle="p-slider-12">
    <div class="flex items-center gap-4">
      <Slider.Root
        aria-label="Slider with input"
        class="flex-1"
        max={150}
        min={0}
        onValueChange={(value) => (sliderValue = Array.isArray(value) ? (value[0] ?? 0) : value)}
        value={sliderValue}
      />
      <NumberField.Root
        aria-label="Enter slider value"
        class="w-12"
        delegate={numberGroup}
        max={150}
        min={0}
        onValueChange={(value: number | null) => (sliderValue = value ?? 0)}
        size="sm"
        value={sliderValue}><NumberField.Input /></NumberField.Root
      >
    </div>
  </section>

  <section data-particle="p-slider-13">
    <div class="flex items-center gap-2">
      <NumberField.Root
        aria-label="Minimum value"
        class="w-10"
        delegate={numberGroup}
        max={rangeValues[1] as number}
        min={0}
        onValueChange={(value: number | null) =>
          (rangeValues = [Math.min(value ?? 0, rangeValues[1] ?? 50), rangeValues[1] ?? 50])}
        size="sm"
        value={rangeValues[0] as number}><NumberField.Input /></NumberField.Root
      >
      <Slider.Root
        aria-label="Dual range slider"
        class="flex-1 *:min-w-0!"
        max={50}
        min={0}
        onValueChange={(value) => (rangeValues = Array.isArray(value) ? [...value] : [value])}
        value={rangeValues}
      />
      <NumberField.Root
        aria-label="Maximum value"
        class="w-10"
        delegate={numberGroup}
        max={50}
        min={rangeValues[0] as number}
        onValueChange={(value: number | null) =>
          (rangeValues = [rangeValues[0] ?? 0, Math.max(value ?? 0, rangeValues[0] ?? 0)])}
        size="sm"
        value={rangeValues[1] as number}><NumberField.Input /></NumberField.Root
      >
    </div>
  </section>

  <section data-particle="p-slider-19">
    <div class="flex flex-col items-center justify-center gap-4">
      <Slider.Root
        aria-label="Vertical slider with input"
        max={100}
        min={0}
        onValueChange={(value) => (verticalValue = Array.isArray(value) ? (value[0] ?? 0) : value)}
        orientation="vertical"
        value={verticalValue}
      />
      <NumberField.Root
        aria-label="Enter slider value"
        class="w-16"
        delegate={numberGroup}
        max={100}
        min={0}
        onValueChange={(value: number | null) => (verticalValue = value ?? 0)}
        size="sm"
        value={verticalValue}><NumberField.Input /></NumberField.Root
      >
    </div>
  </section>

  <section data-particle="p-slider-21">
    <Fieldset.Root class="flex w-full flex-col gap-4">
      <Fieldset.Legend>Object position</Fieldset.Legend>
      <div class="flex flex-col gap-2">
        {#each ["x", "y", "z"] as axis (axis)}
          <div class="flex items-center gap-2">
            <Label class="w-3 text-muted-foreground text-xs">{axis.toUpperCase()}</Label>
            <Slider.Root
              aria-label={`${axis.toUpperCase()} position`}
              class="flex-1"
              max={10}
              min={-10}
              onValueChange={(value) =>
                (objectValues = {
                  ...objectValues,
                  [axis]: Array.isArray(value) ? (value[0] ?? 0) : value,
                })}
              value={objectValues[axis as keyof typeof objectValues]}
            />
            <NumberField.Root
              aria-label={`Enter ${axis.toUpperCase()} value`}
              class="w-16"
              delegate={numberGroup}
              max={10}
              min={-10}
              onValueChange={(value: number | null) =>
                (objectValues = { ...objectValues, [axis]: value ?? 0 })}
              size="sm"
              value={objectValues[axis as keyof typeof objectValues]}
              ><NumberField.Input /></NumberField.Root
            >
          </div>
        {/each}
      </div>
      <Button
        class="w-full"
        onclick={() => (objectValues = { x: 0, y: 0, z: 0 })}
        variant="outline"
      >
        <FixtureIcon aria-hidden="true" class="-ms-1 opacity-60" name="rotate-ccw" />
        Reset
      </Button>
    </Fieldset.Root>
  </section>

  <section data-particle="p-slider-22">
    <div class="flex flex-col gap-4">
      <div>
        <div aria-hidden="true" class="flex h-12 w-full items-end px-3">
          {#each itemCounts as count, index (index)}
            <div class="flex flex-1 justify-center" style:height={`${(count / maxCount) * 100}%`}>
              <span
                class="mx-px size-full bg-primary/20 data-[selected=true]:bg-primary/50"
                data-selected={priceCount > 0 &&
                  priceMin + index * priceStep <= (priceValues[1] ?? priceMax) &&
                  priceMin + (index + 1) * priceStep >= (priceValues[0] ?? priceMin)}
              ></span>
            </div>
          {/each}
        </div>
        <Slider.Root
          aria-label="Price range"
          class="*:min-w-0!"
          max={priceMax}
          min={priceMin}
          onValueChange={(value) => (priceValues = Array.isArray(value) ? [...value] : [value])}
          value={priceValues}
        />
      </div>
      <div class="flex items-center justify-between gap-4">
        <InputGroup.Root>
          <NumberField.Root
            aria-label="Minimum price"
            max={priceValues[1] as number}
            min={priceMin}
            onValueChange={(value: number | null) =>
              (priceValues = [
                Math.min(value ?? priceMin, priceValues[1] ?? priceMax),
                priceValues[1] ?? priceMax,
              ])}
            value={priceValues[0] as number}
            ><NumberField.Input class="text-left" /></NumberField.Root
          >
          <InputGroup.Addon><InputGroup.Text>$</InputGroup.Text></InputGroup.Addon>
        </InputGroup.Root>
        <InputGroup.Root>
          <NumberField.Root
            aria-label="Maximum price"
            max={priceMax}
            min={priceValues[0] as number}
            onValueChange={(value: number | null) =>
              (priceValues = [
                priceValues[0] ?? priceMin,
                Math.max(value ?? priceMin, priceValues[0] ?? priceMin),
              ])}
            value={priceValues[1] as number}
            ><NumberField.Input class="text-left" /></NumberField.Root
          >
          <InputGroup.Addon><InputGroup.Text>$</InputGroup.Text></InputGroup.Addon>
        </InputGroup.Root>
      </div>
      <Button class="w-full" variant="outline">Show {priceCount} items</Button>
    </div>
  </section>

  <section data-review-probes="number-field">
    <NumberField.Root bind:value={controlled} aria-label="Controlled quantity" max={150} min={0}>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input data-testid="controlled-number" />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
    <output data-testid="controlled-number-state">{controlled}</output>
  </section>
</div>

<style>
  .fixture {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: center;
    gap: 3rem 2rem;
    padding: 2rem;
  }
  .fixture section {
    display: flex;
    width: min(16rem, 100%);
    min-width: 0;
    align-items: center;
    justify-content: center;
  }
  [data-review-probes="number-field"] {
    flex-direction: column;
    gap: 0.5rem;
  }
  @media (max-width: 639px) {
    .fixture {
      grid-template-columns: minmax(0, 1fr);
      gap: 2rem;
      padding: 1.5rem;
    }
  }
</style>
