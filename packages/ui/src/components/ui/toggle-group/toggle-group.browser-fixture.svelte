<script lang="ts">
  import * as ToggleGroup from "./index.js";

  let multipleValue = $state<readonly string[]>(["bold"]);
  let singleChanges = $state<string[][]>([]);
  let groupRef = $state<HTMLElement | null>(null);
  let fixedValue = $state<readonly string[]>(["bold"]);
  let declinedWrites = $state(0);
</script>

<ToggleGroup.Root
  aria-label="Single formatting"
  bind:ref={groupRef}
  data-testid="single-group"
  defaultValue={["bold"]}
  onValueChange={(value) => singleChanges.push(value)}
>
  <ToggleGroup.Item aria-label="Single bold" value="bold">Bold</ToggleGroup.Item>
  <ToggleGroup.Item aria-label="Single italic" value="italic">Italic</ToggleGroup.Item>
  <ToggleGroup.Item aria-label="Single underline" value="underline">Underline</ToggleGroup.Item>
</ToggleGroup.Root>

<ToggleGroup.Root
  aria-label="Multiple formatting"
  bind:value={multipleValue}
  data-testid="multiple-group"
  multiple
>
  <ToggleGroup.Item aria-label="Multiple bold" value="bold">Bold</ToggleGroup.Item>
  <ToggleGroup.Item aria-label="Multiple italic" value="italic">Italic</ToggleGroup.Item>
  <ToggleGroup.Item aria-label="Multiple underline" value="underline">Underline</ToggleGroup.Item>
</ToggleGroup.Root>

<ToggleGroup.Root
  aria-label="Vertical formatting"
  data-testid="vertical-group"
  defaultValue={["bold"]}
  orientation="vertical"
  variant="outline"
>
  <ToggleGroup.Item aria-label="Vertical bold" value="bold">Bold</ToggleGroup.Item>
  <ToggleGroup.Separator orientation="horizontal" />
  <ToggleGroup.Item aria-label="Vertical italic" disabled value="italic">Italic</ToggleGroup.Item>
  <ToggleGroup.Separator orientation="horizontal" />
  <ToggleGroup.Item aria-label="Vertical underline" value="underline">Underline</ToggleGroup.Item>
</ToggleGroup.Root>

<ToggleGroup.Root
  aria-label="Declined formatting"
  bind:value={() => fixedValue, () => (declinedWrites += 1)}
  data-testid="declined-group"
>
  <ToggleGroup.Item aria-label="Declined bold" value="bold">Bold</ToggleGroup.Item>
  <ToggleGroup.Item aria-label="Declined italic" value="italic">Italic</ToggleGroup.Item>
</ToggleGroup.Root>

<output data-testid="single-changes"
  >{singleChanges.map((value) => value.join("+")).join(",")}</output
>
<output data-testid="multiple-value">{multipleValue.join(",")}</output>
<output data-testid="group-ref">{groupRef?.tagName ?? "missing"}</output>
<output data-testid="declined-writes">{declinedWrites}</output>
