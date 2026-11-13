/**
 * Idempotency-Key values for a form that creates something (doc/api/v1/README.md, "Idempotency").
 *
 * A key is made when a request body is first submitted and reused while the same body is submitted
 * again, so a retry after a timeout or a network error cannot create a second record: the server
 * answers the repeat with the first response. A changed body gets a new key (the server refuses a
 * key reused for a different request), and `done` forgets the key once the submission succeeded.
 */
export const createSubmissionKeys = (
  newKey: () => string = () => crypto.randomUUID(),
) => {
  let last: { body: string; key: string } | null = null;
  return {
    keyFor(body: unknown): string {
      const json = JSON.stringify(body);
      if (last?.body !== json) last = { body: json, key: newKey() };
      return last.key;
    },
    done() {
      last = null;
    },
  };
};

export type SubmissionKeys = ReturnType<typeof createSubmissionKeys>;
