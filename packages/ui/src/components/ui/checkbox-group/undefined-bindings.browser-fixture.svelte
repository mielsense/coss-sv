<script lang="ts">
  import { Checkbox } from "../checkbox/index.js";
  import { Switch } from "../switch/index.js";
  import { Toggle } from "../toggle/index.js";
  import * as RadioGroup from "../radio-group/index.js";
  import * as ToggleGroup from "../toggle-group/index.js";
  import * as Tabs from "../tabs/index.js";
  import * as Combobox from "../combobox/index.js";
  import * as CheckboxGroup from "./index.js";
  import { Combobox as ShardsCombobox } from "@shardsui/svelte/combobox";
  let shardsValue = $state<string>();
  let checked = $state<boolean>();
  let switched = $state<boolean>();
  let pressed = $state<boolean>();
  let radio = $state<string>();
  let toggles = $state<string[]>();
  let tab = $state<string | null>();
  let combo = $state<string | null>();
  let comboInput = $state<string>();
  let comboOpen = $state<boolean>();
  let group = $state<string[]>();
</script>

<button onclick={() => (checked = true)}>Set checkbox</button>
<Checkbox bind:checked aria-label="Late checkbox" />
<button onclick={() => (switched = true)}>Set switch</button>
<Switch bind:checked={switched} aria-label="Late switch" />
<button onclick={() => (pressed = true)}>Set toggle</button>
<Toggle bind:pressed aria-label="Late toggle" />
<button onclick={() => (radio = "second")}>Set radio</button>
<RadioGroup.Root bind:value={radio}>
  <RadioGroup.Item value="first" aria-label="First radio" />
  <RadioGroup.Item value="second" aria-label="Second radio" />
</RadioGroup.Root>
<button onclick={() => (toggles = ["second"])}>Set toggle group</button>
<ToggleGroup.Root bind:value={toggles}>
  <ToggleGroup.Item value="first">First toggle</ToggleGroup.Item>
  <ToggleGroup.Item value="second">Second toggle</ToggleGroup.Item>
</ToggleGroup.Root>
<button onclick={() => (tab = "second")}>Set tab</button>
<Tabs.Root bind:value={tab}>
  <Tabs.List
    ><Tabs.Tab value="first">First tab</Tabs.Tab><Tabs.Tab value="second">Second tab</Tabs.Tab
    ></Tabs.List
  >
  <Tabs.Panel value="first">First panel</Tabs.Panel><Tabs.Panel value="second"
    >Second panel</Tabs.Panel
  >
</Tabs.Root>
<button onclick={() => (combo = "Second")}>Set combobox value</button>
<Combobox.Root bind:value={combo} items={["First", "Second"]}>
  <Combobox.Input aria-label="Late combobox value" />
  <output data-testid="combobox-selection"><Combobox.Value /></output>
</Combobox.Root>
<button onclick={() => (comboInput = "Second")}>Set combobox input</button>
<Combobox.Root bind:inputValue={comboInput} items={["First", "Second"]}>
  <Combobox.Input aria-label="Late combobox input" />
</Combobox.Root>
<button onclick={() => (comboOpen = true)}>Set combobox open</button>
<Combobox.Root bind:open={comboOpen} items={["First", "Second"]}>
  <Combobox.Input aria-label="Late combobox open" />
  <Combobox.Popup
    ><Combobox.List><Combobox.Item value="First">First</Combobox.Item></Combobox.List
    ></Combobox.Popup
  >
</Combobox.Root>
<button onclick={() => (group = ["second"])}>Set checkbox group</button>
<CheckboxGroup.Root bind:value={group}>
  <CheckboxGroup.Item value="first" aria-label="First group checkbox" />
  <CheckboxGroup.Item value="second" aria-label="Second group checkbox" />
</CheckboxGroup.Root>

<button onclick={() => (shardsValue = "Second")}>Set primitive value</button>
<ShardsCombobox.Root bind:value={shardsValue} items={["First", "Second"]}
  ><ShardsCombobox.Input aria-label="Primitive selection input" /></ShardsCombobox.Root
>
