export type SecretLocation = "env" | "secret_manager" | "vault";

export interface SecretReference {
  name: string;
  location: SecretLocation;
  key: string;
}

export interface SecretsPolicy {
  allowDatabaseStorage: boolean;
  allowedLocations: SecretLocation[];
  requireEncryption: boolean;
  rotationIntervalDays: number;
}

const DEFAULT_POLICY: SecretsPolicy = {
  allowDatabaseStorage: false,
  allowedLocations: ["env", "secret_manager"],
  requireEncryption: true,
  rotationIntervalDays: 90,
};

let policy: SecretsPolicy = { ...DEFAULT_POLICY };

export function getSecretsPolicy(): SecretsPolicy {
  return { ...policy };
}

export function updateSecretsPolicy(updates: Partial<SecretsPolicy>): SecretsPolicy {
  policy = { ...policy, ...updates };
  return getSecretsPolicy();
}

export function validateSecretReference(ref: SecretReference): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!policy.allowedLocations.includes(ref.location)) {
    errors.push(`Secret location '${ref.location}' is not allowed. Allowed: ${policy.allowedLocations.join(", ")}`);
  }

  if (ref.location === "env" && !ref.key.startsWith("ENV_") && !ref.key.startsWith("ORUN_")) {
    errors.push("Environment variable secrets should use ENV_ or ORUN_ prefix");
  }

  return { valid: errors.length === 0, errors };
}

export function createSecretRef(name: string, location: SecretLocation, key: string): SecretReference {
  return { name, location, key };
}

export function resolveSecretRef(ref: SecretReference): { found: boolean; value?: string; error?: string } {
  const validation = validateSecretReference(ref);
  if (!validation.valid) {
    return { found: false, error: validation.errors.join("; ") };
  }

  if (ref.location === "env") {
    const value = process.env[ref.key];
    if (!value) {
      return { found: false, error: `Environment variable '${ref.key}' not set` };
    }
    return { found: true, value };
  }

  return { found: false, error: `Secret manager '${ref.location}' not configured` };
}

export function maskSecret(value: string): string {
  if (!value) return value;
  if (value.length <= 4) return "****";
  return `${value.slice(0, 2)}${"*".repeat(value.length - 4)}${value.slice(-2)}`;
}

export function redactSecretsFromLog(log: string): string {
  const patterns = [
    /(?:api[_-]?key|token|secret|password|credential)['":\s]*[=:]\s*['"]?([^\s'"`<>{}]+)/gi,
    /Bearer\s+[A-Za-z0-9._-]+/gi,
    /sk-[A-Za-z0-9]{20,}/gi,
  ];

  let redacted = log;
  for (const pattern of patterns) {
    redacted = redacted.replace(pattern, (match) => {
      const eqIndex = match.search(/[=:]/);
      if (eqIndex === -1) return "[REDACTED_SECRET]";
      const prefix = match.slice(0, eqIndex + 1);
      return `${prefix} [REDACTED_SECRET]`;
    });
  }

  return redacted;
}
