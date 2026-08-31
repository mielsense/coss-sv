<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "dialog"],
    id: "p-dialog-5",
    iframeHeight: 640,
    interactive: true,
    responsive: true,
    title: "Scrollable terms dialog",
  });
</script>

<script lang="ts">
  import { Button, buttonVariants, Dialog } from "@coss-sv/ui";

  const sections = [
    [
      "Acceptance of Terms",
      "By accessing and using this website, users agree to comply with and be bound by these Terms of Service. Users who do not agree with these terms should discontinue use of the website immediately.",
    ],
    [
      "User Account Responsibilities",
      "Users are responsible for maintaining the confidentiality of their account credentials. Any activities occurring under a user's account are the sole responsibility of the account holder. Users must notify the website administrators immediately of any unauthorized account access.",
    ],
    [
      "Content Usage and Restrictions",
      "The website and its original content are protected by intellectual property laws. Users may not reproduce, distribute, modify, create derivative works, or commercially exploit any content without explicit written permission from the website owners.",
    ],
    [
      "Limitation of Liability",
      "The website provides content “as is” without any warranties. The website owners shall not be liable for direct, indirect, incidental, consequential, or punitive damages arising from user interactions with the platform.",
    ],
    [
      "Modifications to Terms",
      "The website reserves the right to modify these terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.",
    ],
    [
      "Termination Clause",
      "The website may terminate or suspend user access without prior notice for violations of these terms or for any other reason deemed appropriate by the administration.",
    ],
    [
      "Governing Law",
      "These terms are governed by the laws of the jurisdiction where the website is primarily operated, without regard to conflict of law principles.",
    ],
  ] as const;
</script>

<Dialog.Root>
  <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Terms & Conditions</Dialog.Trigger>
  <Dialog.Popup class="sm:max-w-md" showCloseButton={false}>
    <Dialog.Header>
      <Dialog.Title>Terms & Conditions</Dialog.Title>
    </Dialog.Header>
    <Dialog.Panel>
      <div class="flex flex-col gap-4 [&_strong]:font-semibold [&_strong]:text-foreground">
        {#each sections.slice(0, 4) as [title, copy]}
          <div class="flex flex-col gap-1">
            <p><strong>{title}</strong></p>
            <p>{copy}</p>
          </div>
        {/each}
        <div class="flex flex-col gap-1">
          <p><strong>User Conduct Guidelines</strong></p>
          <ul class="list-disc pl-6">
            <li>Not upload harmful or malicious content</li>
            <li>Respect the rights of other users</li>
            <li>Avoid activities that could disrupt website functionality</li>
            <li>Comply with applicable local and international laws</li>
          </ul>
        </div>
        {#each sections.slice(4) as [title, copy]}
          <div class="flex flex-col gap-1">
            <p><strong>{title}</strong></p>
            <p>{copy}</p>
          </div>
        {/each}
      </div>
    </Dialog.Panel>
    <Dialog.Footer>
      <Dialog.Close class={buttonVariants({ variant: "ghost" })}>Cancel</Dialog.Close><Button
        type="button"
      >
        I agree
      </Button>
    </Dialog.Footer>
  </Dialog.Popup>
</Dialog.Root>
