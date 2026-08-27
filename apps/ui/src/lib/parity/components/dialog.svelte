<script lang="ts">
import {
  AlertDialog,
  Button,
  Dialog,
  Field,
  Form,
  Input,
  Menu,
  Textarea,
  buttonVariants,
} from "@coss-sv/ui";
let settingsOpen = $state(false);
let composeOpen = $state(false);
let confirmOpen = $state(false);
let message = $state("");
function requestCompose(next: boolean) {
  if (!next && message) confirmOpen = true;
  else composeOpen = next;
}
function submitCompose(event: SubmitEvent) {
  event.preventDefault();
  composeOpen = false;
}
</script>
<div class="fixture">
  <section data-particle="p-dialog-1">
    <Dialog.Root
      ><Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Open Dialog</Dialog.Trigger
      ><Dialog.Popup class="sm:max-w-sm"
        >{const firstProfile = $state({ name: "Margaret Welsh", username: "@maggie.welsh" })}
        <Dialog.Header
          ><Dialog.Title>Edit profile</Dialog.Title
          ><Dialog.Description
            >Make changes to your profile here. Click save when you're done.</Dialog.Description
          ></Dialog.Header
        >
        <Form class="contents"
          ><Dialog.Panel class="grid gap-4"
            ><Field.Root
              ><Field.Label>Name</Field.Label>
              <Input bind:value={firstProfile.name} type="text" /></Field.Root
            ><Field.Root
              ><Field.Label>Username</Field.Label>
              <Input bind:value={firstProfile.username} type="text" /></Field.Root
            ></Dialog.Panel
          ><Dialog.Footer
            ><Dialog.Close class={buttonVariants({ variant: "ghost" })}>Cancel</Dialog.Close
            ><Button type="submit">Save</Button></Dialog.Footer
          ></Form
        ></Dialog.Popup
      ></Dialog.Root
    >
  </section>
  <section data-particle="p-dialog-2">
    <Menu.Root
      ><Menu.Trigger class={buttonVariants({ variant: "outline" })}>Open menu</Menu.Trigger
      ><Menu.Popup align="start"
        ><Menu.Item onclick={() => (settingsOpen = true)}>Open dialog</Menu.Item></Menu.Popup
      ></Menu.Root
    ><Dialog.Root bind:open={settingsOpen}
      ><Dialog.Popup
        ><Dialog.Header
          ><Dialog.Title>Settings</Dialog.Title
          ><Dialog.Description>Change your preferences</Dialog.Description></Dialog.Header
        ><Dialog.Footer
          ><Dialog.Close class={buttonVariants({ variant: "ghost" })}
            >Close</Dialog.Close
          ></Dialog.Footer
        ></Dialog.Popup
      ></Dialog.Root
    >
  </section>
  <section data-particle="p-dialog-3">
    <Dialog.Root
      ><Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Open parent</Dialog.Trigger
      ><Dialog.Popup showCloseButton={false}
        ><Dialog.Header
          ><Dialog.Title>Manage team member</Dialog.Title
          ><Dialog.Description
            >View and manage a user in your team.</Dialog.Description
          ></Dialog.Header
        ><Dialog.Panel class="grid gap-4"
          ><div class="grid gap-1">
            <p class="text-muted-foreground text-sm">Name</p>
            <p class="font-medium text-sm">Bora Baloglu</p>
          </div>
          <div class="grid gap-1">
            <p class="text-muted-foreground text-sm">Email</p>
            <p class="font-medium text-sm">bora@example.com</p>
          </div></Dialog.Panel
        ><Dialog.Footer
          ><Dialog.Root
            ><Dialog.Trigger class={buttonVariants({ variant: "outline" })}
              >Edit details</Dialog.Trigger
            ><Dialog.Popup showCloseButton={false}
              >{const member = $state({ email: "bora@example.com", name: "Bora Baloglu" })}
              <Dialog.Header
                ><Dialog.Title>Edit details</Dialog.Title
                ><Dialog.Description
                  >Make changes to the member's information.</Dialog.Description
                ></Dialog.Header
              ><Dialog.Panel class="grid gap-4"
                ><Field.Root
                  ><Field.Label>Name</Field.Label>
                  <Input bind:value={member.name} type="text" /></Field.Root
                ><Field.Root
                  ><Field.Label>Email</Field.Label>
                  <Input bind:value={member.email} type="text" /></Field.Root
                ></Dialog.Panel
              ><Dialog.Footer
                ><Dialog.Close class={buttonVariants({ variant: "ghost" })}>Cancel</Dialog.Close
                ><Button type="submit">Save changes</Button></Dialog.Footer
              ></Dialog.Popup
            ></Dialog.Root
          ></Dialog.Footer
        ></Dialog.Popup
      ></Dialog.Root
    >
  </section>
  <section data-particle="p-dialog-4">
    <Dialog.Root onOpenChange={requestCompose} open={composeOpen}
      ><Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Compose</Dialog.Trigger
      ><Dialog.Popup showCloseButton={false}
        ><Dialog.Header
          ><Dialog.Title>New message</Dialog.Title
          ><Dialog.Description>Type something and try closing.</Dialog.Description></Dialog.Header
        >
        <Form class="contents" onsubmit={submitCompose}
          ><Dialog.Panel><Field.Root><Textarea bind:value={message} /></Field.Root></Dialog.Panel
          ><Dialog.Footer
            ><Dialog.Close class={buttonVariants({ variant: "ghost" })}>Cancel</Dialog.Close
            ><Button onclick={() => { message = ""; composeOpen = false; }}
              >Send</Button
            ></Dialog.Footer
          ></Form
        ></Dialog.Popup
      ><AlertDialog.Root bind:open={confirmOpen}
        ><AlertDialog.Popup
          ><AlertDialog.Header
            ><AlertDialog.Title>Discard changes?</AlertDialog.Title
            ><AlertDialog.Description
              >Your message will be lost.</AlertDialog.Description
            ></AlertDialog.Header
          ><AlertDialog.Footer
            ><AlertDialog.Close class={buttonVariants({ variant: "ghost" })}
              >Go back</AlertDialog.Close
            ><Button onclick={() => { confirmOpen = false; message = ""; composeOpen = false; }}
              >Discard</Button
            ></AlertDialog.Footer
          ></AlertDialog.Popup
        ></AlertDialog.Root
      ></Dialog.Root
    >
  </section>
  <section data-particle="p-dialog-5">
    <Dialog.Root
      ><Dialog.Trigger class={buttonVariants({ variant: "outline" })}
        >Terms &amp; Conditions</Dialog.Trigger
      ><Dialog.Popup class="sm:max-w-md" showCloseButton={false}
        ><Dialog.Header><Dialog.Title>Terms &amp; Conditions</Dialog.Title></Dialog.Header
        ><Dialog.Panel
          ><div class="flex flex-col gap-4 [&_strong]:font-semibold [&_strong]:text-foreground">
            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-1">
                <p><strong>Acceptance of Terms</strong></p>
                <p>
                  By accessing and using this website, users agree to comply with and be bound by
                  these Terms of Service. Users who do not agree with these terms should discontinue
                  use of the website immediately.
                </p>
              </div>
              <div class="flex flex-col gap-1">
                <p><strong>User Account Responsibilities</strong></p>
                <p>
                  Users are responsible for maintaining the confidentiality of their account
                  credentials. Any activities occurring under a user's account are the sole
                  responsibility of the account holder. Users must notify the website administrators
                  immediately of any unauthorized account access.
                </p>
              </div>
              <div class="flex flex-col gap-1">
                <p><strong>Content Usage and Restrictions</strong></p>
                <p>
                  The website and its original content are protected by intellectual property laws.
                  Users may not reproduce, distribute, modify, create derivative works, or
                  commercially exploit any content without explicit written permission from the
                  website owners.
                </p>
              </div>
              <div class="flex flex-col gap-1">
                <p><strong>Limitation of Liability</strong></p>
                <p>
                  The website provides content “as is” without any warranties. The website owners
                  shall not be liable for direct, indirect, incidental, consequential, or punitive
                  damages arising from user interactions with the platform.
                </p>
              </div>
              <div class="flex flex-col gap-1">
                <p><strong>User Conduct Guidelines</strong></p>
                <ul class="list-disc pl-6">
                  <li>Not upload harmful or malicious content</li>
                  <li>Respect the rights of other users</li>
                  <li>Avoid activities that could disrupt website functionality</li>
                  <li>Comply with applicable local and international laws</li>
                </ul>
              </div>
              <div class="flex flex-col gap-1">
                <p><strong>Modifications to Terms</strong></p>
                <p>
                  The website reserves the right to modify these terms at any time. Continued use of
                  the website after changes constitutes acceptance of the new terms.
                </p>
              </div>
              <div class="flex flex-col gap-1">
                <p><strong>Termination Clause</strong></p>
                <p>
                  The website may terminate or suspend user access without prior notice for
                  violations of these terms or for any other reason deemed appropriate by the
                  administration.
                </p>
              </div>
              <div class="flex flex-col gap-1">
                <p><strong>Governing Law</strong></p>
                <p>
                  These terms are governed by the laws of the jurisdiction where the website is
                  primarily operated, without regard to conflict of law principles.
                </p>
              </div>
            </div>
          </div></Dialog.Panel
        ><Dialog.Footer
          ><Dialog.Close class={buttonVariants({ variant: "ghost" })}>Cancel</Dialog.Close
          ><Button type="button">I agree</Button></Dialog.Footer
        ></Dialog.Popup
      ></Dialog.Root
    >
  </section>
  <section data-particle="p-dialog-6">
    <Dialog.Root
      ><Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Open Dialog</Dialog.Trigger
      ><Dialog.Popup class="sm:max-w-sm"
        >{const bareProfile = $state({ name: "Margaret Welsh", username: "@maggie.welsh" })}
        <Dialog.Header
          ><Dialog.Title>Edit profile</Dialog.Title
          ><Dialog.Description
            >Make changes to your profile here. Click save when you're done.</Dialog.Description
          ></Dialog.Header
        >
        <Form class="contents"
          ><Dialog.Panel class="grid gap-4"
            ><Field.Root
              ><Field.Label>Name</Field.Label>
              <Input bind:value={bareProfile.name} type="text" /></Field.Root
            ><Field.Root
              ><Field.Label>Username</Field.Label>
              <Input bind:value={bareProfile.username} type="text" /></Field.Root
            ></Dialog.Panel
          ><Dialog.Footer variant="bare"
            ><Dialog.Close class={buttonVariants({ variant: "ghost" })}>Cancel</Dialog.Close
            ><Button type="submit">Save</Button></Dialog.Footer
          ></Form
        ></Dialog.Popup
      ></Dialog.Root
    >
  </section>
</div>
<style>
.fixture {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
  gap: 3rem;
  padding: 2rem;
}
.fixture > section {
  display: flex;
  min-height: 12rem;
  align-items: center;
  justify-content: center;
}
</style>
