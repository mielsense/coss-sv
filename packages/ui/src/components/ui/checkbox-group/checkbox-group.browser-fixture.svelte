<script lang="ts">
import { Label } from "../label/index.js";
import * as CheckboxGroup from "./index.js";

let basicValue = $state<string[]>(["next"]);
let basicChanges = $state<string[][]>([]);
let basicRef = $state<HTMLElement | null>(null);
let parentValue = $state<string[]>(["view"]);
let outerValue = $state<string[]>([]);
let innerValue = $state<string[]>([]);
let submitted = $state<string[]>([]);
let fixedValue = $state<string[]>(["next"]);
let declinedWrites = $state(0);
let disabledSelectValue = $state<string[]>(["view"]);
let disabledClearValue = $state<string[]>(["view", "edit", "delete"]);
let canceledValue = $state<string[]>(["next"]);
let canceledWrites = $state(0);
let canceledDetails = $state<string[]>([]);
let rejectedParentValue = $state<string[]>(["view"]);
let rejectedParentAttempts = $state<string[][]>([]);

type ChangeDetailsProbe = {
  allowPropagation: () => void;
  cancel: () => void;
  readonly event: Event;
  readonly isCanceled: boolean;
  readonly isPropagationAllowed: boolean;
  readonly reason: string;
  readonly trigger: Element | undefined;
};

const outerValues = ["view", "manage"];
const innerValues = ["create", "edit"];

function updateOuter(value: string[]) {
  outerValue = value;
  if (value.includes("manage")) {
    innerValue = [...innerValues];
  } else if (innerValue.length === innerValues.length) {
    innerValue = [];
  }
}

function updateInner(value: string[]) {
  innerValue = value;
  if (value.length === innerValues.length) {
    outerValue = Array.from(new Set([...outerValue, "manage"]));
  } else {
    outerValue = outerValue.filter((item) => item !== "manage");
  }
}

function submitForm(event: SubmitEvent) {
  event.preventDefault();
  submitted = new FormData(event.currentTarget as HTMLFormElement).getAll("frameworks").map(String);
}

function cancelChange(value: string[], details?: ChangeDetailsProbe) {
  if (!details) {
    canceledDetails.push("missing");
    return;
  }

  details.allowPropagation();
  details.cancel();
  canceledDetails.push(
    [
      value.join("+"),
      details.reason,
      details.event.type,
      details.trigger?.getAttribute("role") ?? "missing",
      String(details.isCanceled),
      String(details.isPropagationAllowed),
    ].join(":"),
  );
}

function rejectParentValue(next: string[]) {
  rejectedParentAttempts = [...rejectedParentAttempts, [...next]];
}
</script>

<CheckboxGroup.Root
  aria-label="Basic frameworks"
  bind:ref={basicRef}
  bind:value={basicValue}
  onValueChange={(value) => basicChanges.push([...value])}
>
  <Label><CheckboxGroup.Item value="next" />Next.js</Label>
  <Label><CheckboxGroup.Item value="vite" />Vite</Label>
  <Label><CheckboxGroup.Item disabled value="astro" />Astro</Label>
</CheckboxGroup.Root>

<CheckboxGroup.Root
  allValues={["view", "edit"]}
  aria-label="Rejected parent permissions"
  bind:value={() => rejectedParentValue, rejectParentValue}
>
  <Label><CheckboxGroup.Item parent />Rejected parent</Label>
  <Label><CheckboxGroup.Item name="rejected-parent" value="view" />Rejected parent view</Label>
  <Label><CheckboxGroup.Item name="rejected-parent" value="edit" />Rejected parent edit</Label>
</CheckboxGroup.Root>

<form id="parent-owner"></form>
<CheckboxGroup.Root allValues={["one"]} aria-label="External parent owner">
  <Label>
    <CheckboxGroup.Item form="parent-owner" name="parent-must-not-submit" parent required />External
    parent
  </Label>
  <Label><CheckboxGroup.Item form="parent-owner" name="leaf" value="one" />External leaf</Label>
</CheckboxGroup.Root>

<CheckboxGroup.Root
  allValues={["view", "edit", "delete"]}
  aria-label="Disabled select permissions"
  bind:value={disabledSelectValue}
>
  <Label><CheckboxGroup.Item parent />Select enabled permissions</Label>
  <Label><CheckboxGroup.Item value="view" />Selectable view</Label>
  <Label><CheckboxGroup.Item disabled value="edit" />Disabled unchecked edit</Label>
  <Label><CheckboxGroup.Item value="delete" />Selectable delete</Label>
</CheckboxGroup.Root>

