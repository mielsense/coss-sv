<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "card", "field", "form", "input"],
    containerClass:
      "**:data-[slot=preview]:w-full **:data-[slot=preview]:flex **:data-[slot=preview]:justify-center",
    id: "p-card-2",
    interactive: true,
    responsive: true,
    title: "Authentication card with actions",
  });
</script>

<script lang="ts">
  import * as Card from "@coss-sv/ui/components/ui/card";
  import { Button, Field, Form, Input } from "@coss-sv/ui";
</script>

<Card.Root class="w-full max-w-xs">
  <Card.Header>
    <Card.Title>Login to your account</Card.Title>
    <Card.Action>
      <!-- svelte-ignore a11y_invalid_attribute -->
      <!-- biome-ignore lint/a11y/useValidAnchor: exact upstream example uses a placeholder link. -->
      <a class="text-muted-foreground text-sm leading-4.5 hover:underline" href="#">Sign up</a>
    </Card.Action>
  </Card.Header>
  <Card.Panel>
    <Form class="flex w-full flex-col gap-4">
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Input placeholder="Enter your email" type="email" />
      </Field.Root>
      <Field.Root>
        <Field.Label>Password</Field.Label>
        <Input placeholder="Enter your password" type="password" />
      </Field.Root>
      <Button class="w-full" type="submit">Login</Button>
    </Form>
  </Card.Panel>
</Card.Root>
