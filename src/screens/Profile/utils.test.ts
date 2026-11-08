import { describe, it, expect } from "vitest";
import { ApiError } from "../../api/client";
import { linkCardErrorMessage, LINK_CARD_FALLBACK } from "./utils";

describe("linkCardErrorMessage", () => {
  it("shows the server's card_number message", () => {
    const error = new ApiError(422, "validation_failed", "Validation failed", {
      card_number: ["is already linked to another user"],
    });
    expect(linkCardErrorMessage(error)).toBe(
      "Failed to link card: is already linked to another user",
    );
  });
  it("falls back when there is no field message", () => {
    expect(linkCardErrorMessage(new ApiError(422, "validation_failed", "x"))).toBe(
      LINK_CARD_FALLBACK,
    );
    expect(
      linkCardErrorMessage(new ApiError(500, "internal", "x", { other: ["y"] })),
    ).toBe(LINK_CARD_FALLBACK);
    expect(linkCardErrorMessage(new Error("boom"))).toBe(LINK_CARD_FALLBACK);
  });
});
