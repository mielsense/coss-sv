<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

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
import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
  Field,
  Form,
  Input,
} from "@coss-sv/ui";
import { ShieldAlertIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
</script>

<Card class="w-full max-w-xs">
  <CardHeader class="border-b">
    <CardTitle>Login to your account</CardTitle>
    <CardDescription>Enter email and password to login</CardDescription>
  </CardHeader>
  <CardPanel>
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
  </CardPanel>
  <CardFooter class="border-t">
    <div class="flex gap-1 text-muted-foreground text-xs">
      <HugeiconsIcon
        aria-hidden="true"
        class="size-3 h-lh shrink-0"
        icon={ShieldAlertIcon}
        strokeWidth={2}
      />
      <p>The information you enter is encrypted and stored securely.</p>
    </div>
  </CardFooter>
</Card>
