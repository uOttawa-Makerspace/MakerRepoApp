import { describe, it, expect } from "vitest";
import { createSubmissionKeys } from "./submissionKeys";

const counter = () => {
  let n = 0;
  return () => {
    n += 1;
    return `key-${n}`;
  };
};

describe("createSubmissionKeys", () => {
  it("reuses the key while the same body is submitted again (a retry)", () => {
    const keys = createSubmissionKeys(counter());
    const body = { space_id: 3, user_ids: [1, 2] };
    expect(keys.keyFor(body)).toBe("key-1");
    expect(keys.keyFor({ space_id: 3, user_ids: [1, 2] })).toBe("key-1");
  });

  it("makes a new key when the body changes", () => {
    const keys = createSubmissionKeys(counter());
    keys.keyFor({ space_id: 3, user_ids: [1] });
    expect(keys.keyFor({ space_id: 3, user_ids: [1, 2] })).toBe("key-2");
  });

  it("makes a new key for the next submission once one succeeded", () => {
    const keys = createSubmissionKeys(counter());
    const body = { space_id: 3 };
    keys.keyFor(body);
    keys.done();
    expect(keys.keyFor(body)).toBe("key-2");
  });

  it("uses random UUIDs by default", () => {
    const keys = createSubmissionKeys();
    const key = keys.keyFor({ a: 1 });
    expect(key).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(createSubmissionKeys().keyFor({ a: 1 })).not.toBe(key);
  });
});
