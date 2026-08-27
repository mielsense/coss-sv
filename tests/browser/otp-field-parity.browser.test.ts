import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import OTPFieldParity from "../../apps/ui/src/lib/parity/components/otp-field.svelte";

const fieldParticles = [
  ["p-otp-field-4", "Verification code", 4],
  ["p-otp-field-6", "Tier code", 6],
  ["p-otp-field-7", "Verification code", 6],
  ["p-otp-field-8", "Recovery code", 6],
  ["p-otp-field-9", "Verification code", 6],
  ["p-otp-field-10", "Access code", 6],
] as const;

describe("OTP Field parity fixture accessibility", () => {
  test("uses the Field label for the first slot in every Field particle", () => {
    render(OTPFieldParity);

    for (const [particle, fieldLabel, length] of fieldParticles) {
      const section = document.querySelector<HTMLElement>(`[data-particle="${particle}"]`);
      const slots = Array.from(
        section?.querySelectorAll<HTMLInputElement>('[data-slot="otp-field-input"]') ?? [],
      );

      expect(slots).toHaveLength(length);
      expect(slots[0]?.hasAttribute("aria-label"), particle).toBe(false);
      expect(slots[0], particle).toHaveAccessibleName(fieldLabel);
      for (const [index, slot] of slots.slice(1).entries()) {
        expect(slot, `${particle} slot ${index + 2}`).toHaveAccessibleName(
          `Character ${index + 2} of ${length}`,
        );
      }
    }
  });
});
