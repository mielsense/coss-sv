export type OTPValidationType = "alpha" | "alphanumeric" | "none" | "numeric";

export function normalizeOTP(value: string, validationType: OTPValidationType): string {
  if (validationType === "none") return value;
  if (validationType === "numeric") return value.replace(/[^0-9]/g, "");
  if (validationType === "alpha") return value.replace(/[^A-Za-z]/g, "");
  return value.replace(/[^A-Za-z0-9]/g, "");
}

export function replaceOTPRange(
  current: string,
  insertion: string,
  index: number,
  length: number,
): string {
  const slots = Array.from({ length }, (_, slot) => current[slot] ?? "");
  for (const [offset, character] of Array.from(insertion).entries()) {
    if (index + offset >= length) break;
    slots[index + offset] = character;
  }
  return slots.join("");
}
