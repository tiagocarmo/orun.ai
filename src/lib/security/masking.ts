export type MaskingStrategy = "full" | "partial" | "hash" | "redact";

export interface MaskingRule {
  fieldName: string;
  strategy: MaskingStrategy;
}

const EMAIL_REGEX = /^([^@]+)@(.+)$/;
const PHONE_MIN_LENGTH = 4;

function maskEmailFull(_email: string): string {
  return "***@***";
}

function maskEmailPartial(email: string): string {
  const match = email.match(EMAIL_REGEX);
  if (!match) return "***";
  const [, local, domain] = match;
  if (local.length <= 2) return `${local}@${domain}`;
  return `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
}

function maskPhoneFull(phone: string): string {
  return "*".repeat(phone.length);
}

function maskPhonePartial(phone: string): string {
  if (phone.length < PHONE_MIN_LENGTH) return phone;
  const prefix = phone.slice(0, 3);
  const suffix = phone.slice(-3);
  const masked = "*".repeat(Math.max(0, phone.length - 6));
  return `${prefix}${masked}${suffix}`;
}

function maskNamePartial(name: string): string {
  if (name.length <= 1) return "*";
  if (name.length === 2) return `${name[0]}*`;
  return `${name[0]}${"*".repeat(name.length - 2)}${name[name.length - 1]}`;
}

function maskGenericFull(): string {
  return "***";
}

function maskGenericPartial(value: string): string {
  if (value.length <= 2) return "*".repeat(value.length);
  return `${value[0]}${"*".repeat(value.length - 2)}${value[value.length - 1]}`;
}

function hashValue(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `hash_${Math.abs(hash).toString(16).padStart(8, "0")}`;
}

export function maskField(value: string, strategy: MaskingStrategy, fieldName?: string): string {
  if (!value) return value;

  const isEmail = fieldName?.toLowerCase() === "email" || EMAIL_REGEX.test(value);
  const isPhone = fieldName?.toLowerCase() === "phone" || (value.startsWith("+") && value.length > 6);

  if (isEmail) {
    return strategy === "full" ? maskEmailFull(value) : maskEmailPartial(value);
  }

  if (isPhone) {
    return strategy === "full" ? maskPhoneFull(value) : maskPhonePartial(value);
  }

  switch (strategy) {
    case "full":
      return maskGenericFull();
    case "partial":
      return maskGenericPartial(value);
    case "hash":
      return hashValue(value);
    case "redact":
      return "[REDACTED]";
    default:
      return maskGenericPartial(value);
  }
}

export function maskName(name: string, strategy: MaskingStrategy = "partial"): string {
  if (!name) return name;
  if (strategy === "full") return "***";
  if (strategy === "hash") return hashValue(name);
  return maskNamePartial(name);
}

export function maskEmail(email: string, strategy: MaskingStrategy = "partial"): string {
  if (!email) return email;
  return strategy === "full" ? maskEmailFull(email) : maskEmailPartial(email);
}

export function maskPhone(phone: string, strategy: MaskingStrategy = "partial"): string {
  if (!phone) return phone;
  return strategy === "full" ? maskPhoneFull(phone) : maskPhonePartial(phone);
}

export function maskObject<T extends Record<string, unknown>>(
  obj: T,
  rules: MaskingRule[]
): T {
  const result = { ...obj };
  for (const rule of rules) {
    const value = result[rule.fieldName];
    if (typeof value === "string") {
      (result as Record<string, unknown>)[rule.fieldName] = maskField(value, rule.strategy, rule.fieldName);
    }
  }
  return result;
}

export function maskPII(data: Record<string, unknown>): Record<string, unknown> {
  const rules: MaskingRule[] = [
    { fieldName: "name", strategy: "partial" },
    { fieldName: "email", strategy: "partial" },
    { fieldName: "phone", strategy: "partial" },
    { fieldName: "company", strategy: "partial" },
    { fieldName: "externalId", strategy: "hash" },
  ];
  return maskObject(data, rules);
}

export function maskLogData(data: Record<string, unknown>): Record<string, unknown> {
  const rules: MaskingRule[] = [
    { fieldName: "name", strategy: "partial" },
    { fieldName: "email", strategy: "partial" },
    { fieldName: "phone", strategy: "partial" },
    { fieldName: "company", strategy: "partial" },
    { fieldName: "message", strategy: "redact" },
    { fieldName: "externalId", strategy: "hash" },
    { fieldName: "token", strategy: "full" },
    { fieldName: "password", strategy: "full" },
    { fieldName: "apiKey", strategy: "full" },
  ];
  return maskObject(data, rules);
}
