<script lang="ts">
  import { Badge, Button, InputGroup, Kbd, Label, Spinner, Toggle } from "@coss-sv/ui";
  import FixtureIcon from "./fixture-icon.svelte";

  const requirements = [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /[0-9]/, text: "At least 1 number" },
    { regex: /[a-z]/, text: "At least 1 lowercase letter" },
    { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  ];

  const passwordId = $props.id();

  let clearValue = $state("Clear me");
  let isPasswordVisible = $state(false);
  let password = $state("");
  let username = $state("");

  const strength = $derived(
    requirements.map((requirement) => ({
      met: requirement.regex.test(password),
      text: requirement.text,
    })),
  );
  const strengthScore = $derived(strength.filter((requirement) => requirement.met).length);

  function strengthColor(score: number) {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  }

  function strengthText(score: number) {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  }
</script>

<div class="parity-stack">
  <section class="w-full max-w-64" data-particle="p-input-group-1" id="p-input-group-1">
    <InputGroup.Root>
      <InputGroup.Input aria-label="Search" placeholder="Search" type="search" />
      <InputGroup.Addon>{@render icon("search", true)}</InputGroup.Addon>
    </InputGroup.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-input-group-2" id="p-input-group-2">
    <InputGroup.Root>
      <InputGroup.Input aria-label="Email" placeholder="Email" type="email" />
      <InputGroup.Addon align="inline-end">{@render icon("mail", true)}</InputGroup.Addon>
    </InputGroup.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-input-group-3" id="p-input-group-3">
    <InputGroup.Root>
      <InputGroup.Input
        aria-label="Set your URL"
        class="*:[input]:ps-0!"
        placeholder="coss"
        type="search"
      />
      <InputGroup.Addon>
        <InputGroup.Text>i.cal.com/</InputGroup.Text>
      </InputGroup.Addon>
    </InputGroup.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-input-group-4" id="p-input-group-4">
    <InputGroup.Root>
      <InputGroup.Input
        aria-label="Choose a username"
        placeholder="Choose a username"
        type="text"
      />
      <InputGroup.Addon align="inline-end">
        <InputGroup.Text>@coss.com</InputGroup.Text>
      </InputGroup.Addon>
    </InputGroup.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-input-group-5" id="p-input-group-5">
    <InputGroup.Root>
      <InputGroup.Input
        aria-label="Enter your domain"
        class="*:[input]:px-0!"
        placeholder="coss"
        type="text"
      />
      <InputGroup.Addon><InputGroup.Text>https://</InputGroup.Text></InputGroup.Addon>
      <InputGroup.Addon align="inline-end">
        <InputGroup.Text>.com</InputGroup.Text>
      </InputGroup.Addon>
    </InputGroup.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-input-group-9" id="p-input-group-9">
    <InputGroup.Root>
      <InputGroup.Input placeholder="Type to search…" type="search" />
      <InputGroup.Addon align="inline-end">
        <Button size="xs" variant="secondary">Search</Button>
      </InputGroup.Addon>
    </InputGroup.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-input-group-10" id="p-input-group-10">
    <InputGroup.Root>
      <InputGroup.Input placeholder="Type to search…" type="search" />
      <InputGroup.Addon align="inline-end"><Badge variant="info">Badge</Badge></InputGroup.Addon>
    </InputGroup.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-input-group-11" id="p-input-group-11">
    <InputGroup.Root>
      <InputGroup.Input placeholder="Search…" type="search" />
      <InputGroup.Addon align="inline-end"><Kbd>⌘K</Kbd></InputGroup.Addon>
    </InputGroup.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-input-group-13" id="p-input-group-13">
    <InputGroup.Root>
      <InputGroup.Input aria-label="Search" placeholder="Search" size="sm" type="search" />
      <InputGroup.Addon>{@render icon("search", true)}</InputGroup.Addon>
    </InputGroup.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-input-group-14" id="p-input-group-14">
    <InputGroup.Root>
      <InputGroup.Input aria-label="Search" placeholder="Search" size="lg" type="search" />
      <InputGroup.Addon>{@render icon("search", true)}</InputGroup.Addon>
    </InputGroup.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-input-group-15" id="p-input-group-15">
    <InputGroup.Root>
      <InputGroup.Input
        aria-label="Subscribe to our newsletter"
        disabled
        placeholder="Your best email"
        type="email"
      />
      <InputGroup.Addon align="inline-end">
        <Button aria-label="Subscribe" disabled size="icon-xs" variant="ghost">
          {@render icon("arrow-right", true)}
        </Button>
      </InputGroup.Addon>
    </InputGroup.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-input-group-16" id="p-input-group-16">
    <InputGroup.Root>
      <InputGroup.Input disabled placeholder="Searching…" type="search" />
      <InputGroup.Addon align="inline-end"><Spinner /></InputGroup.Addon>
    </InputGroup.Root>
  </section>

  <section class="w-full max-w-80" data-particle="p-input-group-19" id="p-input-group-19">
    <InputGroup.Root>
      <InputGroup.Textarea placeholder="Tell us about yourself…" />
      <InputGroup.Addon align="block-start" class="gap-1 rounded-t-lg border-b bg-muted/72 p-2!">
        <Toggle aria-label="Toggle bold" size="sm">{@render icon("bold", true)}</Toggle>
        <Toggle aria-label="Toggle italic" size="sm">{@render icon("italic", true)}</Toggle>
        <Button aria-label="Link" size="icon-sm" variant="ghost">
          {@render icon("link", true)}
        </Button>
      </InputGroup.Addon>
    </InputGroup.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-input-group-20" id="p-input-group-20">
    <InputGroup.Root>
      <InputGroup.Addon>{@render icon("search", true)}</InputGroup.Addon>
      <InputGroup.Input aria-label="Search" placeholder="Search" type="search" />
    </InputGroup.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-input-group-22" id="p-input-group-22">
    <InputGroup.Root>
      <InputGroup.Input
        aria-label="Text input with clear button"
        bind:value={clearValue}
        placeholder="Enter text"
        type="text"
      />
      {#if clearValue}
        <InputGroup.Addon align="inline-end">
          <Button
            aria-label="Clear input"
            onclick={() => (clearValue = "")}
            size="icon-xs"
            variant="ghost"
          >
            {@render icon("x", true)}
          </Button>
        </InputGroup.Addon>
      {/if}
    </InputGroup.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-input-group-24" id="p-input-group-24">
    <InputGroup.Root>
      <InputGroup.Input
        aria-label="Username"
        bind:value={username}
        maxlength={14}
        placeholder="Enter username"
        type="text"
      />
      <InputGroup.Addon align="inline-end">
        <InputGroup.Text aria-live="polite" class="text-xs tabular-nums" role="status">
          {username.length}/14
        </InputGroup.Text>
      </InputGroup.Addon>
    </InputGroup.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-input-group-26" id="p-input-group-26">
    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-2">
        <Label for={passwordId}>Password</Label>
        <InputGroup.Root>
          <InputGroup.Input
            aria-describedby={`${passwordId}-description`}
            bind:value={password}
            id={passwordId}
            placeholder="Password"
            type={isPasswordVisible ? "text" : "password"}
          />
          <InputGroup.Addon align="inline-end">
            <Button
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              onclick={() => (isPasswordVisible = !isPasswordVisible)}
              size="icon-xs"
              variant="ghost"
            >
              {@render icon(isPasswordVisible ? "eye-off" : "eye", true)}
            </Button>
          </InputGroup.Addon>
        </InputGroup.Root>
      </div>

      <div
        aria-label="Password strength"
        aria-valuemax="4"
        aria-valuemin="0"
        aria-valuenow={strengthScore}
        class="h-1 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        tabindex="-1"
      >
        <div
          class={`h-full ${strengthColor(strengthScore)} transition-all duration-500 ease-out`}
          style:width={`${(strengthScore / 4) * 100}%`}
        ></div>
      </div>

      <p class="font-medium text-foreground text-sm" id={`${passwordId}-description`}>
        {strengthText(strengthScore)}. Must contain:
      </p>

      <ul aria-label="Password requirements" class="flex flex-col gap-1.5">
        {#each strength as requirement (requirement.text)}
          <li class="flex items-center gap-2">
            {@render icon(
              requirement.met ? "check" : "x",
              true,
              requirement.met ? "size-4 text-emerald-500" : "size-4 text-muted-foreground/80",
            )}
            <span
              class={requirement.met ? "text-emerald-600 text-xs" : "text-muted-foreground text-xs"}
            >
              {requirement.text}
              <span class="sr-only">
                {requirement.met ? " - Requirement met" : " - Requirement not met"}
              </span>
            </span>
          </li>
        {/each}
      </ul>
    </div>
  </section>
</div>

{#snippet icon(
  name:
    | "arrow-right"
    | "bold"
    | "check"
    | "eye"
    | "eye-off"
    | "italic"
    | "link"
    | "mail"
    | "search"
    | "x",
  hidden = false,
  className?: string,
)}
  <FixtureIcon
    aria-hidden={hidden ? "true" : undefined}
    class={className}
    name={name === "x" ? "cancel" : name}
  />
{/snippet}

<style>
  .parity-stack {
    display: grid;
    width: 100%;
    gap: 2rem;
    place-items: center;
  }
</style>
