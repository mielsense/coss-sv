<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "input-group", "label"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-group-26",
    interactive: true,
    responsive: false,
    title: "Password input with strength indicator",
  });
</script>

<script lang="ts">
  import { Button, HugeiconsIcon, InputGroup, Label } from "@coss-sv/ui";
  import { Cancel01Icon, Tick01Icon, ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";

  const id = $props.id();
  const requirements = [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /[0-9]/, text: "At least 1 number" },
    { regex: /[a-z]/, text: "At least 1 lowercase letter" },
    { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  ];
  let password = $state("");
  let visible = $state(false);
  const strength = $derived(
    requirements.map((requirement) => ({
      met: requirement.regex.test(password),
      text: requirement.text,
    })),
  );
  const score = $derived(strength.filter((requirement) => requirement.met).length);
  function strengthColor(value: number) {
    if (value === 0) return "bg-border";
    if (value <= 1) return "bg-red-500";
    if (value <= 2) return "bg-orange-500";
    if (value === 3) return "bg-amber-500";
    return "bg-emerald-500";
  }
  function strengthText(value: number) {
    if (value === 0) return "Enter a password";
    if (value <= 2) return "Weak password";
    if (value === 3) return "Medium password";
    return "Strong password";
  }
</script>

<div class="flex flex-col gap-3">
  <div class="flex flex-col gap-2">
    <Label for={id}>Password</Label>
    <InputGroup.Root>
      <InputGroup.Input
        aria-describedby="{id}-description"
        {id}
        bind:value={password}
        placeholder="Password"
        type={visible ? "text" : "password"}
      />
      <InputGroup.Addon align="inline-end">
        <Button
          aria-label={visible ? "Hide password" : "Show password"}
          onclick={() => (visible = !visible)}
          size="icon-xs"
          variant="ghost"
        >
          <HugeiconsIcon
            aria-hidden="true"
            icon={visible ? ViewOffIcon : ViewIcon}
            strokeWidth={2}
          />
        </Button>
      </InputGroup.Addon>
    </InputGroup.Root>
  </div>
  <div
    aria-label="Password strength"
    aria-valuemax={4}
    aria-valuemin={0}
    aria-valuenow={score}
    class="h-1 w-full overflow-hidden rounded-full bg-border"
    role="progressbar"
    tabindex="-1"
  >
    <div
      class="h-full {strengthColor(score)} transition-all duration-500 ease-out"
      style:width="{(score / 4) * 100}%"
    ></div>
  </div>
  <p class="font-medium text-foreground text-sm" id="{id}-description">
    {strengthText(score)}. Must contain:
  </p>
  <ul aria-label="Password requirements" class="flex flex-col gap-1.5">
    {#each strength as requirement (requirement.text)}
      <li class="flex items-center gap-2">
        <HugeiconsIcon
          aria-hidden="true"
          class="size-4 {requirement.met ? 'text-emerald-500' : 'text-muted-foreground/80'}"
          icon={requirement.met ? Tick01Icon : Cancel01Icon}
          strokeWidth={2}
        />
        <span class="text-xs {requirement.met ? 'text-emerald-600' : 'text-muted-foreground'}">
          {requirement.text}
          <span class="sr-only"
            >{requirement.met ? " - Requirement met" : " - Requirement not met"}</span
          >
        </span>
      </li>
    {/each}
  </ul>
</div>
