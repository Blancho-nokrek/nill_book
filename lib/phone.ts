import {
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

export function toE164(input: string, country: string = "BD"): string | null {
  const parsed = parsePhoneNumberFromString(
    input.trim(),
    country as CountryCode
  );
  if (!parsed || !parsed.isValid()) return null;
  return parsed.number;
}
