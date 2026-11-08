import { describe, it, expect } from "vitest";
import { formatDate } from "./utils";

describe("formatDate", () => {
  const now = new Date(2026, 10, 3, 0, 5); // Nov 3, 00:05 local

  it("says Today for minutes ago, even across no midnight", () => {
    expect(formatDate(new Date(2026, 10, 3, 0, 1).toISOString(), now)).toBe("Today");
  });
  it("says Today for later the same day", () => {
    expect(
      formatDate(
        new Date(2026, 10, 3, 23, 59).toISOString(),
        new Date(2026, 10, 3, 23, 59, 30),
      ),
    ).toBe("Today");
  });
  it("says Yesterday across midnight, even a few minutes apart", () => {
    expect(formatDate(new Date(2026, 10, 2, 23, 58).toISOString(), now)).toBe(
      "Yesterday",
    );
  });
  it("says Yesterday for almost 48h earlier on the previous date", () => {
    expect(
      formatDate(
        new Date(2026, 10, 2, 0, 10).toISOString(),
        new Date(2026, 10, 3, 23, 50),
      ),
    ).toBe("Yesterday");
  });
  it("counts older days by calendar date", () => {
    expect(formatDate(new Date(2026, 10, 1, 23, 0).toISOString(), now)).toBe(
      "2 days ago",
    );
  });
  it("falls back to a date after a week", () => {
    expect(formatDate(new Date(2026, 9, 20, 12).toISOString(), now)).toBe("Oct 20");
  });
});
