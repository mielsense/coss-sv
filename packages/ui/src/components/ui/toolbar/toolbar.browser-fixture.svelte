<script lang="ts">
import * as Toolbar from "./index.js";
</script>

<Toolbar.Root aria-label="Horizontal toolbar">
  <Toolbar.Button data-testid="one">One</Toolbar.Button>
  <Toolbar.Button data-testid="disabled" disabled>Disabled</Toolbar.Button>
  <Toolbar.Group>
    <Toolbar.Button data-testid="two">Two</Toolbar.Button>
    <Toolbar.Input data-testid="input" value="abcd" />
  </Toolbar.Group>
  <Toolbar.Button data-testid="three">Three</Toolbar.Button>
</Toolbar.Root>

<Toolbar.Root aria-label="Vertical toolbar" orientation="vertical">
  <Toolbar.Button data-testid="v-one">Vertical one</Toolbar.Button>
  <Toolbar.Button data-testid="v-two">Vertical two</Toolbar.Button>
</Toolbar.Root>

<Toolbar.Root aria-label="RTL toolbar" dir="rtl">
  <Toolbar.Button data-testid="rtl-one">RTL one</Toolbar.Button>
  <Toolbar.Button data-testid="rtl-two">RTL two</Toolbar.Button>
</Toolbar.Root>