<CheckboxGroup.Root
  allValues={["view", "edit", "delete"]}
  aria-label="Disabled clear permissions"
  bind:value={disabledClearValue}
>
  <Label><CheckboxGroup.Item parent />Clear enabled permissions</Label>
  <Label><CheckboxGroup.Item value="view" />Clearable view</Label>
  <Label><CheckboxGroup.Item disabled value="edit" />Disabled checked edit</Label>
  <Label><CheckboxGroup.Item value="delete" />Clearable delete</Label>
</CheckboxGroup.Root>

<CheckboxGroup.Root
  allValues={["next", "vite"]}
  aria-label="Canceled permissions"
  bind:value={() => canceledValue, () => (canceledWrites += 1)}
  onValueChange={cancelChange}
>
  <Label><CheckboxGroup.Item parent />Canceled parent</Label>
  <Label><CheckboxGroup.Item name="canceled" value="next" />Canceled Next.js</Label>
  <Label><CheckboxGroup.Item name="canceled" value="vite" />Canceled Vite</Label>
</CheckboxGroup.Root>

<CheckboxGroup.Root
  allValues={["view", "edit", "delete"]}
  aria-labelledby="permissions-label"
  bind:value={parentValue}
>
  <Label id="permissions-label"> <CheckboxGroup.Item parent />Permissions </Label>
  <Label><CheckboxGroup.Item value="view" />View</Label>
  <Label><CheckboxGroup.Item value="edit" />Edit</Label>
  <Label><CheckboxGroup.Item value="delete" />Delete</Label>
</CheckboxGroup.Root>

<CheckboxGroup.Root
  allValues={outerValues}
  aria-labelledby="outer-label"
  onValueChange={updateOuter}
  value={outerValue}
>
  <Label id="outer-label"><CheckboxGroup.Item parent />User permissions</Label>
  <Label><CheckboxGroup.Item value="view" />View dashboard</Label>
  <CheckboxGroup.Root
    allValues={innerValues}
    aria-labelledby="inner-label"
    onValueChange={updateInner}
    value={innerValue}
  >
    <Label id="inner-label"><CheckboxGroup.Item parent />Manage users</Label>
    <Label><CheckboxGroup.Item value="create" />Create user</Label>
    <Label><CheckboxGroup.Item value="edit" />Edit user</Label>
  </CheckboxGroup.Root>
</CheckboxGroup.Root>

<CheckboxGroup.Root aria-label="Disabled group" disabled>
  <Label><CheckboxGroup.Item value="one" />Disabled one</Label>
  <Label><CheckboxGroup.Item value="two" />Disabled two</Label>
</CheckboxGroup.Root>

<CheckboxGroup.Root
  aria-label="Declined group"
  bind:value={() => fixedValue, () => (declinedWrites += 1)}
>
  <Label><CheckboxGroup.Item value="next" />Declined Next.js</Label>
  <Label><CheckboxGroup.Item value="vite" />Declined Vite</Label>
</CheckboxGroup.Root>

<form onsubmit={submitForm}>
  <CheckboxGroup.Root aria-label="Form frameworks" defaultValue={["next"]}>
    <Label><CheckboxGroup.Item name="frameworks" value="next" />Form Next.js</Label>
    <Label><CheckboxGroup.Item name="frameworks" value="vite" />Form Vite</Label>
  </CheckboxGroup.Root>
  <button type="submit">Submit frameworks</button>
</form>

<output data-testid="basic-value">{basicValue.join(",")}</output>
<output data-testid="basic-changes"
  >{basicChanges.map((value) => value.join("+")).join(",")}</output
>
<output data-testid="basic-ref">{basicRef?.tagName ?? "missing"}</output>
<output data-testid="parent-value">{parentValue.join(",")}</output>
<output data-testid="outer-value">{outerValue.join(",")}</output>
<output data-testid="inner-value">{innerValue.join(",")}</output>
<output data-testid="submitted-value">{submitted.join(",")}</output>
<output data-testid="declined-writes">{declinedWrites}</output>
<output data-testid="disabled-select-value">{disabledSelectValue.join(",")}</output>
<output data-testid="disabled-clear-value">{disabledClearValue.join(",")}</output>
<output data-testid="canceled-value">{canceledValue.join(",")}</output>
<output data-testid="canceled-writes">{canceledWrites}</output>
<output data-testid="canceled-details">{canceledDetails.join(",")}</output>
<output data-testid="rejected-parent-value">{rejectedParentValue.join(",")}</output>
<output data-testid="rejected-parent-attempts"
  >{rejectedParentAttempts.map((attempt) => attempt.join("+")).join(",")}</output
>
