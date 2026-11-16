import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTrainingSession } from "./endpoints";

const { request } = vi.hoisted(() => ({ request: vi.fn() }));
vi.mock("./client", () => ({
  api: {},
  endSession: vi.fn(),
  REFRESH_TIMEOUT_MS: 10_000,
  request: (...args: unknown[]) => request(...args),
  requestWithHeaders: vi.fn(),
  seg: (value: string | number) => encodeURIComponent(String(value)),
}));

describe("createTrainingSession", () => {
  beforeEach(() => request.mockReset().mockResolvedValue({ id: 12 }));

  it("posts the body with the given Idempotency-Key header", async () => {
    const body = {
      space_id: 3,
      training_id: 4,
      level: "Beginner",
      course: "ENG 101",
      user_ids: [88],
    };
    await expect(createTrainingSession(body, "key-1")).resolves.toEqual({ id: 12 });
    expect(request).toHaveBeenCalledWith("post", "training_sessions", {
      data: body,
      headers: { "Idempotency-Key": "key-1" },
    });
  });
});
