import { Notifier } from "@airbrake/browser";

const SENSITIVE_KEY = /token|authorization|password|secret|cookie|credential/i;
const JWT = /eyJ[\w-]+\.[\w-]+\.[\w-]+/g;
const BEARER = /Bearer\s+[\w.~+/-]+=*/gi;
const REDACTED = "[Filtered]";

const scrubString = (value: string) =>
  value.replace(JWT, REDACTED).replace(BEARER, `Bearer ${REDACTED}`);

/** Redacts token-like keys and JWT/Bearer-looking strings, in place. */
export const scrub = (
  value: unknown,
  seen = new WeakSet<object>(),
  depth = 0,
): unknown => {
  if (typeof value === "string") return scrubString(value);
  if (value === null || typeof value !== "object" || depth > 12) return value;
  if (seen.has(value)) return value;
  seen.add(value);

  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (SENSITIVE_KEY.test(key)) {
      record[key] = REDACTED;
    } else {
      try {
        record[key] = scrub(record[key], seen, depth + 1);
      } catch {
        /* read-only property: leave it */
      }
    }
  }
  return value;
};

let notifier: Notifier | null = null;

/** Shared Airbrake notifier. Every notice passes through `scrub` so no token can leave the browser. */
export const airbrake = (): Notifier => {
  if (!notifier) {
    notifier = new Notifier({
      projectId: 441678,
      projectKey: "b19323e1288e612e00fc65acf1369c5c",
    });
    notifier.addFilter((notice) => {
      scrub(notice);
      return notice;
    });
  }
  return notifier;
};
