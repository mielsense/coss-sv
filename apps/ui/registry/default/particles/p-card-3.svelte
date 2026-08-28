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
      <svg
        aria-hidden="true"
        class="size-3 h-lh shrink-0"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
      ><path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z"></path><path
          d="m9 12 2 2 4-4"
        ></path></svg>
      <p>The information you enter is encrypted and stored securely.</p>
    </div>
  </CardFooter>
</Card>
