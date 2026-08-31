<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "card", "field", "form", "input"],
    containerClass:
      "**:data-[slot=preview]:w-full **:data-[slot=preview]:flex **:data-[slot=preview]:justify-center",
    id: "p-card-3",
    interactive: true,
    responsive: true,
    title: "Authentication card with separators",
  });
</script>

<script lang="ts">
  import * as Card from "@coss-sv/ui/components/ui/card";
  import { Button, Field, Form, HugeiconsIcon, Input } from "@coss-sv/ui";
  import ShieldAlertIcon from "@hugeicons/core-free-icons/ShieldAlertIcon";
</script>

<Card.Root class="w-full max-w-xs">
  <Card.Header class="border-b">
    <Card.Title>Login to your account</Card.Title>
    <Card.Description>Enter email and password to login</Card.Description>
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
  <Card.Footer class="border-t">
    <div class="flex gap-1 text-muted-foreground text-xs">
      <HugeiconsIcon
        aria-hidden="true"
        class="size-3 h-lh shrink-0"
        icon={ShieldAlertIcon}
        strokeWidth={2}
      />
      <p>The information you enter is encrypted and stored securely.</p>
    </div>
  </Card.Footer>
</Card.Root>
