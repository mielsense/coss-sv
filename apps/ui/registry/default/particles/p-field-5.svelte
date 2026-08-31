<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["field", "input"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-field-5",
    interactive: true,
    responsive: false,
    title: "Show field validity state",
  });
</script>

<script lang="ts">
  import { Field, Input } from "@coss-sv/ui";
</script>

<Field.Root>
  <Field.Label>Email</Field.Label>
  <Input placeholder="Enter your email" required type="email" />
  <Field.Validity>
    {#snippet children(validity)}
      <div class="flex w-full flex-col gap-2">
        {#if validity.error}
          <p class="text-destructive-foreground text-xs">{validity.error}</p>
        {/if}
        <div class="w-full rounded-md bg-muted p-2">
          <pre
            class="max-h-60 overflow-y-auto font-mono text-xs [scrollbar-width:none]">{JSON.stringify(
              validity,
              null,
              2,
            )}</pre>
        </div>
      </div>
    {/snippet}
  </Field.Validity>
</Field.Root>
