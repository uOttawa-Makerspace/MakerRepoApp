import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderToString } from "react-dom/server";
import NoAssignedSpace from "./NoAssignedSpace";

const request = vi.fn();
vi.mock("../../../api/client", () => ({
  request: (...args: unknown[]) => request(...args),
  requestWithHeaders: vi.fn(),
}));

describe("NoAssignedSpace", () => {
  it("tells the staff member they have no assigned spaces", () => {
    const html = renderToString(<NoAssignedSpace />);
    expect(html).toContain("No assigned spaces");
    expect(html).toContain("Ask an admin");
  });
});

describe("loadSpaceDashboard with no space", () => {
  beforeEach(() => request.mockReset());

  it("returns a null space, no users and the space list, without asking for presence", async () => {
    const { loadSpaceDashboard } = await import("../../../api/endpoints");
    request.mockImplementation(async (_method: string, path: string) =>
      path === "me/space" ? { space: null } : [{ id: 3, name: "Makerspace" }],
    );
    await expect(loadSpaceDashboard()).resolves.toEqual({
      space: null,
      users: [],
      spaces: [{ id: 3, name: "Makerspace" }],
      current_user: null,
    });
    expect(request.mock.calls.map((c) => c[1])).toEqual(["me/space", "spaces"]);
  });
});
