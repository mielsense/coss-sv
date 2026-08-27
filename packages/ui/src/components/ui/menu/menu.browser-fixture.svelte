<script lang="ts">
import * as Menu from "./index.js";

let open = $state(false);
let checked = $state(false);
let value = $state("system");
let changes = $state<string[]>([]);
let vetoedOpen = $state(false);
</script>

<button data-testid="before" type="button">Before</button>
<Menu.Root bind:open onOpenChange={(next) => changes.push(`open:${next}`)}>
  <Menu.Trigger data-testid="trigger">Open actions</Menu.Trigger>
  <Menu.Popup>
    <Menu.Item data-testid="alpha">Alpha</Menu.Item>
    <Menu.Item data-testid="disabled" disabled>Disabled</Menu.Item>
    <Menu.CheckboxItem bind:checked data-testid="checkbox">Show details</Menu.CheckboxItem>
    <Menu.RadioGroup bind:value>
      <Menu.RadioItem data-testid="light" value="light">Light</Menu.RadioItem>
      <Menu.RadioItem data-testid="system" value="system">System</Menu.RadioItem>
    </Menu.RadioGroup>
    <Menu.Sub>
      <Menu.SubTrigger data-testid="sub-trigger" openOnHover={false}>More</Menu.SubTrigger>
      <Menu.SubPopup><Menu.Item data-testid="nested">Nested</Menu.Item></Menu.SubPopup>
    </Menu.Sub>
  </Menu.Popup>
</Menu.Root>
<button data-testid="after" type="button">After</button>
<output data-testid="open">{open ? "open" : "closed"}</output>
<output data-testid="checked">{checked ? "checked" : "unchecked"}</output>
<output data-testid="value">{value}</output>
<output data-testid="changes">{changes.join(",")}</output>

<Menu.Root bind:open={() => vetoedOpen, () => {}}>
  <Menu.Trigger data-testid="veto-trigger">Vetoed menu</Menu.Trigger>
  <Menu.Popup><Menu.Item data-testid="veto-item">Should stay closed</Menu.Item></Menu.Popup>
</Menu.Root>
<output data-testid="veto-open">{vetoedOpen ? "open" : "closed"}</output>
