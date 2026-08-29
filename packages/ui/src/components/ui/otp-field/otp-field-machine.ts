export type OTPValidationType = "alpha" | "alphanumeric" | "none" | "numeric";

export function normalizeOTP(value: string, validationType: OTPValidationType): string {
  const stripped = value.replace(/\s/g, "");
  if (validationType === "none") return stripped;
  if (validationType === "numeric") return stripped.replace(/[^0-9]/g, "");
  if (validationType === "alpha") return stripped.replace(/[^A-Za-z]/g, "");
  return stripped.replace(/[^A-Za-z0-9]/g, "");
}

export function normalizeOTPValueWithDetails(
  value: string | null | undefined,
  length: number,
  validationType: OTPValidationType,
  normalizeValue?: (value: string) => string,
): readonly [value: string, didRejectCharacters: boolean] {
  const raw = value ?? "";
  const stripped = raw.replace(/\s/g, "");
  let normalized = normalizeOTP(stripped, validationType);
  let didRejectCharacters = raw.length > stripped.length || stripped.length > normalized.length;

  if (normalizeValue) {
    const customNormalized = normalizeValue(normalized);
    didRejectCharacters ||= normalized.length > customNormalized.length;
    normalized = normalizeOTP(customNormalized, validationType);
    didRejectCharacters ||= customNormalized.length > normalized.length;
  }

  const characters = Array.from(normalized);
  const clamped = characters.slice(0, Math.max(0, length)).join("");
  return [clamped, didRejectCharacters || characters.length > Math.max(0, length)];
}

export function normalizeOTPValue(
  value: string | null | undefined,
  length: number,
  validationType: OTPValidationType,
  normalizeValue?: (value: string) => string,
): string {
  return normalizeOTPValueWithDetails(value, length, validationType, normalizeValue)[0];
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
